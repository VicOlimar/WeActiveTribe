import React, { Component } from 'react';

type Props = {};
type State = {};

const ErrorBoundary = (WrappedComponent: any) =>
  class ErrorBoundaries extends Component {
    state = {
      errorFound: false
    }

    componentDidCatch(error: Error, info: any) {
      //TODO: Add bugsnag Notify
      this.setState({ errorFound: true });
    }

    render() {

      if (this.state.errorFound) {
       return <h1>Ups ocurrió un error</h1>
      }

      return <WrappedComponent/>
    }
  }

export default ErrorBoundary;
