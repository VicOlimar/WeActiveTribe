import React from "react";
import moment from 'moment-timezone';
import { Text, Image, View } from 'react-native';
import { Col, Grid, Row } from 'react-native-easy-grid';

import WeHiit from './../../../../assets/img/hiit.png';
import WeRide from './../../../../assets/img/ride.png';
import CANCELATION from './../../../../assets/img/cancelation.png';

// Styles
import bem from 'react-native-bem';
import styles from './ReservationItem.scss';
import { TouchableOpacity } from "react-native-gesture-handler";
import { Reservation } from "../../../../services/Reservation/Reservation";

type Props = {
  reservationStatus: string,
  reservation: Reservation,
  onCancel: Function,
}

const ReservationItem = (props: Props) => {
  const DATE_FORMAT = 'D [de] MMMM';
  const HOUR_FORMAT = 'h:mm A';
  const { reservation, onCancel, reservationStatus } = props;
  const b = (selector) => bem(selector, {}, styles);
  const date = moment(reservation.lesson.starts_at).tz('America/Merida');

  let instructorsNames: Array<string> = [];
  instructorsNames = reservation.lesson.instructors.map(instructor => instructor.name);

  return (
    <Grid style={b('reservation-item')}>
      <Row>
        <Col>
          <Image resizeMode='contain' style={b('reservation-item__studio')} source={reservation.lesson.studio.slug === 'we-hiit' ? WeHiit : WeRide} />
        </Col>
        <Col>
          <View style={b('reservation-item__container')}>
            <Text style={b('reservation-item__text')}>{instructorsNames.length > 1 ? instructorsNames.join(' + ') : instructorsNames[0]}</Text>
          </View>
        </Col>
        <Col>
          <View style={b('reservation-item__container')}>
            <Text style={b('reservation-item__text')}>{reservation.place.location}</Text>
          </View>
        </Col>
        <Col>
          <View style={b('reservation-item__container')}>
            <Text style={b('reservation-item__text')}>{date.format(DATE_FORMAT)}{'\n'}{date.format(HOUR_FORMAT)}</Text>
          </View>
        </Col>
        {
          reservationStatus === 'next' && <Col style={{ width: 45 }}>
            <TouchableOpacity style={b('reservation-item__container')} onPress={() => onCancel(reservation)}>
              <Image resizeMode='contain' style={b('reservation-item__cancel')} source={CANCELATION} />
            </TouchableOpacity>
          </Col>
        }
      </Row>
    </Grid>
  )
}

export default ReservationItem;