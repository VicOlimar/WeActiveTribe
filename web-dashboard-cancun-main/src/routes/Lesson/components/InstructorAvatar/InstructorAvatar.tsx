import React, { Fragment } from 'react';
import './InstructorAvatar.scss';
import VerticalAlign from '../../../../shared/VerticalAlign';
import WeLogo from './assets/logo.png';

type Props = {
  studioSlug: string,
  name?: string,
  description?: string,
  avatar?: string,
  duration?: number,
  animation?: boolean,
  onClick?: Function
}

const InstructorAvatar = ({ studioSlug, name, description, avatar, duration, animation = false, onClick }: Props) => {

  return (
    <Fragment>
      <div className={`instructor_avatar__${studioSlug}${animation ? '-animation' : ''}`}>
        <img src={avatar ? avatar : WeLogo} className={`instructor_avatar__${studioSlug}__image`} alt='instructor avatar' />
        <div className={`instructor_avatar__${studioSlug}__image__container`} onClick={() => { if (onClick) onClick() }}>
          <div className={`instructor_avatar__${studioSlug}__image__container__info-background`}></div>
          <div className={`instructor_avatar__${studioSlug}__image__container__info`}>
            <VerticalAlign>
              <div>
                <p>
                  <span>{name}</span>
                </p>
                <p>
                  <span>{duration} minutos</span>
                </p>
              </div>
            </VerticalAlign>
          </div>
        </div>
      </div>
      <div>
        {/* <MessageBackDrop
          show={animation}
          title={name}
          message={description}
          onClose={onClick}
          needHtml={true}
          paddingTop={'15rem'}
          paddingBottom={'5rem'}
        /> */}
      </div>
    </Fragment>
  )
}

export default InstructorAvatar;