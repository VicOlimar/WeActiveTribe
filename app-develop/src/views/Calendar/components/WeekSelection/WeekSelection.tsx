import React from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import ArrowLeft from './../../../../assets/img/arrow-left.png';
import SwitchArrow from './../../../../assets/img/switch-arrow.png';
import bem from 'react-native-bem';
import styles from './WeekSelection.scss';
import { isSmallDevice } from '../../../../utils/common';

type Props = {
  backAction?: Function,
  firstDate: string,
  secondDate?: string,
  rightAction?: Function,
  previousWeekClick?: Function,
  nextWeekClick?: Function,
  size?: 'small' | 'normal' | 'medium',
}

const WeekSelection = (props: Props) => {
  let { backAction, firstDate, secondDate, previousWeekClick, nextWeekClick, rightAction, size = 'normal' } = props;
  const b = (selector) => bem(selector, props, styles);
  if (isSmallDevice()) {
    size = 'normal';
  }
  return (
    <View style={b('week-selection')}>
      {
        backAction && <TouchableOpacity style={b('week-selection__column')} onPress={() => { if (backAction) backAction() }}>
          <Image style={b('week-selection__back')} source={ArrowLeft} />
        </TouchableOpacity>
      }
      <View style={b('week-selection__column')}>
        <Text style={[b('week-selection__column__text'), b(`week-selection__column__text-${size}`)]} onPress={() => { if (previousWeekClick !== undefined) previousWeekClick() }}>{firstDate}</Text>
      </View>
      {
        secondDate && <View style={b('week-selection__column')}>
          <Text style={b('week-selection__column__text')} onPress={() => { if (nextWeekClick !== undefined) nextWeekClick() }}>{secondDate}</Text>
        </View>
      }
      {
        rightAction && <TouchableOpacity style={[b('week-selection__column'), { alignItems: 'flex-end', marginBottom: 5 }]} onPress={() => { if (rightAction) rightAction() }}>
          <Image style={b('week-selection__back')} source={SwitchArrow} />
        </TouchableOpacity>
      }
      {
        backAction && !rightAction && <View style={b('week-selection__column')}></View>
      }
    </View>
  );
}

export default WeekSelection;