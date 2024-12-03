import React, { Component } from 'react';
import { AsyncStorage, Button, Platform, Text } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { withNavigation } from 'react-navigation';
import styles from './ErrorBoundary.scss';

type Props = {
  navigation: any;
}

class ErrorComponent extends Component<Props> {

  logOut = async () => {
    //await AsyncStorage.removeItem('user_context');
    console.log(this.props)
    this.props.navigation.navigate('Auth');
  }

  render() {
    return (
      <LinearGradient
        colors={['#58318b', '#04108e']} // PURPLE / BLUE
        start={{ x: 1.0, y: 0.0 }} end={{ x: 0.0, y: 1.0 }}
        style={styles.error_boundary}>
        <Text style={styles.error_boundary__error_title}>Ups</Text>
        <Text style={styles.error_boundary__error_subtitle}>Algo salió mal</Text>
        {
          <Button
          title='Aceptar'
          color={Platform.OS === 'ios' ? 'white' : 'black'}
          onPress={this.logOut}
        />
        }
      </LinearGradient>
    )
  }
}

export default withNavigation(ErrorComponent);