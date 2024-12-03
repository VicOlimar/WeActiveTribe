import React, { Component, Fragment } from 'react';
import { Text, ImageBackground } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import withUserContext from '../../contexts/UserContext/WithUserContext';
import { DefaultUserContext } from '../../contexts/UserContext/UserContext';
import { SafeAreaView } from 'react-navigation';
const styles = require('./ProfileNav.scss');

const Pattern = require('../../assets/icon/pattern.png');

type Props = {
  navigation: any,
  userContext: DefaultUserContext
}

type State = {
}

class ProfileNav extends Component<Props, State> {

  render() {
    const { userContext } = this.props;
    return (
      <LinearGradient
        style={styles.profileNav__linearGradient}
        colors={['#58318b', '#04108e']} // PURPLE / BLUE
        start={{ x: 0.2, y: 1 }}
        end={{ x: 0.8, y: 0 }}>
        <SafeAreaView>
          {userContext.user &&
            <Fragment>
              <Text style={styles.profileNav__text}>Hola,</Text>
              <Text style={styles.profileNav__textAccent}>{userContext.user.name}</Text>
              <Text style={styles.profileNav__textAccent}>{userContext.user.last_name ? userContext.user.last_name : ''}</Text>
            </Fragment>}
        </SafeAreaView>
      </LinearGradient>
    );
  }
}

export default withUserContext(ProfileNav);