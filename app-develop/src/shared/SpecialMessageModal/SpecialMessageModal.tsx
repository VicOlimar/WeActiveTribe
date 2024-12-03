import React from 'react';
import { Modal, Alert, View, Text, TouchableHighlight, SafeAreaView } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import bem from 'react-native-bem';

import styles from './SpecialMessageModal.scss';

type Props = {
  title: string,
  subtitle: string,
  thirdTitle?: string,
  steps: Array<string>,
  visible: boolean,
  onClose: Function
}

const HiitBudiesModal = (props: Props) => {
  const b = selector => bem(selector, {}, styles);

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={props.visible}>
      <LinearGradient
        colors={['#171c32', '#3e0923']} // PURPLE / BLUE
        start={{ x: 0.0, y: 0.0 }} end={{ x: 0.5, y: 1.0 }}
        style={b('specialMessageModal')}>
        <View style={b('specialMessageModal__content')}>
          <Text style={b('specialMessageModal__title')}>{props.title}</Text>
          <Text style={b('specialMessageModal__subtitle')}>{props.subtitle}</Text>
          {
            props.thirdTitle && <Text style={b('specialMessageModal__thirdTitle')}>{props.thirdTitle}</Text>
          }
          <View style={b('specialMessageModal__steps_container')}>
            {
              props.steps.map(step => <Text style={b('specialMessageModal__steps_container__step')}>{step}</Text>)
            }
          </View>
        </View>

        <View style={b('specialMessageModal__close_container')}>
          <TouchableHighlight
            onPress={() => {
              props.onClose();
            }} style={b('specialMessageModal__close_container__touchable')}>
            <Text style={b('specialMessageModal__close_container__close')}>Entendido</Text>
          </TouchableHighlight>
        </View>
      </LinearGradient>
    </Modal>
  )
}

export default HiitBudiesModal;