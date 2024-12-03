import React from 'react';
import './Modal.scss';

type Props = {
    show: boolean,
    children: object,
    header?: object | null,
    footer?: object | null,
    style?: object,
    className?: string,
    onClose?: Function,
}
const Modal = ({
    show = false,
    children,
    header,
    footer,
    style,
    className,
    onClose,
}: Props) => {
    return (
        <div className={`modal_container${show ? '-show' : ''}`}>
            <div className={`back-drop ${show ? 'back-drop__visible' : 'back-drop__invisible'}`} onClick={() => { if (onClose) onClose() }}></div>
            <div className={`app-modal ${show ? 'app-modal-show' : ''} ${className}`}
                style={{
                    opacity: show ? 1 : 0,
                    ...style
                }}>
                {header}
                <div className="app-modal__body">
                    {children}
                </div>
                {footer}
            </div>
        </div>
    )
}

export default Modal;