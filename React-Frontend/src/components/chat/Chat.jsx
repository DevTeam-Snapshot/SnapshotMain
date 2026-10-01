import { initPlanning, loadPlanning, applyTurnResponse, savePlanning } from '../../assets/utils/storage';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { sendTurn } from '../../assets/utils/chatApi';
import { uploadOriginalImage, confirmPlanning } from '../../assets/utils/planningApi'; 

const STEP_KEYS = [
    'lodging_type',
    'lodging_information',
    'selling_points',
    'target_audience',
    'mood',
    'ad_copy',
];

const STEP_PLACEHOLDERS = {
    lodging_type:        '예: 잠시 기다려 주세요...',
    lodging_type_detail: '예: 오션뷰 독채 민박집, 유스호스텔, 게스트하우스',
    // ✅ 변경: 이름과 위치를 한 번에 묻는 단계이므로 두 예시를 합침
    lodging_information: '예: 코드잇 모텔, 코드잇 리조트',
    lodging_name:        '예: 코드잇 모텔, 코드잇 리조트',
    location:            '예: 서울 마포구 합정동, 성남시 분당구',
    selling_points:      '예: 한강이 보이는 객실, 아늑하고 편안한 객실',
    lodging_service:     '예: 무료 조식, 주차 가능, 반려동물 동반가능',
    mood:                '예: 따뜻하고 아늑한, 세련된 도시 감성',
    color_preference:    '예: 네이비와 골드, 부드러운 파스텔톤, 차가운 쿨톤의 색상',
    target_audience:     '예: 20~30대 커플, 가족 여행객',
    ad_copy:             '예: 도심 속 나만의 휴식처 코드잇 호텔로 오세요',
};

// ✅ 명세의 진행 순서와 동일하게
// lodging_type → lodging_information(name, location) → selling_points → lodging_service
// → mood → color_preference → target_audience → ad_copy
const FIELD_ORDER = [
    'lodging_type',
    'lodging_type_detail',
    'lodging_name',
    'location',
    'selling_points',
    'lodging_service',
    'mood',
    'color_preference',
    'target_audience',
    'ad_copy',
];

// 선택 필드: 서버가 missing_fields로 요구할 때만 순서에 포함
const OPTIONAL_FIELDS = ['lodging_type_detail'];

function isFilled(value) {
    if (value == null) return false;
    if (typeof value === 'string') return value.trim() !== '';
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === 'object') return Object.keys(value).length > 0;
    return true;
}

function getPlaceholder(brief, missingFields = []) {
    const nextField = FIELD_ORDER.find(key => {
        if (OPTIONAL_FIELDS.includes(key) && !missingFields.includes(key)) return false;
        return !isFilled(brief?.[key]);
    });

    // 이름과 위치가 둘 다 비어 있으면 합친 예시를 보여줌
    if (nextField === 'lodging_name' && !isFilled(brief?.location)) {
        return STEP_PLACEHOLDERS.lodging_information;
    }

    return STEP_PLACEHOLDERS[nextField] ?? '메시지를 입력해주세요';
}

