import React from 'react';
import './Svg.scss'
import './WeHiit.scss';
import { isUndefined } from 'util';
import { Place } from '../../../../api/Place/Place';
import placesSvg from "./places.json";

type Props = {
  places: Place[],
  lockedPlaces?: Place[],
  hidenPlaces?: Place[],
  name: string,
  description: string,
  avatar?: string,
  duration?: number,
  onClick: Function,
  onClickUnlock: Function,
  showInstructor?: boolean,
  onInstructorClick?: Function,
  onClickVisible: Function,
}
const WeHiit = ({ onClickUnlock, places, lockedPlaces, hidenPlaces, name, description, avatar, duration, onClick, showInstructor, onInstructorClick, onClickVisible }: Props) => {

  function findPlace(location: string) {
    let place: any;
    if (places) {
      place = places!.find(place => place.location === location);
      return place;
    } if (lockedPlaces) {
      place = lockedPlaces!.find(place => place.location === location);
      return place;
    } if (hidenPlaces) {
      place = hidenPlaces!.find(place => place.location === location);
      return place;
    }
  }

  function isReserved(location: string) {
    return (isUndefined(places.find(place => place.location === location)) && places.length !== 0) || places.length === 0 ? 'place__reserved' : '';
  }

  function isLocked(location: string) {
    if (lockedPlaces) return !(isUndefined(lockedPlaces.find(place => place.location === location && place?.BlockedPlace?.visible === true))) ? 'place__locked' : '';

  }

  function isHiden(location: string) {
    if (hidenPlaces) {
      // console.log(!(isUndefined(hidenPlaces.find(place => place.location === location && place.BlockedPlace.visible === false))) ? 'place__hiden' : '')
      return !(isUndefined(hidenPlaces.find(place => place.location === location))) ? 'place__hiden' : ''
    }
  }

  return (
    <div className='we_hiit'>
{/*       <InstructorAvatar
        studioSlug='we_hiit'
        name={name}
        description={description}
        avatar={avatar}
        duration={duration}
        onClick={onInstructorClick}
        animation={showInstructor}
      /> */}
      <svg version="1.1" id="Capa_1" x="0px" y="0px"
        viewBox="0 0 1308 890" className='we_hiit__layout'>
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0021ff" />
            <stop offset="100%" stopColor="#8197ff" />
          </linearGradient>
        </defs>

        <linearGradient id="SVGID_1_" gradientUnits="userSpaceOnUse" x1="1191.5499" y1="606.4" x2="1191.5499" y2="473.2">
          <stop offset="0" style={{ stopColor: '#0021FF' }} />
          <stop offset="1" style={{ stopColor: '#8197FF' }} />
        </linearGradient>

       {placesSvg.map((place) => (
          <g
          className={`place ${isReserved(place.code)} ${isLocked(place.code)} ${isHiden(place.code)} `} 
            onClick={() => {
              if (isHiden(place.code)) onClickVisible(findPlace(place.code));
              if (isLocked(place.code)) onClickUnlock(findPlace(place.code));
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
        ))}
      </svg>
    </div>
  )
}

export default WeHiit;