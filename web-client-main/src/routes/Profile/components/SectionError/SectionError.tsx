import React from 'react';
import './SectionError.scss';
import ProfileButton from '../ProfileButton';

type Props = { errorMessage: string, retryText?: string, retryCallback?: any }
const SectionError = ({ errorMessage, retryText, retryCallback }: Props) => {
  return (
    <div className='section-error__container'>
      <div>
        <p className='section-error__container__message'>{errorMessage}</p>
        {
          retryText && retryCallback && <ProfileButton onClick={retryCallback}>{retryText}</ProfileButton>
        }
      </div>
    </div>
  )
}

export default SectionError;