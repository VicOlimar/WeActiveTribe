import React, { Component, Fragment } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import styles from './InstructorCard.scss';
import HTML from 'react-native-render-html';
import Divider from "../../shared/Divider";
import { SafeAreaView } from 'react-native-safe-area-context';

import WeLogo from '../../assets/img/logo-white.png';
const arrowLeft = require('../../assets/img/arrow-left.png');


type Props = {
  navigation?: any,
  instructor?
}

type state = {
  loading: boolean;
}
class Instructor extends Component<Props, state> {
  render() {
    const { instructor } = this.props.navigation.state.params;
    const content = instructor.description;

    let source = WeLogo;
    if (instructor.avatar) {
      source = { uri: instructor.avatar };
    }
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#202020' }}>
        <ScrollView style={[styles.instructorCard__scroll, styles.instructorCard__content]}>
          <TouchableOpacity style={styles.instructorCard__back} onPress={() => this.props.navigation.goBack(null)}>
            <Image style={styles.instructorCard__backIcon} source={arrowLeft} />
          </TouchableOpacity>
          <Divider />
          <View style={styles.instructorCard__header}>
            <View style={styles.instructorCard__avatarContainer}>
              <Image
                style={styles.instructorCard__avatar}
                source={source}
              />
            </View>
            <Text style={styles.instructorCard__name}>{instructor.name}</Text>
          </View>
          <HTML
            html={content}
            tagsStyles={{
              p: { textAlign: 'center', fontFamily: 'Raleway-Light', color: 'white' },
              h2: { textAlign: 'center', fontFamily: 'Raleway-Light', color: 'white', marginTop: 20, marginBottom: 20 }
            }} />

        </ScrollView>
      </SafeAreaView >
    );
  }
}

export default Instructor;