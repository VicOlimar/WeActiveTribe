import React, { Component } from 'react';
import { Image, ImageBackground } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import hoistNonReactStatics from 'hoist-non-react-statics';
import { DefaultUserContext } from '../../contexts/UserContext/UserContext';
import withUserContext from '../../contexts/UserContext/WithUserContext';
import { getUserToken } from '../../utils/common';

const Logo = require('../../assets/img/logo.png');
const Pattern = require('../../assets/icon/pattern.png');

const styles = require('./Splash.scss');

type Props = {
  navigation: any,
  userContext: DefaultUserContext,
}

class Splash extends Component<Props> {

  async componentDidMount() {
    const token = await getUserToken();
    if(token){
      this.props.navigation.navigate('App');
    }else{
      this.props.navigation.navigate('Auth');
    }
  }

  render() {

    return (
      <LinearGradient
        colors={['#58318b', '#04108e']} // PURPLE / BLUE
        start={{ x: 1.0, y: 0.0 }} end={{ x: 0.0, y: 1.0 }}
        style={styles.splash__linearGradient}>
        <ImageBackground
          style={styles.splash__pattern}
          source={Pattern}
          resizeMode='repeat'>
          <Image style={styles.splash__logo} source={Logo} />
        </ImageBackground>
      </LinearGradient>
    );
  }
}

export default withUserContext(Splash);