import React, { Component } from 'react';
import { Button, Platform, Text } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import styles from './ErrorBoundary.scss';
import LinearGradient from 'react-native-linear-gradient';

// Bugsnag
import { BUGSNAG_API_KEY, APP_ENV } from 'react-native-dotenv';

import { Client, Configuration } from 'bugsnag-react-native';
import withUserContext from '../../contexts/UserContext/WithUserContext';
import { DefaultUserContext } from '../../contexts/UserContext/UserContext';
import ErrorComponent from './ErrorComponent';
const configuration = new Configuration(BUGSNAG_API_KEY);
configuration.notifyReleaseStages = ['production', 'staging'];
configuration.releaseStage = APP_ENV;

const bugsnagClient = new Client(configuration);

type Props = {
  navigation?: any;
};
type State = {};



const ErrorBoundary = (WrappedComponent: any) =>
  class ErrorBoundaries extends Component<Props> {
    state = {
      errorFound: false
    }

    componentDidCatch(error: Error, info: any) {
      //Bugsnag Notify
      try {
        bugsnagClient.notify(error);
      } catch (error) {
        // Can't do nothig if bugsnag fails :(
      }
      this.setState({ errorFound: true });
    }

    render() {
      if (this.state.errorFound) {
        return <ErrorComponent />
      }

      return <WrappedComponent bugsnagClient={bugsnagClient} />
    }
  }

export default ErrorBoundary;
