import React from 'react';
import './MessageBackDrop.scss';
import CLOSE from './assets/close.png';
import SWITCH_ARROW from './assets/switch-arrow.png';
import VerticalAlign from '../VerticalAlign';

type Props = {
  show: boolean,
  title?: string,
  message?: string,
  buttonText?: string,
  buttonAction?: Function,
  onClose?: Function,
  secondaryAction?: Function,
  loading?: boolean,
  needHtml?: boolean,
  paddingTop?: string,
  paddingBottom?: string,
}

const MessageBackDrop = ({
  show = false,
  title = '',
  message = '',
  buttonText,
  buttonAction,
  onClose = () => { },
  secondaryAction,
  loading = false,
  needHtml = false,
  paddingTop = '0px',
  paddingBottom = '0px',
}: Props) => {
  let clickedButton = false;
  let clickedSwitch = false;
  return (
    <div className={`message_back_drop ${show ? 'message_back_drop-showing' : ''}`} onClick={() => {
      if (!clickedButton && !loading && !clickedSwitch) onClose();
    }}>
      <img className='message_back_drop__close' src={CLOSE} alt='close' onClick={() => {
        if (!clickedButton && !loading) onClose();
      }} />
      {
        secondaryAction && <img className='message_back_drop__secondary' src={SWITCH_ARROW} alt='secondary action' onClick={() => {
          if (!clickedButton && !loading) { clickedSwitch = true; setTimeout(() => { secondaryAction(); clickedSwitch = false; }, 100) };
        }} />
      }
      <VerticalAlign paddingTop={paddingTop} paddingBottom={paddingBottom}>
        <h3 className='message_back_drop__title'>{title}</h3>
        {
          needHtml ? <div dangerouslySetInnerHTML={{ __html: message }} className='message_back_drop__html' /> : <p className='message_back_drop__message'>{message}</p>
        }
        {
          buttonAction && <button className={`message_back_drop__button ${loading ? 'message_back_drop__button-loading' : ''}`} disabled={loading} onClick={() => { clickedButton = true; buttonAction(); }}>{loading && <i className="fa fa-spinner fa-spin"></i>} {buttonText}</button>
        }
      </VerticalAlign>
    </div>
  );
}

export default MessageBackDrop;