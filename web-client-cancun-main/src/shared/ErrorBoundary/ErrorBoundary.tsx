import React, { Component } from 'react';
import './ErrorBoundary.scss';

// Bugsnag
import bugsnag from '@bugsnag/js';
import bugsnagReact from '@bugsnag/plugin-react';

// Bugsnag configuration
const bugsnagClient = bugsnag({
  apiKey: process.env.REACT_APP_BUGSNAG_APY_KEY || '',
  notifyReleaseStages: ['production', 'staging'],
  releaseStage: process.env.REACT_APP_ENV || 'development',
});
bugsnagClient.use(bugsnagReact, React);

type Props = {};
type State = {};

const ErrorBoundary = (WrappedComponent: any) =>
  class ErrorBoundaries extends Component {
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
        return <div className={'error_boundary'}>
          <div className="notfound">
            <div className="notfound-404">
              <h1>Ups</h1>
              <h2>Algo salió mal, pero no es tu culpa</h2>
            </div>
            <a href="/" onClick={() => this.setState({ errorFound: false })}>Ir al inicio</a>
          </div>
        </div>
      }

      return <WrappedComponent bugsnagClient={bugsnagClient} />
    }
  }

export default ErrorBoundary;
