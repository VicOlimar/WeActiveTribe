import React from 'react';
import './ProfileButton.scss';

type Props = {
  children: any,
  image?: string,
  onClick?: any,
  className?: string,
  disabled?: boolean,
}

const ProfileButton = ({ children, image, disabled = false, onClick = () => { }, className = '' }: Props) => {
  return (
    <button disabled={disabled} className={`profile-button ${className}`} onClick={onClick}>{children} {image && <img src={image} alt='button icon' />}</button>
  )
}

export default ProfileButton;