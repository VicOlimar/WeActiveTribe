import React, { Component } from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-navigation';
const styles = require('./LogoNav.scss');

const LogoImage = require('../../assets/img/logo.png');
const arrowLeft = require('../../assets/img/arrow-left.png')

type Props = {
  navigation: any,
  showLogo?: boolean,
}

type State = {

}
class LogoNav extends Component<Props, State> {

  state = {
  }

  render() {
    const {showLogo} = this.props;
    return (
      <LinearGradient
        style={styles.navbar__linearGradient}
        colors={['#58318b', '#04108e']} // PURPLE / BLUE
        locations={[0.7, 1]}
        start={{ x: 0.2, y: 1 }}
        end={{ x: 0.8, y: 0 }}
      >
        <SafeAreaView>
          <View style={styles.navbar__mainContainer}>

            <View style={showLogo ? styles.navbar__logoContainer : styles.navbar__back}>
              {
                !this.props.showLogo && <TouchableOpacity
                  onPress={() => this.props.navigation.goBack(null)}>
                  <Image
                    style={styles.navbar__back__icon}
                    source={arrowLeft}
                    resizeMode='cover'>
                  </Image>
                </TouchableOpacity>
              }
              {
                this.props.showLogo && <Image
                  style={styles.navbar__logo}
                  source={LogoImage}
                  resizeMode='contain' />
              }
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }
}

export default LogoNav;