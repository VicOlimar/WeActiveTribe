import React, { Component } from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-navigation';
const styles = require('./SimpleNav.scss');

const arrowLeft = require('../../assets/img/arrow-left.png')

type Props = {
  navigation: any,
  scene: any,
}

type State = {
}
class SimpleNav extends Component<Props, State> {

  render() {
    const { descriptor } = this.props.scene;
    return (
      <LinearGradient
        style={styles.simpleNav__linearGradient}
        colors={['#58318b', '#04108e']} // PURPLE / BLUE
        locations={[0.7, 1]}
        start={{ x: 0.2, y: 1 }}
        end={{ x: 0.8, y: 0 }}>

        <SafeAreaView>
          <View style={styles.simpleNav__mainContainer}>
            <View style={styles.simpleNav__leftContent}>
              <TouchableOpacity
                onPress={() => this.props.navigation.goBack()}>
                <Image
                  style={styles.simpleNav__icon}
                  source={arrowLeft}
                  resizeMode='cover'>
                </Image>
              </TouchableOpacity>
              <Text style={styles.simpleNav__text}>{descriptor.options ? descriptor.options.title : ''}</Text>
            </View>
            <View style={styles.simpleNav__rightAction}>
              { descriptor.options.headerRight && descriptor.options.headerRight()}
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }
}

export default SimpleNav;