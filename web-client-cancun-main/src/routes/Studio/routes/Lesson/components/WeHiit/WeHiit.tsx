import React from 'react';
import './Svg.scss';
import './WeHiit.scss';
import InstructorAvatar from '../InstructorAvatar';
import { isUndefined } from 'util';
import { Place } from '../../../../../../api/Place/Place';
import placesSvg from './places.json';

type Props = {
  places: { available: Place[]; locked: Place[]; visible: Place[] };
  name: string;
  description: string;
  avatar?: string;
  duration?: number;
  onClick: Function;
  showInstructor?: boolean;
  onInstructorClick?: Function;
  onSwitchInstructor?: Function;
};
const WeHiit = ({
  places,
  name,
  description,
  avatar,
  duration,
  onClick,
  showInstructor,
  onInstructorClick,
  onSwitchInstructor,
}: Props) => {
  function findPlace(location: string) {
    return places.available.find((place: Place) => place.location === location);
  }

  function isReserved(location: string) {
    return places.locked.find((place) => place.location === location)
      ? 'place__reserved'
      : (isUndefined(
          places.available.find((place: Place) => place.location === location),
        ) &&
          places.available.length !== 0) ||
        places.available.length === 0 ||
        places.locked.find((place) => place.location === location) !== undefined
      ? 'place__reserved'
      : '';
  }

  function isHiden(location: string) {
    return places.visible.find((place) => place.location === location)
      ? false
      : true;
  }

  return (
    <div className="we_hiit">
      <InstructorAvatar
        studioSlug="we_hiit"
        name={name}
        description={description}
        avatar={avatar}
        duration={duration}
        onClick={onInstructorClick}
        onSwitch={onSwitchInstructor}
        animation={showInstructor}
      />
      <svg
        version="1.1"
        id="Capa_1"
        x="0px"
        y="0px"
        viewBox="0 0 1308 890"
        className="we_hiit__layout"
      >
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0021ff" />
            <stop offset="100%" stopColor="#8197ff" />
          </linearGradient>
        </defs>

        <linearGradient
          id="SVGID_1_"
          gradientUnits="userSpaceOnUse"
          x1="1191.5499"
          y1="606.4"
          x2="1191.5499"
          y2="473.2"
        >
          <stop offset="0" style={{ stopColor: '#0021FF' }} />
          <stop offset="1" style={{ stopColor: '#8197FF' }} />
        </linearGradient>

        {placesSvg.map(
          (place) =>
            isHiden(place.code) && (
              <g
                className={`place ${isReserved(place.code)}`}
                onClick={() => {
                  if (!isReserved(place.code)) onClick(findPlace(place.code));
                }}
              >
                <rect
                  className="st0"
                  x={place.x}
                  y={place.y}
                  width={place.width}
                  height={place.height}
                />
                <text className="text" transform={place.transform}>
                  {place.name}
                </text>
              </g>
            ),
        )}
      </svg>
    </div>
  );
};

export default WeHiit;
