import React, { Component } from 'react';
import { View, Image, TouchableOpacity, ImageBackground } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-navigation';
import { WithStudioContext } from '../../contexts/StudioContext';
import { DefaultStudioContext } from '../../contexts/StudioContext/StudioContext';
import StudioService from '../../services/Studio';
import Toast from 'react-native-tiny-toast';

const styles = require('./Navbar.scss');

const LogoImage = require('../../assets/img/logo.png');
const RideImage = require('../../assets/img/ride.png');
const HiitImage = require('../../assets/img/hiit.png');

const Pattern = require('../../assets/icon/pattern.png');

type Props = {
  navigation: any,
  studioContext?: DefaultStudioContext,
}

type State = {
  activeStudio?: string,
  colorLocation: number;
}
class Navbar extends Component<Props, State> {

  state = {
    activeStudio: undefined,
    colorLocation: 0.7
  }

  componentDidMount() {
    const { studio } = this.props.studioContext;

    if (studio === undefined) {
      this.onStudioPress('we-ride');
    } else {
      this.setState({ activeStudio: studio.slug });
    }
  }

  onStudioPress = async (pressed: 'we-ride' | 'we-hiit') => {
    try {
      const studio = await StudioService.findOne(pressed);
      this.props.studioContext.setState({ studio });
      this.animateGradient(pressed);
    } catch (error) {
      Toast.showError(error.message);
    }
  }

  animateGradient(pressed: 'we-ride' | 'we-hiit') {
    // 0.7 a 0.1
    const { colorLocation } = this.state;
    let newValue = colorLocation;
    if (pressed === 'we-ride') {
      const interval = setInterval(() => {
        if (newValue <= 0.7) {
          newValue = newValue + 0.025
          this.setState({ colorLocation: newValue })
        } else {
          clearInterval(interval)
        }
      }, 0);
    }
    if (pressed === 'we-hiit') {
      const interval = setInterval(() => {
        if (newValue >= 0.1) {
          newValue = newValue - 0.025
          this.setState({ colorLocation: newValue })
        } else {
          clearInterval(interval)
        }
      }, 0);
    }

    this.setState({
      activeStudio: pressed,
    });

  }

  render() {
    const { activeStudio, colorLocation } = this.state;

    return (
      <LinearGradient
        style={styles.navbar__linearGradient}
        colors={['#58318b', '#04108e']} // PURPLE / BLUE
        locations={[colorLocation, 1]}
        start={{ x: 0.2, y: 1 }}
        end={{ x: 0.8, y: 0 }}
      >
        <SafeAreaView>
          <View style={styles.navbar__mainContainer}>
            <View style={styles.navbar__logoContainer}>
              <Image
                style={styles.navbar__logo}
                source={LogoImage}
                resizeMode='contain' />
            </View>
            <View style={styles.navbar__classSelector}>
              <TouchableOpacity
                onPress={() => this.onStudioPress('we-ride')}>
                <Image
                  style={[styles.navbar__class, activeStudio === 'we-ride' ? styles.navbar__selectedClass : '']}
                  source={RideImage}
                  resizeMode='contain' />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.onStudioPress('we-hiit')}>
                <Image
                  style={[styles.navbar__class, activeStudio === 'we-hiit' ? styles.navbar__selectedClass : '']}
                  source={HiitImage}
                  resizeMode='contain' />
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </LinearGradient>
    );
  }
}

export default WithStudioContext(Navbar);