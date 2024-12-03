import React, { Component, Fragment } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Notifier.scss';

// Based in https://github.com/fkhadra/react-toastify

type State = {};
type Props = { notifyError: Function, notifyInfo: Function };
const Notifier = (WrappedComponent: any) =>
  class ErrorBoundaries extends Component<Props, State> {
    notifierOptions = { hideProgressBar: true, className: 'notifier' };

    notifyError = (message: string) => {
      toast.error(message, this.notifierOptions);
    }

    notifyInfo = (message: string) => {
      toast.info(message, this.notifierOptions);
    }

    render() {
      return <Fragment>
        <ToastContainer />
        <WrappedComponent notifyError={this.notifyError} notifyInfo={this.notifyInfo} {...this.props} />
      </Fragment>
    }
  }

export default Notifier;
