import React from 'react';
import WeActive from './../../assets/icon.png';
import Schedule from './../../assets/schedule.png';
import './LessonsInfo.scss';
import Button from '../../../../shared/Button';
import { ECreditType } from '../../Profile';

type Props = {
  credits?: number;
  onlineCredits?: number;
  expiration?: number;
  nextLessons?: number;
  onClick?: () => void;
  onSeeMoreClick?: (type: ECreditType) => void;
}

const LessonsInfo: React.FC<Props> = ({ credits = 0, onlineCredits = 0, expiration = 0, nextLessons = 0, onClick, onSeeMoreClick = () => true }) => {
  const showClassicCreditsDetail = () => onSeeMoreClick(ECreditType.CLASSIC);

  return (
    <div className='lessons_info'>
      <div className='lessons_info__container'>
        <img className='lessons_info__image' src={WeActive} alt='we active' />
        <span className='lessons_info__text lessons_info__text-no_margin'>{`${credits} clases disponibles`}</span>
        <span className='lessons_info__text-small' onClick={showClassicCreditsDetail}>Ver más</span>
      </div>
      <div className='lessons_info__container'>
        <img className='lessons_info__image' src={Schedule} alt='schedule' />
        <span className='lessons_info__text'>{`${nextLessons} clases próximas`}</span>
      </div>
      <Button className='lessons_info__button' text='Reservar clases' onClick={onClick} />
    </div>
  );
}

export default LessonsInfo;