import React from "react";
import "./Svg.scss";
import "./WeRide.scss";
import { Place } from "../../../../api/Place/Place";
import { isUndefined } from "util";
import InstructorAvatar from "../InstructorAvatar";

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

const WeRide = ({
  onClickUnlock,
  places,
  name,
  description,
  avatar,
  duration,
  onClick,
  showInstructor,
  onInstructorClick,
  lockedPlaces,
  hidenPlaces,
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
  }

  function isReserved(location: string) {
    return (isUndefined(places.find((place) => place.location === location)) &&
      places.length !== 0) ||
      places.length === 0
      ? "place__reserved"
      : "";
  }

  function isLocked(location: string) {
    if (lockedPlaces)
      return !isUndefined(
        lockedPlaces.find(
          (place) =>
            place.location === location && place.BlockedPlace.visible === true
        )
      )
        ? "place__locked"
        : "";
  }

  function isHiden(location: string) {
    if (hidenPlaces) {
      return !isUndefined(
        hidenPlaces.find((place) => place.location === location)
      )
        ? "place__hidden"
        : "";
    }
  }

  return (
    <div className="we_ride">
      <InstructorAvatar
        studioSlug="we_ride"
        name={name}
        description={description}
        avatar={avatar}
        duration={duration}
        onClick={onInstructorClick}
        animation={showInstructor}
      />
      <svg
        version="1.1"
        x="0px"
        y="0px"
        viewBox="0 0 515 264"
        className="we_ride__layout"
      >
        <g>
          <g
            className={`place ${isReserved("1")} ${isLocked("1")} ${isHiden(
              "1"
            )}`}
            onClick={() => {
              if (isHiden("1")) onClickVisible(findPlace("1"));
              else if (isLocked("1")) onClickUnlock(findPlace("1"));
              else if (!isReserved("1")) {
                onClick(findPlace("1"));
              }
            }}
          >
            <linearGradient
              id="SVGID_6_"
              gradientUnits="userSpaceOnUse"
              x1="48.0333"
              y1="197.4503"
              x2="48.0333"
              y2="231.8503"
              gradientTransform="matrix(1 0 0 -1 0 266)"
            >
              <stop offset="0" style={{ stopColor: "#C10C90" }} />
              <stop offset="1" style={{ stopColor: "#CD16E7" }} />
            </linearGradient>
            <circle className="st5" cx="48" cy="51.3" r="16.2" />
            <text transform="matrix(1 0 0 1 44.8333 54.5504)" className="">
              1
            </text>
          </g>

          <g
            className={`place ${isReserved("2")} ${isLocked("2")} ${isHiden(
              "2"
            )}`}
            onClick={() => {
              if (isHiden("2")) onClickVisible(findPlace("2"));
              else if (isLocked("2")) onClickUnlock(findPlace("2"));
              else if (!isReserved("2")) onClick(findPlace("2"));
            }}
          >
            <linearGradient
              id="SVGID_7_"
              gradientUnits="userSpaceOnUse"
              x1="88.8333"
              y1="169.8836"
              x2="88.8333"
              y2="204.2836"
              gradientTransform="matrix(1 0 0 -1 0 266)"
            >
              <stop offset="0" style={{ stopColor: "#C10C90" }} />
              <stop offset="1" style={{ stopColor: "#CD16E7" }} />
            </linearGradient>
            <circle className="st6" cx="88.8" cy="78.9" r="16.2" />
            <text transform="matrix(1 0 0 1 85.5 82.1169)" className="">
              2
            </text>
          </g>

          <g
            className={`place ${isReserved("3")} ${isLocked("3")} ${isHiden(
              "3"
            )}`}
            onClick={() => {
              if (isHiden("3")) onClickVisible(findPlace("3"));
              else if (isLocked("3")) onClickUnlock(findPlace("3"));
              else if (!isReserved("3")) onClick(findPlace("3"));
            }}
          >
            <linearGradient
              id="SVGID_8_"
              gradientUnits="userSpaceOnUse"
              x1="129.6333"
              y1="144.6837"
              x2="129.6333"
              y2="179.0837"
              gradientTransform="matrix(1 0 0 -1 0 266)"
            >
              <stop offset="0" style={{ stopColor: "#C10C90" }} />
              <stop offset="1" style={{ stopColor: "#CD16E7" }} />
            </linearGradient>
            <circle className="st7" cx="129.6" cy="104.1" r="16.2" />
            <text transform="matrix(1 0 0 1 126.5 107.3171)" className="">
              3
            </text>
          </g>

          <g
            className={`place ${isReserved("4")} ${isLocked("4")} ${isHiden(
              "4"
            )}`}
            onClick={() => {
              if (isHiden("4")) onClickVisible(findPlace("4"));
              else if (isLocked("4")) onClickUnlock(findPlace("4"));
              else if (!isReserved("4")) onClick(findPlace("4"));
            }}
          >
            <linearGradient
              id="SVGID_1_"
              gradientUnits="userSpaceOnUse"
              x1="170.4333"
              y1="126.8703"
              x2="170.4333"
              y2="161.2703"
              gradientTransform="matrix(1 0 0 -1 0 266)"
            >
              <stop offset="0" style={{ stopColor: "#C10C90" }} />
              <stop offset="1" style={{ stopColor: "#CD16E7" }} />
            </linearGradient>
            <circle className="st0" cx="170.4" cy="121.9" r="16.2" />
            <text transform="matrix(1 0 0 1 167.5 125.1304)" className="">
              4
            </text>
          </g>
          <g
            className={`place ${isReserved("5")} ${isLocked("5")} ${isHiden(
              "5"
            )}`}
            onClick={() => {
              if (isHiden("5")) onClickVisible(findPlace("5"));
              else if (isLocked("5")) onClickUnlock(findPlace("5"));
              else if (!isReserved("5")) onClick(findPlace("5"));
            }}
          >
            <linearGradient
              id="SVGID_2_"
              gradientUnits="userSpaceOnUse"
              x1="211.2333"
              y1="126.8703"
              x2="211.2333"
              y2="161.2703"
              gradientTransform="matrix(1 0 0 -1 0 266)"
            >
              <stop offset="0" style={{ stopColor: "#C10C90" }} />
              <stop offset="1" style={{ stopColor: "#CD16E7" }} />
            </linearGradient>
            <circle className="st0" cx="211.2" cy="121.9" r="16.2" />
            <text transform="matrix(1 0 0 1 208.3333 125.1302)" className="">
              5
            </text>
          </g>
          <g
            className={`place ${isReserved("6")} ${isLocked("6")} ${isHiden(
              "6"
            )}`}
            onClick={() => {
              if (isHiden("6")) onClickVisible(findPlace("6"));
              else if (isLocked("6")) onClickUnlock(findPlace("6"));
              else if (!isReserved("6")) onClick(findPlace("6"));
            }}
          >
            <linearGradient
              id="SVGID_3_"
              gradientUnits="userSpaceOnUse"
              x1="-18.0325"
              y1="269.3807"
              x2="-18.0325"
              y2="303.7807"
              gradientTransform="matrix(0.1602 -0.9871 -0.9871 -0.1602 537.9125 150.04)"
            >
              <stop offset="0" style={{ stopColor: "#C10C90" }} />
              <stop offset="1" style={{ stopColor: "#CD16E7" }} />
            </linearGradient>
            <ellipse
              transform="matrix(0.3162 -0.9487 0.9487 0.3162 56.7305 322.57)"
              className="st0"
              cx="252.1"
              cy="121.9"
              rx="16.2"
              ry="16.2"
            />
            <text transform="matrix(1 0 0 1 249.6665 125.1302)" className="">
              6
            </text>
          </g>
          <g
            className={`place ${isReserved("7")} ${isLocked("7")} ${isHiden(
              "7"
            )}`}
            onClick={() => {
              if (isHiden("7")) onClickVisible(findPlace("7"));
              else if (isLocked("7")) onClickUnlock(findPlace("7"));
              else if (!isReserved("7")) onClick(findPlace("7"));
            }}
          >
            <linearGradient
              id="SVGID_5_"
              gradientUnits="userSpaceOnUse"
              x1="293.5334"
              y1="126.8703"
              x2="293.5334"
              y2="161.2703"
              gradientTransform="matrix(1 0 0 -1 0 266)"
            >
              <stop offset="0" style={{ stopColor: "#C10C90" }} />
              <stop offset="1" style={{ stopColor: "#CD16E7" }} />
            </linearGradient>
            <circle className="st0" cx="293.5" cy="121.9" r="16.2" />
            <text transform="matrix(1 0 0 1 291.1667 125.1302)" className="">
              7
            </text>
          </g>
          <g
            className={`place ${isReserved("8")} ${isLocked("8")} ${isHiden(
              "8"
            )}`}
            onClick={() => {
              if (isHiden("8")) onClickVisible(findPlace("8"));
              else if (isLocked("8")) onClickUnlock(findPlace("8"));
              else if (!isReserved("8")) onClick(findPlace("8"));
            }}
          >
            <linearGradient
              id="SVGID_4_"
              gradientUnits="userSpaceOnUse"
              x1="334.3333"
              y1="126.8703"
              x2="334.3333"
              y2="161.2703"
              gradientTransform="matrix(1 0 0 -1 0 266)"
            >
              <stop offset="0" style={{ stopColor: "#C10C90" }} />
              <stop offset="1" style={{ stopColor: "#CD16E7" }} />
            </linearGradient>
            <circle className="st0" cx="334.3" cy="121.9" r="16.2" />
            <text transform="matrix(1 0 0 1 331.8333 125.1302)" className="">
              8
            </text>
          </g>
          <g
            className={`place ${isReserved("9")} ${isLocked("9")} ${isHiden(
              "9"
            )}`}
            onClick={() => {
              if (isHiden("9")) onClickVisible(findPlace("9"));
              else if (isLocked("9")) onClickUnlock(findPlace("9"));
              else if (!isReserved("9")) onClick(findPlace("9"));
            }}
          >
            <linearGradient
              id="SVGID_27_"
              gradientUnits="userSpaceOnUse"
              x1="375.1333"
              y1="144.6837"
              x2="375.1333"
              y2="179.0837"
              gradientTransform="matrix(1 0 0 -1 0 266)"
            >
              <stop offset="0" style={{ stopColor: "#C10C90" }} />
              <stop offset="1" style={{ stopColor: "#CD16E7" }} />
            </linearGradient>
            <circle className="st28" cx="375.1" cy="104.1" r="16.2" />
            <text transform="matrix(1 0 0 1 372.1667 106.317)" className="">
              9
            </text>
          </g>
          <g
            className={`place ${isReserved("10")} ${isLocked("10")} ${isHiden(
              "10"
            )}`}
            onClick={() => {
              if (isHiden("10")) onClickVisible(findPlace("10"));
              else if (isLocked("10")) onClickUnlock(findPlace("10"));
              else if (!isReserved("10")) onClick(findPlace("10"));
            }}
          >
            <linearGradient
              id="SVGID_26_"
              gradientUnits="userSpaceOnUse"
              x1="415.9333"
              y1="169.8836"
              x2="415.9333"
              y2="204.2836"
              gradientTransform="matrix(1 0 0 -1 0 266)"
            >
              <stop offset="0" style={{ stopColor: "#C10C90" }} />
              <stop offset="1" style={{ stopColor: "#CD16E7" }} />
            </linearGradient>
            <circle className="st27" cx="415.9" cy="78.9" r="16.2" />
            <text transform="matrix(1 0 0 1 411.1667 82.1169)" className="">
              10
            </text>
          </g>
          <g
            className={`place ${isReserved("11")} ${isLocked("11")} ${isHiden(
              "11"
            )}`}
            onClick={() => {
              if (isHiden("11")) onClickVisible(findPlace("11"));
              else if (isLocked("11")) onClickUnlock(findPlace("11"));
              else if (!isReserved("11")) onClick(findPlace("11"));
            }}
          >
            <linearGradient
              id="SVGID_25_"
              gradientUnits="userSpaceOnUse"
              x1="456.7333"
              y1="197.4503"
              x2="456.7333"
              y2="231.8503"
              gradientTransform="matrix(1 0 0 -1 0 266)"
            >
              <stop offset="0" style={{ stopColor: "#C10C90" }} />
              <stop offset="1" style={{ stopColor: "#CD16E7" }} />
            </linearGradient>
            <circle className="st26" cx="456.7" cy="51.3" r="16.2" />
            <text transform="matrix(1 0 0 1 452.8333 54.5504)" className="">
              11
            </text>
          </g>
          <g
            className={`place ${isReserved("12")} ${isLocked("12")} ${isHiden(
              "12"
            )}`}
            onClick={() => {
              if (isHiden("12")) onClickVisible(findPlace("12"));
              else if (isLocked("12")) onClickUnlock(findPlace("12"));
              else if (!isReserved("12")) onClick(findPlace("12"));
            }}
          >
            <linearGradient
              id="SVGID_9_"
              gradientUnits="userSpaceOnUse"
              x1="48.0333"
              y1="153.4503"
              x2="48.0333"
              y2="187.8503"
              gradientTransform="matrix(1 0 0 -1 0 266)"
            >
              <stop offset="0" style={{ stopColor: "#C10C90" }} />
              <stop offset="1" style={{ stopColor: "#CD16E7" }} />
            </linearGradient>
            <circle className="st10" cx="48" cy="95.3" r="16.2" />
            <text transform="matrix(1 0 0 1 44.8333 98.5504)" className="">
              12
            </text>
          </g>
          <g
            className={`place ${isReserved("13")} ${isLocked("13")} ${isHiden(
              "13"
            )}`}
            onClick={() => {
              if (isHiden("13")) onClickVisible(findPlace("13"));
              else if (isLocked("13")) onClickUnlock(findPlace("13"));
              else if (!isReserved("13")) onClick(findPlace("13"));
            }}
          >
            <linearGradient
              id="SVGID_10_"
              gradientUnits="userSpaceOnUse"
              x1="88.8333"
              y1="125.8836"
              x2="88.8333"
              y2="160.2836"
              gradientTransform="matrix(1 0 0 -1 0 266)"
            >
              <stop offset="0" style={{ stopColor: "#C10C90" }} />
              <stop offset="1" style={{ stopColor: "#CD16E7" }} />
            </linearGradient>
            <circle className="st11" cx="88.8" cy="122.9" r="16.2" />
            <text transform="matrix(1 0 0 1 85.5 126.1169)" className="">
              13
            </text>
          </g>
          <g
            className={`place ${isReserved("14")} ${isLocked("14")} ${isHiden(
              "14"
            )}`}
            onClick={() => {
              if (isHiden("14")) onClickVisible(findPlace("14"));
              else if (isLocked("14")) onClickUnlock(findPlace("14"));
              else if (!isReserved("14")) onClick(findPlace("14"));
            }}
          >
            <linearGradient
              id="SVGID_11_"
              gradientUnits="userSpaceOnUse"
              x1="129.6333"
              y1="100.6837"
              x2="129.6333"
              y2="135.0837"
              gradientTransform="matrix(1 0 0 -1 0 266)"
            >
              <stop offset="0" style={{ stopColor: "#C10C90" }} />
              <stop offset="1" style={{ stopColor: "#CD16E7" }} />
            </linearGradient>
            <circle className="st12" cx="129.6" cy="148.1" r="16.2" />
            <text transform="matrix(1 0 0 1 126.5 151.3171)" className="">
              14
            </text>
          </g>
          <g
            className={`place ${isReserved("15")} ${isLocked("15")} ${isHiden(
              "15"
            )}`}
            onClick={() => {
              if (isHiden("15")) onClickVisible(findPlace("15"));
              else if (isLocked("15")) onClickUnlock(findPlace("15"));
              else if (!isReserved("15")) onClick(findPlace("15"));
            }}
          >
            <linearGradient
              id="SVGID_15_"
              gradientUnits="userSpaceOnUse"
              x1="170.4333"
              y1="80.3703"
              x2="170.4333"
              y2="114.7703"
              gradientTransform="matrix(1 0 0 -1 0 266)"
            >
              <stop offset="0" style={{ stopColor: "#C10C90" }} />
              <stop offset="1" style={{ stopColor: "#CD16E7" }} />
            </linearGradient>
            <circle className="st16" cx="170.4" cy="168.4" r="16.2" />
            <text transform="matrix(1 0 0 1 166.5 171.6304)" className="">
              15
            </text>
          </g>
          <g
            className={`place ${isReserved("16")} ${isLocked("16")} ${isHiden(
              "16"
            )}`}
            onClick={() => {
              if (isHiden("16")) onClickVisible(findPlace("16"));
              else if (isLocked("16")) onClickUnlock(findPlace("16"));
              else if (!isReserved("16")) onClick(findPlace("16"));
            }}
          >
            <linearGradient
              id="SVGID_16_"
              gradientUnits="userSpaceOnUse"
              x1="211.2333"
              y1="80.3703"
              x2="211.2333"
              y2="114.7703"
              gradientTransform="matrix(1 0 0 -1 0 266)"
            >
              <stop offset="0" style={{ stopColor: "#C10C90" }} />
              <stop offset="1" style={{ stopColor: "#CD16E7" }} />
            </linearGradient>
            <circle className="st17" cx="211.2" cy="168.4" r="16.2" />
            <text transform="matrix(1 0 0 1 207.3333 171.6302)" className="">
              16
            </text>
          </g>
          <g
            className={`place ${isReserved("17")} ${isLocked("17")} ${isHiden(
              "17"
            )}`}
            onClick={() => {
              if (isHiden("17")) onClickVisible(findPlace("17"));
              else if (isLocked("17")) onClickUnlock(findPlace("17"));
              else if (!isReserved("17")) onClick(findPlace("17"));
            }}
          >
            <linearGradient
              id="SVGID_17_"
              gradientUnits="userSpaceOnUse"
              x1="-63.9313"
              y1="261.9316"
              x2="-63.9313"
              y2="296.3316"
              gradientTransform="matrix(0.1602 -0.9871 -0.9871 -0.1602 537.9125 150.04)"
            >
              <stop offset="0" style={{ stopColor: "#C10C90" }} />
              <stop offset="1" style={{ stopColor: "#CD16E7" }} />
            </linearGradient>
            <ellipse
              transform="matrix(0.3162 -0.9487 0.9487 0.3162 12.6169 354.3647)"
              className="st18"
              cx="252.1"
              cy="168.4"
              rx="16.2"
              ry="16.2"
            />
            <text transform="matrix(1 0 0 1 248.6665 171.6302)" className="">
              17
            </text>
          </g>
          <g
            className={`place ${isReserved("18")} ${isLocked("18")} ${isHiden(
              "18"
            )}`}
            onClick={() => {
              if (isHiden("18")) onClickVisible(findPlace("18"));
              else if (isLocked("18")) onClickUnlock(findPlace("18"));
              else if (!isReserved("18")) onClick(findPlace("18"));
            }}
          >
            <linearGradient
              id="SVGID_19_"
              gradientUnits="userSpaceOnUse"
              x1="293.5334"
              y1="80.3703"
              x2="293.5334"
              y2="114.7703"
              gradientTransform="matrix(1 0 0 -1 0 266)"
            >
              <stop offset="0" style={{ stopColor: "#C10C90" }} />
              <stop offset="1" style={{ stopColor: "#CD16E7" }} />
            </linearGradient>
            <circle className="st20" cx="293.5" cy="168.4" r="16.2" />
            <text transform="matrix(1 0 0 1 290.1667 171.6302)" className="">
              18
            </text>
          </g>
          <g
            className={`place ${isReserved("19")} ${isLocked("19")} ${isHiden(
              "19"
            )}`}
            onClick={() => {
              if (isHiden("19")) onClickVisible(findPlace("19"));
              else if (isLocked("19")) onClickUnlock(findPlace("19"));
              else if (!isReserved("19")) onClick(findPlace("19"));
            }}
          >
            <linearGradient
              id="SVGID_18_"
              gradientUnits="userSpaceOnUse"
              x1="334.3333"
              y1="80.3703"
              x2="334.3333"
              y2="114.7703"
              gradientTransform="matrix(1 0 0 -1 0 266)"
            >
              <stop offset="0" style={{ stopColor: "#C10C90" }} />
              <stop offset="1" style={{ stopColor: "#CD16E7" }} />
            </linearGradient>
            <circle className="st19" cx="334.3" cy="168.4" r="16.2" />
            <text transform="matrix(1 0 0 1 330.8333 171.6302)" className="">
              19
            </text>
          </g>
          <g
            className={`place ${isReserved("20")} ${isLocked("20")} ${isHiden(
              "20"
            )}`}
            onClick={() => {
              if (isHiden("20")) onClickVisible(findPlace("20"));
              else if (isLocked("20")) onClickUnlock(findPlace("20"));
              else if (!isReserved("20")) onClick(findPlace("20"));
            }}
          >
            <linearGradient
              id="SVGID_30_"
              gradientUnits="userSpaceOnUse"
              x1="375.1333"
              y1="100.6837"
              x2="375.1333"
              y2="135.0837"
              gradientTransform="matrix(1 0 0 -1 0 266)"
            >
              <stop offset="0" style={{ stopColor: "#C10C90" }} />
              <stop offset="1" style={{ stopColor: "#CD16E7" }} />
            </linearGradient>
            <circle className="st31" cx="375.1" cy="148.1" r="16.2" />
            <text transform="matrix(1 0 0 1 371.1667 151.317)" className="">
              20
            </text>
          </g>
          <g
            className={`place ${isReserved("21")} ${isLocked("21")} ${isHiden(
              "21"
            )}`}
            onClick={() => {
              if (isHiden("21")) onClickVisible(findPlace("21"));
              else if (isLocked("21")) onClickUnlock(findPlace("21"));
              else if (!isReserved("21")) onClick(findPlace("21"));
            }}
          >
            <linearGradient
              id="SVGID_29_"
              gradientUnits="userSpaceOnUse"
              x1="415.9333"
              y1="125.8836"
              x2="415.9333"
              y2="160.2836"
              gradientTransform="matrix(1 0 0 -1 0 266)"
            >
              <stop offset="0" style={{ stopColor: "#C10C90" }} />
              <stop offset="1" style={{ stopColor: "#CD16E7" }} />
            </linearGradient>
            <circle className="st30" cx="415.9" cy="122.9" r="16.2" />
            <text transform="matrix(1 0 0 1 411.1667 126.1169)" className="">
              21
            </text>
          </g>
          <g
            className={`place ${isReserved("22")} ${isLocked("22")} ${isHiden(
              "22"
            )}`}
            onClick={() => {
              if (isHiden("22")) onClickVisible(findPlace("22"));
              else if (isLocked("22")) onClickUnlock(findPlace("22"));
              else if (!isReserved("22")) onClick(findPlace("22"));
            }}
          >
            <linearGradient
              id="SVGID_28_"
              gradientUnits="userSpaceOnUse"
              x1="456.7333"
              y1="153.4503"
              x2="456.7333"
              y2="187.8503"
              gradientTransform="matrix(1 0 0 -1 0 266)"
            >
              <stop offset="0" style={{ stopColor: "#C10C90" }} />
              <stop offset="1" style={{ stopColor: "#CD16E7" }} />
            </linearGradient>
            <circle className="st29" cx="456.7" cy="95.3" r="16.2" />
            <text transform="matrix(1 0 0 1 450.8333 98.5504)" className="">
              22
            </text>
          </g>
          <g
            className={`place ${isReserved("23")} ${isLocked("23")} ${isHiden(
              "23"
            )}`}
            onClick={() => {
              if (isHiden("23")) onClickVisible(findPlace("23"));
              else if (isLocked("23")) onClickUnlock(findPlace("23"));
              else if (!isReserved("23")) onClick(findPlace("23"));
            }}
          >
            <linearGradient
              id="SVGID_12_"
              gradientUnits="userSpaceOnUse"
              x1="48.0333"
              y1="109.2003"
              x2="48.0333"
              y2="143.6003"
              gradientTransform="matrix(1 0 0 -1 0 266)"
            >
              <stop offset="0" style={{ stopColor: "#C10C90" }} />
              <stop offset="1" style={{ stopColor: "#CD16E7" }} />
            </linearGradient>
            <circle className="st13" cx="48" cy="139.6" r="16.2" />
            <text transform="matrix(1 0 0 1 44.8333 142.8004)" className="">
              23
            </text>
          </g>
          <g
            className={`place ${isReserved("24")} ${isLocked("24")} ${isHiden(
              "24"
            )}`}
            onClick={() => {
              if (isHiden("24")) onClickVisible(findPlace("24"));
              else if (isLocked("24")) onClickUnlock(findPlace("24"));
              else if (!isReserved("24")) onClick(findPlace("24"));
            }}
          >
            <linearGradient
              id="SVGID_13_"
              gradientUnits="userSpaceOnUse"
              x1="88.8333"
              y1="81.6336"
              x2="88.8333"
              y2="116.0336"
              gradientTransform="matrix(1 0 0 -1 0 266)"
            >
              <stop offset="0" style={{ stopColor: "#C10C90" }} />
              <stop offset="1" style={{ stopColor: "#CD16E7" }} />
            </linearGradient>
            <circle className="st14" cx="88.8" cy="167.2" r="16.2" />
            <text transform="matrix(1 0 0 1 85 170.3669)" className="">
              24
            </text>
          </g>
          <g
            className={`place ${isReserved("25")} ${isLocked("25")} ${isHiden(
              "25"
            )}`}
            onClick={() => {
              if (isHiden("25")) onClickVisible(findPlace("25"));
              else if (isLocked("25")) onClickUnlock(findPlace("25"));
              else if (!isReserved("25")) onClick(findPlace("25"));
            }}
          >
            <linearGradient
              id="SVGID_14_"
              gradientUnits="userSpaceOnUse"
              x1="129.6333"
              y1="56.4337"
              x2="129.6333"
              y2="90.8337"
              gradientTransform="matrix(1 0 0 -1 0 266)"
            >
              <stop offset="0" style={{ stopColor: "#C10C90" }} />
              <stop offset="1" style={{ stopColor: "#CD16E7" }} />
            </linearGradient>
            <circle className="st15" cx="129.6" cy="192.4" r="16.2" />
            <text transform="matrix(1 0 0 1 125.5 195.5671)" className="">
              25
            </text>
          </g>
          <g
            className={`place ${isReserved("26")} ${isLocked("26")} ${isHiden(
              "26"
            )}`}
            onClick={() => {
              if (isHiden("26")) onClickVisible(findPlace("26"));
              else if (isLocked("26")) onClickUnlock(findPlace("26"));
              else if (!isReserved("26")) onClick(findPlace("26"));
            }}
          >
            <linearGradient
              id="SVGID_20_"
              gradientUnits="userSpaceOnUse"
              x1="170.4333"
              y1="33.3703"
              x2="170.4333"
              y2="67.7703"
              gradientTransform="matrix(1 0 0 -1 0 266)"
            >
              <stop offset="0" style={{ stopColor: "#C10C90" }} />
              <stop offset="1" style={{ stopColor: "#CD16E7" }} />
            </linearGradient>
            <circle className="st21" cx="170.4" cy="215.4" r="16.2" />
            <text transform="matrix(1 0 0 1 166.5 218.6304)" className="">
              26
            </text>
          </g>
          <g
            className={`place ${isReserved("27")} ${isLocked("27")} ${isHiden(
              "27"
            )}`}
            onClick={() => {
              if (isHiden("27")) onClickVisible(findPlace("27"));
              else if (isLocked("27")) onClickUnlock(findPlace("27"));
              else if (!isReserved("27")) onClick(findPlace("27"));
            }}
          >
            <linearGradient
              id="SVGID_21_"
              gradientUnits="userSpaceOnUse"
              x1="211.2333"
              y1="33.3703"
              x2="211.2333"
              y2="67.7703"
              gradientTransform="matrix(1 0 0 -1 0 266)"
            >
              <stop offset="0" style={{ stopColor: "#C10C90" }} />
              <stop offset="1" style={{ stopColor: "#CD16E7" }} />
            </linearGradient>
            <circle className="st22" cx="211.2" cy="215.4" r="16.2" />
            <text transform="matrix(1 0 0 1 207.3333 218.6302)" className="">
              27
            </text>
          </g>
          <g
            className={`place ${isReserved("28")} ${isLocked("28")} ${isHiden(
              "28"
            )}`}
            onClick={() => {
              if (isHiden("28")) onClickVisible(findPlace("28"));
              else if (isLocked("28")) onClickUnlock(findPlace("28"));
              else if (!isReserved("28")) onClick(findPlace("28"));
            }}
          >
            <linearGradient
              id="SVGID_22_"
              gradientUnits="userSpaceOnUse"
              x1="-110.3236"
              y1="254.4025"
              x2="-110.3236"
              y2="288.8025"
              gradientTransform="matrix(0.1602 -0.9871 -0.9871 -0.1602 537.9125 150.04)"
            >
              <stop offset="0" style={{ stopColor: "#C10C90" }} />
              <stop offset="1" style={{ stopColor: "#CD16E7" }} />
            </linearGradient>
            <ellipse
              transform="matrix(0.3162 -0.9487 0.9487 0.3162 -31.9709 386.5013)"
              className="st23"
              cx="252.1"
              cy="215.4"
              rx="16.2"
              ry="16.2"
            />
            <text transform="matrix(1 0 0 1 248.6665 218.6302)" className="">
              28
            </text>
          </g>
          <g
            className={`place ${isReserved("29")} ${isLocked("29")} ${isHiden(
              "29"
            )}`}
            onClick={() => {
              if (isHiden("29")) onClickVisible(findPlace("29"));
              else if (isLocked("29")) onClickUnlock(findPlace("29"));
              else if (!isReserved("29")) onClick(findPlace("29"));
            }}
          >
            <linearGradient
              id="SVGID_24_"
              gradientUnits="userSpaceOnUse"
              x1="293.5334"
              y1="33.3703"
              x2="293.5334"
              y2="67.7703"
              gradientTransform="matrix(1 0 0 -1 0 266)"
            >
              <stop offset="0" style={{ stopColor: "#C10C90" }} />
              <stop offset="1" style={{ stopColor: "#CD16E7" }} />
            </linearGradient>
            <circle className="st25" cx="293.5" cy="215.4" r="16.2" />
            <text transform="matrix(1 0 0 1 289.1667 218.6302)" className="">
              29
            </text>
          </g>
          <g
            className={`place ${isReserved("30")} ${isLocked("30")} ${isHiden(
              "30"
            )}`}
            onClick={() => {
              if (isHiden("30")) onClickVisible(findPlace("30"));
              else if (isLocked("30")) onClickUnlock(findPlace("30"));
              else if (!isReserved("30")) onClick(findPlace("30"));
            }}
          >
            <linearGradient
              id="SVGID_23_"
              gradientUnits="userSpaceOnUse"
              x1="334.3333"
              y1="33.3703"
              x2="334.3333"
              y2="67.7703"
              gradientTransform="matrix(1 0 0 -1 0 266)"
            >
              <stop offset="0" style={{ stopColor: "#C10C90" }} />
              <stop offset="1" style={{ stopColor: "#CD16E7" }} />
            </linearGradient>
            <circle className="st24" cx="334.3" cy="215.4" r="16.2" />
            <text transform="matrix(1 0 0 1 329.8333 219)" className="">
              30
            </text>
          </g>
          <g
            className={`place ${isReserved("31")} ${isLocked("31")} ${isHiden(
              "31"
            )}`}
            onClick={() => {
              if (isHiden("31")) onClickVisible(findPlace("31"));
              else if (isLocked("31")) onClickUnlock(findPlace("31"));
              else if (!isReserved("31")) onClick(findPlace("31"));
            }}
          >
            <linearGradient
              id="SVGID_33_"
              gradientUnits="userSpaceOnUse"
              x1="375.1333"
              y1="56.4337"
              x2="375.1333"
              y2="90.8337"
              gradientTransform="matrix(1 0 0 -1 0 266)"
            >
              <stop offset="0" style={{ stopColor: "#C10C90" }} />
              <stop offset="1" style={{ stopColor: "#CD16E7" }} />
            </linearGradient>
            <circle className="st34" cx="375.1" cy="192.4" r="16.2" />
            <text transform="matrix(1 0 0 1 371.1667 195.567)" className="">
              31
            </text>
          </g>
          <g
            className={`place ${isReserved("32")} ${isLocked("32")} ${isHiden(
              "32"
            )}`}
            onClick={() => {
              if (isHiden("32")) onClickVisible(findPlace("32"));
              else if (isLocked("32")) onClickUnlock(findPlace("32"));
              else if (!isReserved("32")) onClick(findPlace("32"));
            }}
          >
            <linearGradient
              id="SVGID_32_"
              gradientUnits="userSpaceOnUse"
              x1="415.9333"
              y1="81.6336"
              x2="415.9333"
              y2="116.0336"
              gradientTransform="matrix(1 0 0 -1 0 266)"
            >
              <stop offset="0" style={{ stopColor: "#C10C90" }} />
              <stop offset="1" style={{ stopColor: "#CD16E7" }} />
            </linearGradient>
            <circle className="st33" cx="415.9" cy="167.2" r="16.2" />
            <text transform="matrix(1 0 0 1 411.1667 170.3669)" className="">
              32
            </text>
          </g>
          <g
            className={`place ${isReserved("33")} ${isLocked("33")} ${isHiden(
              "33"
            )}`}
            onClick={() => {
              if (isHiden("33")) onClickVisible(findPlace("33"));
              else if (isLocked("33")) onClickUnlock(findPlace("33"));
              else if (!isReserved("33")) onClick(findPlace("33"));
            }}
          >
            <linearGradient
              id="SVGID_31_"
              gradientUnits="userSpaceOnUse"
              x1="456.7333"
              y1="109.2003"
              x2="456.7333"
              y2="143.6003"
              gradientTransform="matrix(1 0 0 -1 0 266)"
            >
              <stop offset="0" style={{ stopColor: "#C10C90" }} />
              <stop offset="1" style={{ stopColor: "#CD16E7" }} />
            </linearGradient>
            <circle className="st32" cx="456.7" cy="139.6" r="16.2" />
            <text transform="matrix(1 0 0 1 451.8333 142.8004)" className="">
              33
            </text>
          </g>
        </g>
      </svg>
    </div>
  );
};

export default WeRide;