const Chat = function({sessionId, activeStepIndex, onStepComplete}) {

    const navigate = useNavigate(); 

    const [messages, setMessages] = useState([
        {
            id: 1,
            role: 'bot',
            text: '안녕하세요!\n어떤 숙소의 광고를 만들어드릴까요?',
            category: 'type'
        },
    ]);

    const [input, setInput] = useState('');
    const [isBotTyping, setIsBotTyping] = useState(false);

    const addMessage = (role, text, category, meta = {}) => {
        setMessages(prev => [
            ...prev,
            { id: Date.now() + Math.random(), role, text, category, ...meta }
        ]);
    };

    const submitAnswer = async (text) => {
        if (isBotTyping || !text.trim() || isAwaitingImage) return; // ✅ 가드 추가

        const planning = initPlanning(sessionId, STEP_KEYS[0]);
        const lastBot = [...messages].reverse().find(m => m.role === 'bot');

        const payload = {
            user_message: text,
            current_step: planning.current_step, // ✅ 서버가 마지막으로 알려준 값. props 아님
            brief: planning.brief,
            conversation_history: [
                { role: 'assistant', content: lastBot?.text ?? '' },
            ],
        };

        addMessage('user', text);
        setIsBotTyping(true);

        try {
            const data = await sendTurn(sessionId, payload);

            const updatedPlanning = {
                ...planning,
                brief: { ...planning.brief, ...data.brief_updates },
                current_step: data.next_step,
                completed_fields: data.completed_fields,
                missing_fields: data.missing_fields,
                is_complete: data.is_complete,
            };
            savePlanning(sessionId, updatedPlanning);

            // ✅ 이번 봇 응답이 "이미지를 요청하는 메시지"인지 판정
            const awaitingImage =
                data.missing_fields?.includes('original_image') &&
                data.completed_fields?.includes('selling_points');

            addMessage('bot', data.assistant_message, null, { awaitingImage });

            if (onStepComplete && data.next_step !== planning.current_step) {
                onStepComplete(data.next_step, data.completed_fields);
            }
        } catch (err) {
            console.error(err);
            addMessage('bot', '죄송해요, 응답 중 오류가 발생했어요.');
        } finally {
            setIsBotTyping(false);
        }
    };    

    const handleSend = async () => {
        if (!input.trim()) return;
        const userText = input;
        setInput('');
        await submitAnswer(userText);
    };

    const handleOptionClick = (optionLabel) => submitAnswer(optionLabel);

    const [imageUploaded, setImageUploaded] = useState(false);
    const fileInputRef = useRef(null);

    const previewUrlsRef = useRef([]);

    useEffect(() => {
        return () => previewUrlsRef.current.forEach(url => URL.revokeObjectURL(url));
    }, []);

    const handleImageSubmit = async (file) => {
        if (!file || imageUploaded) return;
        setImageUploaded(true);

        const planning = initPlanning(sessionId, STEP_KEYS[0]);
        const lastBot = [...messages].reverse().find(m => m.role === 'bot');
        const previewUrl = URL.createObjectURL(file);   // ✅ 미리보기 URL 생성

        setIsBotTyping(true);

        try {
            await uploadOriginalImage(sessionId, file);

            previewUrlsRef.current.push(previewUrl);    // ✅ 정리용으로 기록
            addMessage('user', '사진을 다음과 같이 업로드했어요', null, { imageUrl: previewUrl });

            const data = await sendTurn(sessionId, {
                user_message: '이미지 업로드 완료',
                current_step: planning.current_step,
                brief: planning.brief,
                conversation_history: [
                    { role: 'assistant', content: lastBot?.text ?? '' },
                ],
            });

            const updatedPlanning = {
                ...planning,
                brief: { ...planning.brief, ...data.brief_updates },
                current_step: data.next_step,
                completed_fields: data.completed_fields,
                missing_fields: data.missing_fields,
                is_complete: data.is_complete,
            };
            savePlanning(sessionId, updatedPlanning);

            addMessage('bot', data.assistant_message);

            if (onStepComplete && data.next_step !== planning.current_step) {
                onStepComplete(data.next_step, data.completed_fields);
            }
        } catch (err) {
            console.error(err);
            URL.revokeObjectURL(previewUrl);            // ✅ 실패 시 URL 해제
            setImageUploaded(false);
            addMessage('bot', '이미지 업로드에 실패했어요. 다시 시도해주세요.');
        } finally {
            setIsBotTyping(false);
        }
    };

    const lastBotMessage = [...messages].reverse().find(m => m.role === 'bot');
    const isAwaitingImage = lastBotMessage?.awaitingImage && !imageUploaded;
    
    const planning = loadPlanning(sessionId);
    const isComplete = planning?.is_complete ?? false;
    const isInputLocked = isAwaitingImage || isComplete;
    const isChoosingType = messages.length === 1;

    const placeholder = getPlaceholder(planning?.brief, planning?.missing_fields);

    const [isSubmittingFinal, setIsSubmittingFinal] = useState(false);

    const handleGoNext = async () => {
        if (isSubmittingFinal) return;
        setIsSubmittingFinal(true);

        try {
            await confirmPlanning(sessionId, planning.brief);
            navigate(`/selectad/${sessionId}`); // ✅ window.location.href 대신 이걸로 교체
        } catch (err) {
            console.error(err);
            setIsSubmittingFinal(false);
            addMessage('bot', '저장 중 오류가 발생했어요. 다시 시도해주세요.');
        }
    };

    return (
        <div className="chat-panel">
        <div className="chat-messages">
            {messages.map((msg, i) => {
                const isLastBot = msg.role === 'bot' &&
                    i === messages.map(m => m.role).lastIndexOf('bot');

                return (
                    <div key={msg.id} className="d-flex align-items-start gap-3 mb-4">
                        {msg.role === 'bot' && (
                            <div className={`bot-avatar d-flex align-items-center justify-content-center ${isLastBot ? 'bot-avatar--active' : ''}`}>
                                <i className="bi bi-robot"></i>
                            </div>
                        )}
                        <div className={msg.role === 'bot' ? 'bot-message pt-1' : 'user-message pt-1'}>
                            {msg.text}

                            {msg.imageUrl && (
                                <div className="chat-image-preview mt-2">
                                    <a href={msg.imageUrl} target="_blank" rel="noreferrer">
                                        <img src={msg.imageUrl} alt="업로드한 숙소 사진" />
                                    </a>
                                </div>
                            )}

                            {msg.role === 'bot' && msg.awaitingImage && !imageUploaded && (
                                <div className="image-upload-row mt-2">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        ref={fileInputRef}
                                        style={{ display: 'none' }}
                                        onChange={(e) => { handleImageSubmit(e.target.files?.[0]); e.target.value = ''; }}
                                    />
                                    <button
                                        className="option-card"
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        <i className="bi bi-image"></i> 사진 업로드
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                );
            })}
            {isBotTyping && (
            <div className="d-flex align-items-start gap-3 mb-4">
                <div className="bot-avatar bot-avatar--active d-flex align-items-center justify-content-center">
                <i className="bi bi-robot"></i>
                </div>
                <div className="bot-message pt-1 typing-indicator">...</div>
            </div>
            )}
        </div>

        {isChoosingType && !isInputLocked && (
            <div className="row row-cols-3 row-cols-md-5 g-2 mb-3">
                {['호텔', '모텔', '리조트', '펜션', '기타'].map(opt => (
                    <div className="col" key={opt}>
                        <button className="option-card" onClick={() => handleOptionClick(opt)}>
                            {opt}
                        </button>
                    </div>
                ))}
            </div>
        )}

        {/* 입력창: 이미지 대기 중엔 숨김 */}
        {!isInputLocked && !isChoosingType && (
            <div className="chat-input-row d-flex align-items-center px-3 py-2 gap-2 mb-2">
                <input
                    type="text"
                    className="form-control flex-grow-1"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSend()}
                    placeholder={placeholder}
                    disabled={isBotTyping}
                />
                <button className="send-btn" onClick={handleSend} disabled={isBotTyping}>
                    <i className="bi bi-send-fill"></i>
                </button>
            </div>
        )}        
        {isComplete && (
            <div className="d-flex justify-content-center mt-3 mb-2">
                <button className="btn-edit d-flex align-items-center justify-content-center gap-2 mt-2"
                    disabled={isSubmittingFinal}
                    onClick={handleGoNext}>
                        <i className="bi bi-arrow-right"></i> {isSubmittingFinal ? '저장 중...' : '다음으로'}
                </button>
            </div>
        )}
        </div>
    );
};

export default Chat;

