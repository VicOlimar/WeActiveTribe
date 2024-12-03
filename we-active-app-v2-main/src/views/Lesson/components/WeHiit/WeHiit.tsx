import React from 'react';
import { View, Dimensions } from 'react-native';
import { Place } from '../../../../services/Place/Place';
import Svg, {
  G,
  Text,
  Path,
  Defs,
  LinearGradient,
  Stop,
} from 'react-native-svg';

// Styles
import bem from 'react-native-bem';
// @ts-ignore
import styles from  './WeHiit.scss';

type Props = {
  places: {
    available: Place[],
    locked: Place[],
  },
  name: string,
  description: string,
  avatar?: string,
  duration?: number,
  onClick: Function,
  showInstructor?: boolean,
  onInstructorClick?: Function,
  onSwitchInstructor?: Function,
}
const WeHiit = ({ places, onClick }: Props) => {
  const bemStyles = (selector) => bem(selector, {}, styles);
  const weHiitColor = '#04108e';

  function findPlace(location: string) {
    return places.available.find(place => place.location === location);
  }

  function isReserved(location: string) {
    return (places.available.find(place => place.location === location) === undefined && places.available.length !== 0) ||
      places.available.length === 0 ||
      places.locked.find(place => place.location === location) !== undefined ? true : false;
  }

  function getFill(location: string) {
    return isReserved(location) ? weHiitColor : 'transparent';
  }

  return (
    <View style={bemStyles('we-hiit')}>
      <Svg x="0px" y="0px"
        viewBox="0 50 1408 350" style={[bemStyles('we-hiit__layout'), { width: Dimensions.get('window').width }]}>
        <Defs>
          <LinearGradient id="SVGID_15_" gradientUnits="userSpaceOnUse" x1="1202.75" y1="83.6" x2="1202.75" y2="216.8" gradientTransform="matrix(1 0 0 -1 0 690)">
            <Stop offset="0" stopColor='#0021FF' />
            <Stop offset="1" stopColor='#8197FF' />
          </LinearGradient>
        </Defs>
        <G fill={getFill('1A')}>
          <Path onPress={() => {
            if (!isReserved('1A')) onClick(findPlace('1A'));
          }} stroke='url(#SVGID_15_)' strokeWidth={3} strokeMiterlimit={10} d="M1218.4,604.9H1165V474.7h53.4c12.2,0,22.1,9.9,22.1,22.1v86.1C1240.4,595,1230.5,604.9,1218.4,604.9z" />
          <Text fill='#ffffff' transform="matrix(1 0 0 1 1191.1809 544)">1</Text>
        </G>
        
        { false &&
        <G fill={getFill('1B')}>
          <Path onPress={() => {
            if (!isReserved('1B')) onClick(findPlace('1B'));
          }} stroke='url(#SVGID_15_)' strokeWidth={3} strokeMiterlimit={10} d="M1103.6,474.7h53.4v130.2h-53.4c-12.2,0-22.1-9.9-22.1-22.1v-86.1C1081.5,484.5,1091.4,474.7,1103.6,474.7z" />
          <Text fill='#ffffff' transform="matrix(1 0 0 1 1109.8475 544)">1</Text>
        </G>
        }

        <G fill={getFill('2A')}>
          <Path onPress={() => {
            if (!isReserved('2A')) onClick(findPlace('2A'));
          }} stroke='url(#SVGID_15_)' strokeWidth={3} strokeMiterlimit={10} d="M1037.2,604.9h-53.4V474.7h53.4c12.2,0,22.1,9.9,22.1,22.1v86.1C1059.2,595,1049.4,604.9,1037.2,604.9z" />
          <Text fill='#ffffff' transform="matrix(1 0 0 1 1010.1346 544)">2</Text>
        </G>

        { false &&
        <G fill={getFill('2B')}>
          <Path onPress={() => {
            if (!isReserved('2B')) onClick(findPlace('2B'));
          }} stroke='url(#SVGID_15_)' strokeWidth={3} strokeMiterlimit={10} d="M922.4,474.7h53.4v130.2h-53.4c-12.2,0-22.1-9.9-22.1-22.1v-86.1C900.4,484.5,910.2,474.7,922.4,474.7z" />
          <Text fill='#ffffff' transform="matrix(1 0 0 1 931.4679 544)">2</Text>
        </G>
        }

        <G fill={getFill('3A')}>
          <Path onPress={() => {
            if (!isReserved('3A')) onClick(findPlace('3A'));
          }} stroke='url(#SVGID_15_)' strokeWidth={3} strokeMiterlimit={10} d="M856,604.9h-53.4V474.7H856c12.2,0,22.1,9.9,22.1,22.1v86.1C878.1,595,868.2,604.9,856,604.9z" />
          <Text fill='#ffffff' transform="matrix(1 0 0 1 831.0382 544)">3</Text>
        </G>

        { false &&
        <G fill={getFill('3B')}>
          <Path onPress={() => {
            if (!isReserved('3B')) onClick(findPlace('3B'));
          }} stroke='url(#SVGID_15_)' strokeWidth={3} strokeMiterlimit={10} d="M741.3,474.7h53.4v130.2h-53.4c-12.2,0-22.1-9.9-22.1-22.1v-86.1C719.2,484.5,729.1,474.7,741.3,474.7z" />
          <Text fill='#ffffff' transform="matrix(1 0 0 1 749.0382 544)">3</Text>
        </G>
        }

        <G fill={getFill('4A')}>
          <Path onPress={() => {
            if (!isReserved('4A')) onClick(findPlace('4A'));
          }} stroke='url(#SVGID_15_)' strokeWidth={3} strokeMiterlimit={10} d="M674.9,604.9h-53.4V474.7h53.4c12.2,0,22.1,9.9,22.1,22.1v86.1C697,595,687.1,604.9,674.9,604.9z" />
          <Text fill='#ffffff' transform="matrix(1 0 0 1 652.6585 544)">4</Text>
        </G>

        { false &&
        <G fill={getFill('4B')}>
          <Path onPress={() => {
            if (!isReserved('4B')) onClick(findPlace('4B'));
          }} stroke='url(#SVGID_15_)' strokeWidth={3} strokeMiterlimit={10} d="M560.2,474.7h53.4v130.2h-53.4c-12.2,0-22.1-9.9-22.1-22.1v-86.1C538.1,484.5,548,474.7,560.2,474.7z" />
          <Text fill='#ffffff' transform="matrix(1 0 0 1 569.9919 544)">4</Text>
        </G>
        }

        <G fill={getFill('5A')}>
          <Path onPress={() => {
            if (!isReserved('5A')) onClick(findPlace('5A'));
          }} stroke='url(#SVGID_15_)' strokeWidth={3} strokeMiterlimit={10} d="M493.8,604.9h-53.4V474.7h53.4c12.2,0,22.1,9.9,22.1,22.1v86.1C515.8,595,506,604.9,493.8,604.9z" />
          <Text fill='#ffffff' transform="matrix(1 0 0 1 468.2289 544)">5</Text>
        </G>

        { false &&
        <G fill={getFill('5B')}>
          <Path onPress={() => {
            if (!isReserved('5B')) onClick(findPlace('5B'));
          }} stroke='url(#SVGID_15_)' strokeWidth={3} strokeMiterlimit={10} d="M379,474.7h53.4v130.2H379c-12.2,0-22.1-9.9-22.1-22.1v-86.1C357,484.5,366.8,474.7,379,474.7z" />
          <Text fill='#ffffff' transform="matrix(1 0 0 1 383.5623 544)">5</Text>
        </G>
        }

        <G fill={getFill('6A')}>
          <Path onPress={() => {
            if (!isReserved('6A')) onClick(findPlace('6A'));
          }} stroke='url(#SVGID_15_)' strokeWidth={3} strokeMiterlimit={10} d="M312.6,604.9h-53.4V474.7h53.4c12.2,0,22.1,9.9,22.1,22.1v86.1C334.7,595,324.8,604.9,312.6,604.9z" />
          <Text fill='#ffffff' transform="matrix(1 0 0 1 287.1826 544)">6</Text>
        </G>

        { false &&
        <G fill={getFill('6B')}>
          <Path onPress={() => {
            if (!isReserved('6B')) onClick(findPlace('6B'));
          }} stroke='url(#SVGID_15_)' strokeWidth={3} strokeMiterlimit={10} d="M197.8,474.7h53.4v130.2h-53.4c-12.2,0-22.1-9.9-22.1-22.1v-86.1C175.8,484.5,185.7,474.7,197.8,474.7z" />
          <Text fill='#ffffff' transform="matrix(1 0 0 1 209.8493 544)">6</Text>
        </G>
        }

        <G fill={getFill('7A')}>
          <Path onPress={() => {
            if (!isReserved('7A')) onClick(findPlace('7A'));
          }} stroke='url(#SVGID_15_)' strokeWidth={3} strokeMiterlimit={10} d="M106.6,605.6h-65c-12.9,0-23.5-10.6-23.5-23.5v-84.5c0-12.9,10.6-23.5,23.5-23.5h64.9 c12.9,0,23.5,10.6,23.5,23.5v84.5C130.1,595,119.5,605.6,106.6,605.6z" />
          <Text fill='#ffffff' transform="matrix(1 0 0 1 31.7804 556.6968)">CAMINADORA</Text>
          <Text fill='#ffffff' transform="matrix(1 0 0 1 71.7804 536.6968)">7</Text>
        </G>

        <G fill={getFill('7B')}>
          <Path onPress={() => {
            if (!isReserved('7B')) onClick(findPlace('7B'));
          }} stroke='url(#SVGID_15_)' strokeWidth={3} strokeMiterlimit={10} d="M104.6,158.1h-65c-12.9,0-23.5-10.6-23.5-23.5V50.1c0-12.9,10.6-23.5,23.5-23.5h64.9c12.9,0,23.5,10.6,23.5,23.5v84.5C128.1,147.5,117.5,158.1,104.6,158.1z" />
          <Text fill='#ffffff' transform="matrix(1 0 0 1 31.7804 110.693)">CAMINADORA</Text>
          <Text fill='#ffffff' transform="matrix(1 0 0 1 71.7804 90.693)">7</Text>
        </G>

        { false &&
        <G fill={getFill('8A')}>
          <Path onPress={() => {
            if (!isReserved('8A')) onClick(findPlace('8A'));
          }} stroke='url(#SVGID_15_)' strokeWidth={3} strokeMiterlimit={10} d="M161,26.7h53.4v130.2H161c-12.2,0-22.1-9.9-22.1-22.1V48.7C139,36.5,148.9,26.7,161,26.7z" />
          <Text fill='#ffffff' transform="matrix(1 0 0 1 171.9789 102)">8</Text>
        </G>
        }
        
        <G fill={getFill('8B')}>
          <Path onPress={() => {
            if (!isReserved('8B')) onClick(findPlace('8B'));
          }} stroke='url(#SVGID_15_)' strokeWidth={3} strokeMiterlimit={10} d="M275.8,156.9h-53.4V26.7h53.4c12.2,0,22.1,9.9,22.1,22.1v86.1C297.9,147,288,156.9,275.8,156.9z" />
          <Text fill='#ffffff' transform="matrix(1 0 0 1 249.3123 102)">8</Text>
        </G>

        <G fill={getFill('15B')}>
          <Path onPress={() => {
            if (!isReserved('15B')) onClick(findPlace('15B'));
          }} stroke='url(#SVGID_15_)' strokeWidth={3} strokeMiterlimit={10} d="M1215.9,390.9h-53.4V260.7h53.4c12.2,0,22.1,9.9,22.1,22.1v86.1C1237.9,381,1228,390.9,1215.9,390.9z" />
          <Text fill='#ffffff' transform="matrix(1 0 0 1 1188.9946 332)">15</Text>
        </G>

        { false &&
        <G fill={getFill('15A')}>
          <Path onPress={() => {
            if (!isReserved('15A')) onClick(findPlace('15A'));
          }} stroke='url(#SVGID_15_)' strokeWidth={3} strokeMiterlimit={10} d="M1101.1,260.7h53.4v130.2h-53.4c-12.2,0-22.1-9.9-22.1-22.1v-86.1C1079,270.5,1088.9,260.7,1101.1,260.7z" />
          <Text fill='#ffffff' transform="matrix(1 0 0 1 1111.6613 332)">15</Text>
        </G>
        }

        <G fill={getFill('14B')}>
          <Path onPress={() => {
            if (!isReserved('14B')) onClick(findPlace('14B'));
          }} stroke='url(#SVGID_15_)' strokeWidth={3} strokeMiterlimit={10} d="M1274.4,156.9H1221V26.7h53.4c12.2,0,22.1,9.9,22.1,22.1v86.1C1296.4,147,1286.5,156.9,1274.4,156.9z" />
          <Text fill='#ffffff' transform="matrix(1 0 0 1 1247.1809 102)">14</Text>
          <Text fill='#ffffff' transform="matrix(1 0 0 1 1223.7468 117.2168)">REMADORA</Text>
        </G>

        { false &&
        <G fill={getFill('14A')}>
          <Path onPress={() => {
            if (!isReserved('14A')) onClick(findPlace('14A'));
          }} stroke='url(#SVGID_15_)' strokeWidth={3} strokeMiterlimit={10} d="M1159.6,26.7h53.4v130.2h-53.4c-12.2,0-22.1-9.9-22.1-22.1V48.7C1137.5,36.5,1147.4,26.7,1159.6,26.7z" />
          <Text fill='#ffffff' transform="matrix(1 0 0 1 1165.8475 102)">14</Text>
          <Text fill='#ffffff' transform="matrix(1 0 0 1 1141.0146 117.2168)">REMADORA</Text>
        </G>
        }

        <G fill={getFill('13B')}>
          <Path onPress={() => {
            if (!isReserved('13B')) onClick(findPlace('13B'));
          }} stroke='url(#SVGID_15_)' strokeWidth={3} strokeMiterlimit={10} d="M1108.3,156.9h-53.4V26.7h53.4c12.2,0,22.1,9.9,22.1,22.1v86.1C1130.3,147,1120.5,156.9,1108.3,156.9z" />
          <Text fill='#ffffff' transform="matrix(1 0 0 1 1081.1809 102)">13</Text>
        </G>

        { false &&
          <G fill={getFill('13A')}>
          <Path onPress={() => {
            if (!isReserved('13A')) onClick(findPlace('13A'));
          }} stroke='url(#SVGID_15_)' strokeWidth={3} strokeMiterlimit={10} d="M993.5,26.7h53.4v130.2h-53.4c-12.2,0-22.1-9.9-22.1-22.1V48.7C971.5,36.5,981.3,26.7,993.5,26.7z" />
          <Text fill='#ffffff' transform="matrix(1 0 0 1 1002.5142 102)">13</Text>
        </G>
        }

        <G fill={getFill('12B')}>
          <Path onPress={() => {
            if (!isReserved('12B')) onClick(findPlace('12B'));
          }} stroke='url(#SVGID_15_)' strokeWidth={3} strokeMiterlimit={10} d="M942.2,156.9h-53.4V26.7h53.4c12.2,0,22.1,9.9,22.1,22.1v86.1C964.3,147,954.4,156.9,942.2,156.9z" />
          <Text fill='#ffffff' transform="matrix(1 0 0 1 914.1809 102)">12</Text>
        </G>

        { false &&
          <G fill={getFill('12A')}>
          <Path onPress={() => {
            if (!isReserved('12A')) onClick(findPlace('12A'));
          }} stroke='url(#SVGID_15_)' strokeWidth={3} strokeMiterlimit={10} d="M827.5,26.7h53.4v130.2h-53.4c-12.2,0-22.1-9.9-22.1-22.1V48.7C805.4,36.5,815.3,26.7,827.5,26.7z" />
          <Text fill='#ffffff' transform="matrix(1 0 0 1 832.1809 102)">12</Text>
        </G>
        }
        <G fill={getFill('11B')}>
          <Path onPress={() => {
            if (!isReserved('11B')) onClick(findPlace('11B'));
          }} stroke='url(#SVGID_15_)' strokeWidth={3} strokeMiterlimit={10} d="M776.1,156.9h-53.4V26.7h53.4c12.2,0,22.1,9.9,22.1,22.1v86.1C798.2,147,788.3,156.9,776.1,156.9z" />
          <Text fill='#ffffff' transform="matrix(1 0 0 1 747.8475 102)">11</Text>
        </G>

        { false &&
        <G fill={getFill('11A')}>
          <Path onPress={() => {
            if (!isReserved('11A')) onClick(findPlace('11A'));
          }} stroke='url(#SVGID_15_)' strokeWidth={3} strokeMiterlimit={10} d="M661.4,26.7h53.4v130.2h-53.4c-12.2,0-22.1-9.9-22.1-22.1V48.7C639.3,36.5,649.2,26.7,661.4,26.7z" />
          <Text fill='#ffffff' transform="matrix(1 0 0 1 666.1809 102)">11</Text>
        </G>
        }

        <G fill={getFill('10B')}>
          <Path onPress={() => {
            if (!isReserved('10B')) onClick(findPlace('10B'));
          }} stroke='url(#SVGID_15_)' strokeWidth={3} strokeMiterlimit={10} d="M608.9,156.9h-53.4V26.7h53.4c12.2,0,22.1,9.9,22.1,22.1v86.1C630.9,147,621.1,156.9,608.9,156.9z" />
          <Text fill='#ffffff' transform="matrix(1 0 0 1 582.3123 90)">10</Text>
          <Text fill='#ffffff' transform="matrix(1 0 0 1 578.3123 112)">BICI</Text>
        </G>

        { false &&
        <G fill={getFill('10A')}>
          <Path onPress={() => {
            if (!isReserved('10A')) onClick(findPlace('10A'));
          }} stroke='url(#SVGID_15_)' strokeWidth={3} strokeMiterlimit={10} d="M494.1,26.7h53.4v130.2h-53.4c-12.2,0-22.1-9.9-22.1-22.1V48.7C472.1,36.5,481.9,26.7,494.1,26.7z" />
          <Text fill='#ffffff' transform="matrix(1 0 0 1 504.6456 90)">10</Text>
          <Text fill='#ffffff' transform="matrix(1 0 0 1 498.6456 112)">BICI</Text>
        </G>
        }

        <G fill={getFill('9B')}>
          <Path onPress={() => {
            if (!isReserved('9B')) onClick(findPlace('9B'));
          }} stroke='url(#SVGID_15_)' strokeWidth={3} strokeMiterlimit={10} d="M441.9,156.9h-53.4V26.7h53.4c12.2,0,22.1,9.9,22.1,22.1v86.1C463.9,147,454.1,156.9,441.9,156.9z" />
          <Text fill='#ffffff' transform="matrix(1 0 0 1 413.3123 102)">9</Text>
        </G>

        { false &&
        <G fill={getFill('9A')}>
          <Path onPress={() => {
            if (!isReserved('9A')) onClick(findPlace('9A'));
          }} stroke='url(#SVGID_15_)' strokeWidth={3} strokeMiterlimit={10} d="M327.1,26.7h53.4v130.2h-53.4c-12.2,0-22.1-9.9-22.1-22.1V48.7C305.1,36.5,314.9,26.7,327.1,26.7z" />
          <Text fill='#ffffff' transform="matrix(1 0 0 1 333.6456 102)">9</Text>
        </G>
        }

      </Svg>
    </View>
  )
}

export default WeHiit;