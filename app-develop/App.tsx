import React from 'react';
import { Alert } from "react-native";
import AppContainerScreen from './src/shared/AppContainer';
import UserProvider from './src/contexts/UserContext/UserProvider';
import StudioProvider from './src/contexts/StudioContext/StudioProvider';
import ErrorBoundary from './src/shared/ErrorBoundary/ErrorBoundary';
import { Client } from 'bugsnag-react-native';
import { ONE_SIGNAL_APP_ID } from 'react-native-dotenv';

type Props = {
  bugsnagClient?: Client;
}
class App extends React.Component<Props> {

  constructor(props) {
    super(props);
  }

  componentWillUnmount() {
  }

  onOpened(openResult) {
    try {
      const { title, body } = openResult.notification.payload;
      Alert.alert(title, body);
    } catch (error) {
      Alert.alert("Error en notificación", error.message);
    }
  }

  render() {
    return (
      <StudioProvider>
        <UserProvider bugsnagClient={this.props.bugsnagClient}>
          <AppContainerScreen />
        </UserProvider>
      </StudioProvider>
    );
  }
}

export default App;
