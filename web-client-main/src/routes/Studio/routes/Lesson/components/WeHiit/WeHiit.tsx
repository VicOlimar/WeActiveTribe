import React from "react";
import "./Svg.scss";
import "./WeHiit.scss";
import InstructorAvatar from "../InstructorAvatar";
import { isUndefined } from "util";
import { Place } from "../../../../../../api/Place/Place";

import placesSvg from "./places.json";

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
      ? "place__reserved"
      : (isUndefined(
          places.available.find((place: Place) => place.location === location)
        ) &&
          places.available.length !== 0) ||
        places.available.length === 0 ||
        places.locked.find((place) => place.location === location) !== undefined
      ? "place__reserved"
      : "";
  }

  function isHidden(location: string) {
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

        {placesSvg.map(
          (place) =>
            isHidden(place.code) && (
              <g
                className={`we-train-cls-7 stroke place ${isReserved(
                  place.code
                )}`}
                onClick={() => {
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
            )
        )}
      </svg>
    </div>
  );
};

export default WeHiit;
