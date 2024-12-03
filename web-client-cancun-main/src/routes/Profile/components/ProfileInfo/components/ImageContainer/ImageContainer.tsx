import React from 'react';
import './ImageContainer.scss';
import ProfileButton from '../../../ProfileButton';

const ImageContainer = ({ image, buttonIcon, buttonText, buttonAction }: { image?: string, buttonIcon?: string, buttonText: string, buttonAction?: Function }) => {
  return (
    <div className='profile-info__content__image_container'>
      <div>
        {
          image && <img src={image} alt='section' />
        }
        <br />
        {
          buttonText && <ProfileButton image={buttonIcon} onClick={buttonAction}>{buttonText}</ProfileButton>
        }
      </div>
    </div>
  )
}

export default ImageContainer;
