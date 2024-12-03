import React from "react";
import moment from 'moment-timezone';
import { Text, Image, View } from 'react-native';
import { Waiting } from '../../../../services/Waiting/Waiting';
import { Col, Grid, Row } from 'react-native-easy-grid';

import WeHiit from './../../../../assets/img/we-hiit.png';
import WeRide from './../../../../assets/img/we-ride.png';
import CANCELATION from './../../../../assets/img/cancelation.png';

// Styles
import bem from 'react-native-bem';
import styles from './WaitingItem.scss';
import { TouchableOpacity } from "react-native-gesture-handler";

type Props = {
  waiting: Waiting,
  onCancel: Function,
}

const WaitingItem = (props: Props) => {
  const DATE_FORMAT = 'D [de] MMMM';
  const HOUR_FORMAT = 'h:mm A';
  const { waiting, onCancel } = props;
  const b = (selector) => bem(selector, {}, styles);
  const date = moment(waiting.lesson.starts_at).tz('America/Merida');

  let instructorsNames: Array<string> = [];
  instructorsNames = waiting.lesson.instructors.map(instructor => instructor.name);

  return (
    <Grid style={b('waiting-item')}>
      <Row>
        <Col>
          <Image resizeMode='contain' style={b('waiting-item__studio')} source={waiting.lesson.studio.slug === 'we-hiit' ? WeHiit : WeRide} />
        </Col>
        <Col>
          <View style={b('waiting-item__container')}>
            <Text style={b('waiting-item__text')}>{instructorsNames.length > 1 ? instructorsNames.join(' + ') : instructorsNames[0]}</Text>
          </View>
        </Col>
        <Col>
          <View style={b('waiting-item__container')}>
            <Text style={b('waiting-item__text')}>{date.format(DATE_FORMAT)}{'\n'}{date.format(HOUR_FORMAT)}</Text>
          </View>
        </Col>
        <Col style={{ width: 30 }}>
          <TouchableOpacity style={b('waiting-item__container')} onPress={() => onCancel(waiting)}>
            <Image resizeMode='contain' style={b('waiting-item__cancel')} source={CANCELATION} />
          </TouchableOpacity>
        </Col>
      </Row>
    </Grid>
  )
}

export default WaitingItem;