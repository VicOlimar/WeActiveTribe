import React, { Component } from "react";

const ErrorBoundary = (WrappedComponent: any) =>
  class ErrorBoundaries extends Component {
    state = {
      errorFound: false,
    };

    componentDidCatch(error: Error, info: any) {
      this.setState({ errorFound: true });
    }

    render() {
      if (this.state.errorFound) {
        return <h1>Ups ocurrió un error</h1>;
      }

      return <WrappedComponent />;
    }
  };

export default ErrorBoundary;
