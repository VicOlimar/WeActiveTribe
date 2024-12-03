import React from 'react';
import './ProfileText.scss';

const ProfileText = ({ children }: { children?: any }) => {
  return <p className='profile-text'>{children}</p>
}

export default ProfileText;