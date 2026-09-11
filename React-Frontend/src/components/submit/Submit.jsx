import { useState, useEffect } from 'react';

const Submit = function () {
  const [formData, setFormData] = useState({
    hotel_description: '',
    ad_copy: '',
    additional_instructions: '',
  });
  const [image, setImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [resultImage, setResultImage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // previewUrl이 바뀌거나 컴포넌트가 사라질 때, 이전 미리보기 URL을 정리
  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const payload = new FormData();
      payload.append('hotel_description', formData.hotel_description);
      payload.append('ad_copy', formData.ad_copy);
      payload.append('additional_instructions', formData.additional_instructions);
      if (image) payload.append('image', image);

      const response = await fetch('/api/image-generations', {
        method: 'POST',
        body: payload,
      });

      if (!response.ok) {
        throw new Error(`서버 오류: ${response.status}`);
      }
      // blob이 아니라 JSON으로 응답옴
      const data = await response.json();
      setResultImage(data.generated_image_url); // 그냥 URL 문자열 저장
    } catch (err) {
      console.error('요청 실패:', err);
      setError('광고 이미지 생성에 실패했어요. 잠시 후 다시 시도해주세요.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <section className="sf-submit" id="submit">
        <div className="container">
          <div className="row">
            <div className="col-lg-5 sf-submit-note">
              <h2 className="sf-h2 sf-h2-light">이렇게 올리면<br />더 잘 나와요</h2>
              <ul className="sf-tip-list">
                <li>참고 설명은 구체적으로 적을수록 좋아요.</li>
                <li>참고 이미지는 광고의 분위기나 배경으로 활용됩니다.</li>
                <li>참고 이미지는 1장만 첨부할 수 있습니다.</li>
              </ul>
            </div>

            <div className="col-lg-7">
              <form className="sf-form" onSubmit={handleSubmit} noValidate>
                <div className="form-group">
                  <label htmlFor="sfhotel_description">숙소 이름이나 주소와 같은 정보를 작성해주세요</label>
                  <textarea
                    className="form-control sf-input sf-textarea"
                    id="sfhotel_description"
                    name="hotel_description"
                    rows="5"
                    value={formData.hotel_description}
                    onChange={handleChange}
                    placeholder={"광고 제작에 필요한 숙소의 이름이나 주소와 같은 정보를 작성해주세요 \n예: 펜션이름은 숲속펜션 "}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="sfad_copy">광고 제작에 필요한 문구를 작성해주세요</label>
                  <textarea
                    className="form-control sf-input sf-textarea"
                    id="sfad_copy"
                    name="ad_copy"
                    rows="5"
                    value={formData.ad_copy}
                    onChange={handleChange}
                    placeholder={"광고 문구로 담고 싶은 내용을 자유롭게 적어주세요. \n예: 여름에도 시원한 우리 펜션으로 놀러오세요."}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="sfadditional_instructions">광고 제작 시 추가로 참고해야할 내용을 작성해주세요</label>
                  <textarea
                    className="form-control sf-input sf-textarea"
                    id="sfadditional_instructions"
                    name="additional_instructions"
                    rows="5"
                    value={formData.additional_instructions}
                    onChange={handleChange}
                    placeholder={"광고 이미지 제작에 필요한 추가 내용을 자유롭게 적어주세요. \n예: A4 크기의 광고페이지로 만들어주세요."}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="sfPhoto">
                    광고 제작 시 참고 이미지 <span className="sf-label-sub">(1장)</span>
                  </label>
                  <label
                    className="sf-image-add"
                    htmlFor="sfPhoto"
                    id="sfImageAdd"
                    style={previewUrl ? { backgroundImage: `url(${previewUrl})` } : undefined}
                  >
                    {!previewUrl && (
                      <span className="sf-image-add-icon" id="sfImageAddIcon">
                        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <rect x="1.5" y="1.5" width="21" height="21" rx="2" stroke="currentColor" strokeWidth="1.5" />
                          <circle cx="8" cy="9" r="1.8" stroke="currentColor" strokeWidth="1.5" />
                          <path d="M2.5 17.5L8 12.5L11.5 15.5L16 10.5L21.5 16" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
                        </svg>
                      </span>
                    )}
                  </label>
                  <input
                    type="file"
                    id="sfPhoto"
                    name="sfPhoto"
                    accept="image/*"
                    className="sf-file-input"
                    onChange={handleImageChange}
                  />
                </div>

                {error && <p className="sf-error">{error}</p>}

                <button
                  type="submit"
                  className="sf-btn sf-btn-primary sf-btn-block"
                  id="sfSubmitBtn"
                  disabled={isLoading}
                >
                  {isLoading ? '생성 중...' : '광고 이미지 생성하기'}
                </button>
              </form>

              {resultImage && (
                <div className="sf-result-preview">
                  <h3>생성된 광고 이미지</h3>
                  <img src={resultImage} alt="생성된 광고 이미지" style={{ maxWidth: '100%' }} />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Submit;