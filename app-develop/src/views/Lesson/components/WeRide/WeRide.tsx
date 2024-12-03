import React from 'react';
import { View } from 'react-native';
import { Place } from '../../../../services/Place/Place';
import Svg, {
  G,
  Text,
  LinearGradient,
  Stop,
  Circle,
  Ellipse,
  Defs,
} from 'react-native-svg';

// Styles
import bem from 'react-native-bem';
import styles from './WeRide.scss';
import { isSmallDevice } from '../../../../utils/common';

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

const WeRide = ({ places, onClick }: Props) => {

  const bemStyles = (selector) => bem(selector, {}, styles);
  const weRideColor = '#58318b';

  function findPlace(location: string) {
    return places.available.find(place => place.location === location);
  }

  function isReserved(location: string) {
    return (places.available.find(place => place.location === location) === undefined && places.available.length !== 0) ||
      places.available.length === 0 ||
      places.locked.find(place => place.location === location) !== undefined ? true : false;
  }

  function getFill(location: string) {
    return isReserved(location) ? weRideColor : 'transparent';
  }

  return (
    <View style={[bemStyles('we-ride')]}>
      <Svg x="0px" y="0px" viewBox="0 -20 515 350" style={[bemStyles('we-ride__layout')]}>
        <G>
          <Defs>
            <LinearGradient id="gradient" gradientUnits="userSpaceOnUse" x1="48.0333" y1="197.4503" x2="48.0333" y2="231.8503" gradientTransform="matrix(1 0 0 -1 0 266)">
              <Stop offset="0" stopColor='#C10C90' />
              <Stop offset="1" stopColor='#CD16E7' />
            </LinearGradient>
          </Defs>
          <G fill={getFill('1')}>
            <Circle onPress={() => {
              if (!isReserved('1')) onClick(findPlace('1'));
            }} stroke='url(#gradient)' strokeWidth={3} strokeMiterlimit={10} cx="48" cy="51.3" r="16.2" />
            <Text fill='#ffffff' transform="matrix(1 0 0 1 44.8333 54.5504)">1</Text>
          </G>
          <G fill={getFill('2')}>
            <Circle onPress={() => {
              if (!isReserved('2')) onClick(findPlace('2'));
            }} stroke='url(#gradient)' strokeWidth={3} strokeMiterlimit={10} cx="88.8" cy="78.9" r="16.2" />
            <Text fill='#ffffff' transform="matrix(1 0 0 1 85.5 82.1169)">2</Text>
          </G>
          <G fill={getFill('3')}>
            <Circle onPress={() => {
              if (!isReserved('3')) onClick(findPlace('3'));
            }} stroke='url(#gradient)' strokeWidth={3} strokeMiterlimit={10} cx="129.6" cy="104.1" r="16.2" />
            <Text fill='#ffffff' transform="matrix(1 0 0 1 126.5 107.3171)">3</Text>
          </G>
          <G fill={getFill('4')}>
            <Circle onPress={() => {
              if (!isReserved('4')) onClick(findPlace('4'));
            }} stroke='url(#gradient)' strokeWidth={3} strokeMiterlimit={10} cx="171.4" cy="120.9" r="16.2" />
            <Text fill='#ffffff' transform="matrix(1 0 0 1 167.5 125.1304)">4</Text>
          </G>
          <G fill={getFill('5')}>
            <Circle onPress={() => {
              if (!isReserved('5')) onClick(findPlace('5'));
            }} stroke='url(#gradient)' strokeWidth={3} strokeMiterlimit={10} cx="212.2" cy="121.9" r="16.2" />
            <Text fill='#ffffff' transform="matrix(1 0 0 1 208.3333 125.1302)">5</Text>
          </G>
          {false &&
            <G fill={getFill('6')}>
              <Ellipse onPress={() => {
                if (!isReserved('6')) onClick(findPlace('6'));
              }} stroke='url(#gradient)' strokeWidth={3} strokeMiterlimit={10} transform="matrix(0.3162 -0.9487 0.9487 0.3162 56.7305 322.57)" cx="253.1" cy="121.9" rx="16.2" ry="16.2" />
              <Text fill='#ffffff' transform="matrix(1 0 0 1 249.6665 125.1302)">6</Text>
            </G>
          }
          <G fill={getFill('7')}>
            <Circle onPress={() => {
              if (!isReserved('7')) onClick(findPlace('7'));
            }} stroke='url(#gradient)' strokeWidth={3} strokeMiterlimit={10} cx="294.5" cy="121.9" r="16.2" />
            <Text fill='#ffffff' transform="matrix(1 0 0 1 291.1667 125.1302)">7</Text>
          </G>
          <G fill={getFill('8')}>
            <Circle onPress={() => {
              if (!isReserved('8')) onClick(findPlace('8'));
            }} stroke='url(#gradient)' strokeWidth={3} strokeMiterlimit={10} cx="335.3" cy="121.9" r="16.2" />
            <Text fill='#ffffff' transform="matrix(1 0 0 1 331.8333 125.1302)">8</Text>
          </G>
          <G fill={getFill('9')}>
            <Circle onPress={() => {
              if (!isReserved('9')) onClick(findPlace('9'));
            }} stroke='url(#gradient)' strokeWidth={3} strokeMiterlimit={10} cx="376.1" cy="104.1" r="16.2" />
            <Text fill='#ffffff' transform="matrix(1 0 0 1 372.1667 106.317)">9</Text>
          </G>
          <G fill={getFill('10')}>
            <Circle onPress={() => {
              if (!isReserved('10')) onClick(findPlace('10'));
            }} stroke='url(#gradient)' strokeWidth={3} strokeMiterlimit={10} cx="416.9" cy="78.9" r="16.2" />
            <Text fill='#ffffff' transform="matrix(1 0 0 1 411.1667 82.1169)">10</Text>
          </G>
          <G fill={getFill('11')}>
            <Circle onPress={() => {
              if (!isReserved('11')) onClick(findPlace('11'));
            }} stroke='url(#gradient)' strokeWidth={3} strokeMiterlimit={10} cx="457.7" cy="51.3" r="16.2" />
            <Text fill='#ffffff' transform="matrix(1 0 0 1 452.8333 54.5504)">11</Text>
          </G>
          <G fill={getFill('12')}>
            <Circle onPress={() => {
              if (!isReserved('12')) onClick(findPlace('12'));
            }} stroke='url(#gradient)' strokeWidth={3} strokeMiterlimit={10} cx="51" cy="94.3" r="16.2" />
            <Text fill='#ffffff' transform="matrix(1 0 0 1 44.8333 98.5504)">12</Text>
          </G>
          {false &&
            <G fill={getFill('13')}>
              <Circle onPress={() => {
                if (!isReserved('13')) onClick(findPlace('13'));
              }} stroke='url(#gradient)' strokeWidth={3} strokeMiterlimit={10} cx="92.8" cy="120.9" r="16.2" />
              <Text fill='#ffffff' transform="matrix(1 0 0 1 85.5 126.1169)">13</Text>
            </G>
          }
          <G fill={getFill('14')}>
            <Circle onPress={() => {
              if (!isReserved('14')) onClick(findPlace('14'));
            }} stroke='url(#gradient)' strokeWidth={3} strokeMiterlimit={10} cx="131.6" cy="146.1" r="16.2" />
            <Text fill='#ffffff' transform="matrix(1 0 0 1 126.5 151.3171)">14</Text>
          </G>
          <G fill={getFill('15')}>
            <Circle onPress={() => {
              if (!isReserved('15')) onClick(findPlace('15'));
            }} stroke='url(#gradient)' strokeWidth={3} strokeMiterlimit={10} cx="172.4" cy="167.4" r="16.2" />
            <Text fill='#ffffff' transform="matrix(1 0 0 1 166.5 171.6304)">15</Text>
          </G>
          <G fill={getFill('16')}>
            <Circle onPress={() => {
              if (!isReserved('16')) onClick(findPlace('16'));
            }} stroke='url(#gradient)' strokeWidth={3} strokeMiterlimit={10} cx="213.2" cy="166.4" r="16.2" />
            <Text fill='#ffffff' transform="matrix(1 0 0 1 207.3333 171.6302)">16</Text>
          </G>
          {false &&
            <G fill={getFill('17')}>
              <Ellipse onPress={() => {
                if (!isReserved('17')) onClick(findPlace('17'));
              }} stroke='url(#gradient)' strokeWidth={3} strokeMiterlimit={10} transform="matrix(0.3162 -0.9487 0.9487 0.3162 12.6169 354.3647)" cx="255.1" cy="169.4" rx="16.2" ry="16.2" />
              <Text fill='#ffffff' transform="matrix(1 0 0 1 248.6665 171.6302)">17</Text>
            </G>
          }
          <G fill={getFill('18')}>
            <Circle onPress={() => {
              if (!isReserved('18')) onClick(findPlace('18'));
            }} stroke='url(#gradient)' strokeWidth={3} strokeMiterlimit={10} cx="297.5" cy="167.4" r="16.2" />
            <Text fill='#ffffff' transform="matrix(1 0 0 1 290.1667 171.6302)">18</Text>
          </G>
          <G fill={getFill('19')}>
            <Circle onPress={() => {
              if (!isReserved('19')) onClick(findPlace('19'));
            }} stroke='url(#gradient)' strokeWidth={3} strokeMiterlimit={10} cx="337.3" cy="167.4" r="16.2" />
            <Text fill='#ffffff' transform="matrix(1 0 0 1 330.8333 171.6302)">19</Text>
          </G>
          <G fill={getFill('20')}>
            <Circle onPress={() => {
              if (!isReserved('20')) onClick(findPlace('20'));
            }} stroke='url(#gradient)' strokeWidth={3} strokeMiterlimit={10} cx="378.1" cy="148.1" r="16.2" />
            <Text fill='#ffffff' transform="matrix(1 0 0 1 371.1667 151.317)">20</Text>
          </G>
          {false &&
            <G fill={getFill('21')}>
              <Circle onPress={() => {
                if (!isReserved('21')) onClick(findPlace('21'));
              }} stroke='url(#gradient)' strokeWidth={3} strokeMiterlimit={10} cx="417.9" cy="121.9" r="16.2" />
              <Text fill='#ffffff' transform="matrix(1 0 0 1 411.1667 126.1169)">21</Text>
            </G>
          }
          <G fill={getFill('22')}>
            <Circle onPress={() => {
              if (!isReserved('22')) onClick(findPlace('22'));
            }} stroke='url(#gradient)' strokeWidth={3} strokeMiterlimit={10} cx="458.7" cy="95.3" r="16.2" />
            <Text fill='#ffffff' transform="matrix(1 0 0 1 450.8333 98.5504)">22</Text>
          </G>
          <G fill={getFill('23')}>
            <Circle onPress={() => {
              if (!isReserved('23')) onClick(findPlace('23'));
            }} stroke='url(#gradient)' strokeWidth={3} strokeMiterlimit={10} cx="52" cy="138.6" r="16.2" />
            <Text fill='#ffffff' transform="matrix(1 0 0 1 44.8333 142.8004)">23</Text>
          </G>
          {false &&
            <G fill={getFill('24')}>
              <Circle onPress={() => {
                if (!isReserved('24')) onClick(findPlace('24'));
              }} stroke='url(#gradient)' strokeWidth={3} strokeMiterlimit={10} cx="92.8" cy="166.2" r="16.2" />
              <Text fill='#ffffff' transform="matrix(1 0 0 1 85 170.3669)">24</Text>
            </G>
          }
          <G fill={getFill('25')}>
            <Circle onPress={() => {
              if (!isReserved('25')) onClick(findPlace('25'));
            }} stroke='url(#gradient)' strokeWidth={3} strokeMiterlimit={10} cx="132.6" cy="191.4" r="16.2" />
            <Text fill='#ffffff' transform="matrix(1 0 0 1 125.5 195.5671)">25</Text>
          </G>
          <G fill={getFill('26')}>
            <Circle onPress={() => {
              if (!isReserved('26')) onClick(findPlace('26'));
            }} stroke='url(#gradient)' strokeWidth={3} strokeMiterlimit={10} cx="173.4" cy="214.4" r="16.2" />
            <Text fill='#ffffff' transform="matrix(1 0 0 1 166.5 218.6304)">26</Text>
          </G>
          <G fill={getFill('27')}>
            <Circle onPress={() => {
              if (!isReserved('27')) onClick(findPlace('27'));
            }} stroke='url(#gradient)' strokeWidth={3} strokeMiterlimit={10} cx="214.2" cy="214.4" r="16.2" />
            <Text fill='#ffffff' transform="matrix(1 0 0 1 207.3333 218.6302)">27</Text>
          </G>
          {false &&
            <G fill={getFill('28')}>
              <Ellipse onPress={() => {
                if (!isReserved('28')) onClick(findPlace('28'));
              }} stroke='url(#gradient)' strokeWidth={3} strokeMiterlimit={10} transform="matrix(0.3162 -0.9487 0.9487 0.3162 -31.9709 386.5013)" cx="257.1" cy="218" rx="16.2" ry="16.2" />
              <Text fill='#ffffff' transform="matrix(1 0 0 1 248.6665 218.6302)">28</Text>
            </G>
          }
          <G fill={getFill('29')}>
            <Circle onPress={() => {
              if (!isReserved('29')) onClick(findPlace('29'));
            }} stroke='url(#gradient)' strokeWidth={3} strokeMiterlimit={10} cx="296.5" cy="214.4" r="16.2" />
            <Text fill='#ffffff' transform="matrix(1 0 0 1 289.1667 218.6302)">29</Text>
          </G>
          <G fill={getFill('30')}>
            <Circle onPress={() => {
              if (!isReserved('30')) onClick(findPlace('30'));
            }} stroke='url(#gradient)' strokeWidth={3} strokeMiterlimit={10} cx="336.3" cy="214.4" r="16.2" />
            <Text fill='#ffffff' transform="matrix(1 0 0 1 329.8333 219)">30</Text>
          </G>
          <G fill={getFill('31')}>
            <Circle onPress={() => {
              if (!isReserved('31')) onClick(findPlace('31'));
            }} stroke='url(#gradient)' strokeWidth={3} strokeMiterlimit={10} cx="378.1" cy="191.4" r="16.2" />
            <Text fill='#ffffff' transform="matrix(1 0 0 1 371.1667 195.567)">31</Text>
          </G>
          {false &&
            <G fill={getFill('32')}>
              <Circle onPress={() => {
                if (!isReserved('32')) onClick(findPlace('32'));
              }} stroke='url(#gradient)' strokeWidth={3} strokeMiterlimit={10} cx="417.9" cy="166.2" r="16.2" />
              <Text fill='#ffffff' transform="matrix(1 0 0 1 411.1667 170.3669)">32</Text>
            </G>
          }
          <G fill={getFill('33')}>
            <Circle onPress={() => {
              if (!isReserved('33')) onClick(findPlace('33'));
            }} stroke='url(#gradient)' strokeWidth={3} strokeMiterlimit={10} cx="459.7" cy="138.6" r="16.2" />
            <Text fill='#ffffff' transform="matrix(1 0 0 1 451.8333 142.8004)">33</Text>
          </G>
        </G>
      </Svg>

    </View >
  )
}

export default WeRide;