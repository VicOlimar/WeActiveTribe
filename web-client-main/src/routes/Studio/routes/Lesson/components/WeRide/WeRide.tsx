import React from "react";
import "./Svg.scss";
import "./WeRide.scss";
import { isUndefined } from "util";
import InstructorAvatar from "../InstructorAvatar";
import { Place } from "../../../../../../api/Place/Place";

type Props = {
  places: { available: Place[]; locked: Place[], visible: Place[] };
  name: string;
  description: string;
  avatar?: string;
  duration?: number;
  onClick: Function;
  showInstructor?: boolean;
  onInstructorClick?: Function;
  onSwitchInstructor?: Function;
};

const WeRide = ({
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
    return places.available.find(
      (place: Place) =>
        place.location === location &&
        !places.locked.find((place) => place.location === location)
    );
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

  function isHiden(location: string) {
    return places.visible.find(place => place.location === location) ? false : true
  }

  const unlockedSlot = true;

  return (
    <div className="we_ride">
      <InstructorAvatar
        studioSlug="we_ride"
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
        x="0px"
        y="0px"
        viewBox="0 0 515 264"
        className="we_ride__layout"
      >
        <g>
          {isHiden('1') &&
            <g
              className={`place ${isReserved("1")}`}
              onClick={() => {
                if (!isReserved("1")) onClick(findPlace("1"));
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
          }
          {isHiden('2') &&
            <g
              className={`place ${isReserved("2")}`}
              onClick={() => {
                if (!isReserved("2")) onClick(findPlace("2"));
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
          }
          {isHiden('3') &&
            <g
              className={`place ${isReserved("3")}`}
              onClick={() => {
                if (!isReserved("3")) onClick(findPlace("3"));
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
          }
          {isHiden('4') &&
            <g
              className={`place ${isReserved("4")}`}
              onClick={() => {
                if (!isReserved("4")) onClick(findPlace("4"));
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
          }
          {isHiden('5') &&
            <g
              className={`place ${isReserved("5")}`}
              onClick={() => {
                if (!isReserved("5")) onClick(findPlace("5"));
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
              <circle className="st1" cx="211.2" cy="121.9" r="16.2" />
              <text transform="matrix(1 0 0 1 208.3333 125.1302)" className="">
                5
              </text>
            </g>
          }
          {isHiden('6') &&
            <g
              className={`place ${isReserved("6")}`}
              onClick={() => {
                if (!isReserved("6")) onClick(findPlace("6"));
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
                className="st2"
                cx="252.1"
                cy="121.9"
                rx="16.2"
                ry="16.2"
              />
              <text transform="matrix(1 0 0 1 249.6665 125.1302)" className="">
                6
              </text>
            </g>
          }
          {isHiden('7') &&
            <g
              className={`place ${isReserved("7")}`}
              onClick={() => {
                if (!isReserved("7")) onClick(findPlace("7"));
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
              <circle className="st4" cx="293.5" cy="121.9" r="16.2" />
              <text transform="matrix(1 0 0 1 291.1667 125.1302)" className="">
                7
              </text>
            </g>
          }
          {isHiden('8') &&
            <g
              className={`place ${isReserved("8")}`}
              onClick={() => {
                if (!isReserved("8")) onClick(findPlace("8"));
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
              <circle className="st3" cx="334.3" cy="121.9" r="16.2" />
              <text transform="matrix(1 0 0 1 331.8333 125.1302)" className="">
                8
              </text>
            </g>
          }
          {isHiden('9') &&
            <g
              className={`place ${isReserved("9")}`}
              onClick={() => {
                if (!isReserved("9")) onClick(findPlace("9"));
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
          }
          {isHiden('10') &&
            <g
              className={`place ${isReserved("10")}`}
              onClick={() => {
                if (!isReserved("10")) onClick(findPlace("10"));
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
          }
          {isHiden('11') &&
            <g
              className={`place ${isReserved("11")}`}
              onClick={() => {
                if (!isReserved("11")) onClick(findPlace("11"));
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
          }
          {isHiden('12') &&
            <g
              className={`place ${isReserved("12")}`}
              onClick={() => {
                if (!isReserved("12")) onClick(findPlace("12"));
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
          }

          {isHiden('13') &&
            <g
              className={`place ${isReserved("13")}`}
              onClick={() => {
                if (!isReserved("13")) onClick(findPlace("13"));
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
          }
          {isHiden('14') &&
            <g
              className={`place ${isReserved("14")}`}
              onClick={() => {
                if (!isReserved("14")) onClick(findPlace("14"));
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
          }
          {isHiden('15') &&
            <g
              className={`place ${isReserved("15")}`}
              onClick={() => {
                if (!isReserved("15")) onClick(findPlace("15"));
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
          }
          {isHiden('16') &&
            <g
              className={`place ${isReserved("16")}`}
              onClick={() => {
                if (!isReserved("16")) onClick(findPlace("16"));
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
          }
          {isHiden('17') &&
            <g
              className={`place ${isReserved("17")}`}
              onClick={() => {
                if (!isReserved("17")) onClick(findPlace("17"));
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
          }
          {isHiden('18') &&
            <g
              className={`place ${isReserved("18")}`}
              onClick={() => {
                if (!isReserved("18")) onClick(findPlace("18"));
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
          }
          {isHiden('19') &&
            <g
              className={`place ${isReserved("19")}`}
              onClick={() => {
                if (!isReserved("19")) onClick(findPlace("19"));
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
          }
          {isHiden('20') &&
            <g
              className={`place ${isReserved("20")}`}
              onClick={() => {
                if (!isReserved("20")) onClick(findPlace("20"));
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
          }
          {isHiden('21') &&
            <g
              className={`place ${isReserved("21")}`}
              onClick={() => {
                if (!isReserved("21")) onClick(findPlace("21"));
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
          }
          {isHiden('22') &&
            <g
              className={`place ${isReserved("22")}`}
              onClick={() => {
                if (!isReserved("22")) onClick(findPlace("22"));
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
          }
          {isHiden('23') &&
            <g
              className={`place ${isReserved("23")}`}
              onClick={() => {
                if (!isReserved("23")) onClick(findPlace("23"));
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
          }
          {isHiden('24') &&
            <g
              className={`place ${isReserved("24")}`}
              onClick={() => {
                if (!isReserved("24")) onClick(findPlace("24"));
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
          }
          {isHiden('25') &&
            <g
              className={`place ${isReserved("25")}`}
              onClick={() => {
                if (!isReserved("25")) onClick(findPlace("25"));
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
          }
          {isHiden('26') &&
            <g
              className={`place ${isReserved("26")}`}
              onClick={() => {
                if (!isReserved("26")) onClick(findPlace("26"));
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
          }
          {isHiden('27') &&
            <g
              className={`place ${isReserved("27")}`}
              onClick={() => {
                if (!isReserved("27")) onClick(findPlace("27"));
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
          }
          {isHiden('28') &&
            <g
              className={`place ${isReserved("28")}`}
              onClick={() => {
                if (!isReserved("28")) onClick(findPlace("28"));
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
          }
          {isHiden('29') &&
            <g
              className={`place ${isReserved("29")}`}
              onClick={() => {
                if (!isReserved("29")) onClick(findPlace("29"));
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
          }
          {isHiden('30') &&
            <g
              className={`place ${isReserved("30")}`}
              onClick={() => {
                if (!isReserved("30")) onClick(findPlace("30"));
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
          }
          {isHiden('31') &&
            <g
              className={`place ${isReserved("31")}`}
              onClick={() => {
                if (!isReserved("31")) onClick(findPlace("31"));
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
          }
          {isHiden('32') &&
            <g
              className={`place ${isReserved("32")}`}
              onClick={() => {
                if (!isReserved("32")) onClick(findPlace("32"));
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
          }
          {isHiden('33') &&
            <g
              className={`place ${isReserved("33")}`}
              onClick={() => {
                if (!isReserved("33")) onClick(findPlace("33"));
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
          }
        </g>
      </svg>
    </div>
  );
};

export default WeRide;
