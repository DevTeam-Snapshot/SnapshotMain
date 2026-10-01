// Modal.jsx
import { useEffect } from "react";
import { createPortal } from "react-dom";
import "../../assets/css/modal.css";

function Modal({ isOpen, onClose, title, headerExtra, overlay = false, children }) {    
    
    useEffect(() => {
        if (!isOpen) return;

        function onKeyDown(e) {
            if (e.key === "Escape") onClose();
        }
        document.addEventListener("keydown", onKeyDown);

        const prevOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden"; // 배경 스크롤 잠금

        return () => {
            document.removeEventListener("keydown", onKeyDown);
            document.body.style.overflow = prevOverflow;
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return createPortal(
        <div className="modal-backdrop-custom" onClick={onClose}>
            <div
                className={`modal-dialog-custom ${overlay ? 'modal-dialog-custom--overlay' : ''}`}
                role="dialog"
                aria-modal="true"
                aria-label={title}
                onClick={e => e.stopPropagation()}
            >
                <div className="modal-head-custom d-flex align-items-center gap-2">
                    {title && <span className="modal-title-custom">{title}</span>}
                    {headerExtra}
                    <button
                        type="button"
                        className="modal-close-custom ms-auto"
                        onClick={onClose}
                        aria-label="닫기"
                    >
                        <i className="bi bi-x-lg"></i>
                    </button>
                </div>
                <div className="modal-body-custom">{children}</div>
            </div>
        </div>,
        document.body
    );
}

export default Modal;