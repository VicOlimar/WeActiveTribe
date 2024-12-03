import React from "react";
import "./Svg.scss";
import "./WeTrain.scss";
import InstructorAvatar from "../InstructorAvatar";
import { isUndefined } from "util";
import { Place } from "../../../../api/Place/Place";

import placesSvg from "./places.json";

type Props = {
  places: Place[];
  lockedPlaces?: Place[];
  hidenPlaces?: Place[];
  name: string;
  description: string;
  avatar?: string;
  duration?: number;
  onClick: Function;
  onClickUnlock: Function;
  showInstructor?: boolean;
  onInstructorClick?: Function;
  onClickVisible: Function;
};
const WeTrain = ({
  onClickUnlock,
  places,
  lockedPlaces,
  hidenPlaces,
  name,
  description,
  avatar,
  duration,
  onClick,
  showInstructor,
  onInstructorClick,
  onClickVisible,
}: Props) => {
  function findPlace(location: string) {
    let place: any;
    if (places) {
      place = places!.find((place) => place.location === location);
      return place;
    }
    if (lockedPlaces) {
      place = lockedPlaces!.find((place) => place.location === location);
      return place;
    }
    if (hidenPlaces) {
      place = hidenPlaces!.find((place) => place.location === location);
      return place;
    }
  }

  function isReserved(location: string) {
    return (isUndefined(places.find((place) => place.location === location)) &&
      places.length !== 0) ||
      places.length === 0
      ? "place__reserved"
      : "";
  }

  function isLocked(location: string) {
    if (lockedPlaces) {
      return !isUndefined(
        lockedPlaces.find(
          (place) =>
            place.location === location && place.BlockedPlace.visible === true
        )
      )
        ? "place__locked"
        : "";
    }
  }

  function isHidden(location: string) {
    if (hidenPlaces) {
      return !isUndefined(
        hidenPlaces.find((place) => place.location === location)
      )
        ? "place__hidden"
        : "";
    }
  }

  return (
    <div className="we_hiit">
      {avatar !== undefined && (
        <InstructorAvatar
          studioSlug="we_hiit"
          name={name}
          description={description}
          avatar={avatar}
          duration={duration}
          onClick={onInstructorClick}
          animation={showInstructor}
        />
      )}

      <svg
        id="Capa_1"
        data-name="Capa 1"
        xmlns="http://www.w3.org/2000/svg"
        version="1.1"
        viewBox="0 0 1265.2 593.3"
        className="we_hiit__layout"
      >
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0021ff" />
            <stop offset="100%" stopColor="#8197ff" />
          </linearGradient>
        </defs>

        <linearGradient
          id="SVGID_15_"
          gradientUnits="userSpaceOnUse"
          x1="1202.75"
          y1="83.6"
          x2="1202.75"
          y2="216.8"
          gradientTransform="matrix(1 0 0 -1 0 690)"
        >
          <stop offset="0" style={{ stopColor: "#0021FF" }} />
          <stop offset="1" style={{ stopColor: "#8197FF" }} />
        </linearGradient>

        {placesSvg.map((place) => (
          <g
            className={`we-train-cls-7 stroke place ${isReserved(
              place.code
            )} ${isLocked(place.code)} ${isHidden(place.code)}`}
            onClick={() => {
              if (isHidden(place.code)) onClickVisible(findPlace(place.code));
              if (isLocked(place.code)) onClickUnlock(findPlace(place.code));
              if (!isReserved(place.code)) onClick(findPlace(place.code));
            }}
          >
            <rect
              className="we-train-cls-2"
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
  );
};

export default WeTrain;
