import React, { Component } from 'react';
import { View, ScrollView, Text, Image } from 'react-native';
import hoistNonReactStatics from 'hoist-non-react-statics';
import LinearGradient from 'react-native-linear-gradient';
import Logo from '../../assets/img/logo.png';
import bem from 'react-native-bem';
import Paragraph from './Paragraph';
import {
  PARAGRAPH_1_TEXT,
  PARAGRAPH_2_TEXT,
  PARAGRAPH_3_TEXT,
  PARAGRAPH_4_TITLE,
  PARAGRAPH_4_TEXT,
  PARAGRAPH_5_TITLE,
  PARAGRAPH_5_TEXT,
  PARAGRAPH_6_TEXT,
  PARAGRAPH_6_TITLE,
  PARAGRAPH_7_TITLE,
  PARAGRAPH_7_TEXT,
  PARAGRAPH_8_TITLE,
  PARAGRAPH_8_TEXT,
  PARAGRAPH_9_TITLE,
  PARAGRAPH_9_TEXT,
  PARAGRAPH_10_TITLE,
  PARAGRAPH_10_TEXT,
  PARAGRAPH_11_TITLE,
  PARAGRAPH_11_TEXT,
  PARAGRAPH_12_TITLE,
  PARAGRAPH_12_TEXT,
  PARAGRAPH_13_TITLE,
  PARAGRAPH_13_TEXT,
  PARAGRAPH_14_TITLE,
  PARAGRAPH_14_TEXT,
  PARAGRAPH_15_TITLE,
  PARAGRAPH_15_TEXT,
  PARAGRAPH_16_TITLE,
  PARAGRAPH_16_TEXT,
} from './constants';

const styles = require('./Terms.scss');

type Props = {}
type State = {}

class Terms extends Component<Props, State> {
  static navigationOptions = {
    headerShown: true,
    headerMode: 'screen',
  }

  render() {
    const b = (selector) => bem(selector, {}, styles);

    return (
      <LinearGradient
        style={b('terms')}
        colors={['#171c32', '#3e0923']} // PURPLE / BLUE
        start={{ x: 0.0, y: 0.0 }} end={{ x: 0.5, y: 1.0 }}>
        <ScrollView style={b('terms__content')}>
          <View style={b('terms__logo_container')}>
            <Image source={Logo} style={b('terms__logo_container__image')} />
          </View>
          <View style={b('terms__content__text')}>
            <Paragraph text={PARAGRAPH_1_TEXT} />
            <Paragraph text={PARAGRAPH_2_TEXT} />
            <Paragraph text={PARAGRAPH_3_TEXT} />
            <Paragraph title={PARAGRAPH_4_TITLE} text={PARAGRAPH_4_TEXT} />
            <Paragraph title={PARAGRAPH_5_TITLE} text={PARAGRAPH_5_TEXT} />
            <Paragraph title={PARAGRAPH_6_TITLE} text={PARAGRAPH_6_TEXT} />
            <Paragraph title={PARAGRAPH_7_TITLE} text={PARAGRAPH_7_TEXT} />
            <Paragraph title={PARAGRAPH_8_TITLE} text={PARAGRAPH_8_TEXT} />
            <Paragraph title={PARAGRAPH_9_TITLE} text={PARAGRAPH_9_TEXT} />
            <Paragraph title={PARAGRAPH_10_TITLE} text={PARAGRAPH_10_TEXT} />
            <Paragraph title={PARAGRAPH_11_TITLE} text={PARAGRAPH_11_TEXT} />
            <Paragraph title={PARAGRAPH_12_TITLE} text={PARAGRAPH_12_TEXT} />
            <Paragraph title={PARAGRAPH_13_TITLE} text={PARAGRAPH_13_TEXT} />
            <Paragraph title={PARAGRAPH_14_TITLE} text={PARAGRAPH_14_TEXT} />
            <Paragraph title={PARAGRAPH_15_TITLE} text={PARAGRAPH_15_TEXT} />
            <Paragraph title={PARAGRAPH_16_TITLE} text={PARAGRAPH_16_TEXT} />
          </View>
        </ScrollView>
      </LinearGradient>
    )
  }
}


export default hoistNonReactStatics(Terms, Terms);