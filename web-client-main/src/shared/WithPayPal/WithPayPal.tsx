import React, { Component, Fragment } from 'react';
import SimpleAlert from '../SimpleAlert';

declare global {
  interface Window {
    paypal: any;
  }
}

export type PayPalProps = {
  initPayPal: Function,
  payPalReady: boolean,
  resetOrder: Function,
  setUserCanPurchase: Function,
  loading: boolean,

  order?: {
    orderID: string,
    payerID: string,
  }
}

export type PayPalOrder = {
  amount: {
    value: string,
    currency_code: string,
  }
}

type Props = {}
type State = {
  payPalReady: boolean,
  hasError: boolean,
  loading: boolean,
  canPurchase: boolean,
  buttonLoaded: boolean,
  order?: {
    orderID: string,
    payerID: string,
  },
  message: string,
  showMessage: boolean,
}

// This function takes a component...
const withPayPal = <P extends object>(WrappedComponent: React.ComponentType<P>) => {
  // ...and returns another component with conekta methods...
  return class extends Component<P & Props, State> {
    state = {
      payPalReady: false,
      hasError: false,
      order: undefined,
      loading: false,
      canPurchase: true,
      buttonLoaded: false,
      message: '',
      showMessage: false,
    }
    script: any = null;

    componentDidMount() {
      if (!this.isAlreadyInDOM()) {
        this.prepareScriptLoading();
      } else {
        this.setState({ payPalReady: true });
      }
    }

    componentDidUpdate() {
      if (!this.isAlreadyInDOM()) {
        this.prepareScriptLoading();
      }
    }

    componentWillUnmount() {
      if (this.script) {
        this.script.removeEventListener('load', this.handleLoad);
      }
    }

    /**
     * Function for load and listen the script load for PayPal
     */
    prepareScriptLoading() {
      this.script = document.createElement('script');
      this.script.src = process.env.REACT_APP_PAYPAL_CDN_ENDPOINT || '';
      this.script.async = true;
      this.script.addEventListener('load', this.handleLoad);
      document.body.appendChild(this.script);
    }

    resetOrder = () => {
      this.setState({ order: undefined });
    }

    setUserCanPurchase = (canPurchase: boolean, callback: Function = () => { }) => {
      this.setState({ canPurchase }, () => callback());
    }

    /**
     * On script loaded callback
     */
    handleLoad = (event?: any) => {
      this.setState({ payPalReady: true });
    }

    /**
     * Check if Conekta is alreade loaded
     */
    isAlreadyInDOM = () => {
      const scripts: any = document.scripts;
      try {
        for (let script of scripts) {
          if (script.src === process.env.REACT_APP_PAYPAL_CDN_ENDPOINT) {
            return true;
          }
        }
      } catch (error) {
        return false;
      }
      return false;
    }

    /**
     * Init PayPal JS
     */
    initPayPal = (containerId: string, order: PayPalOrder) => {
      if (!this.state.buttonLoaded && window.paypal) {
        window.paypal.Buttons({
          createOrder: (data: any, actions: any) => {
            this.setState({ loading: true });
            return actions.order.create({
              purchase_units: [order]
            });
          },
          onApprove: (data: any, actions: any) => {
            return actions.order.capture().then((details: any) => {
              // Update the state for delegate the paypal order process to another component
              this.setState({ order: data, loading: false });
            });
          },
          // onClick is called when the button is clicked
          onClick: (data: any, actions: any) => {
            // Validate if the user can purchase an plan
            if (!this.state.canPurchase) {
              this.setState({ message: 'Este plan es de única compra, tu ya lo has comprado.', showMessage: true });
              return actions.reject();
            } else {
              return actions.resolve();
            }
          },
          onCancel: (event: any) => {
            this.setState({ loading: false });
          },
          onError: (err: any) => {
            // Show an error page here, when an error occurs
            this.setState({
              loading: false,
              message: 'Ocurrió un problema al procesar tu compra con PayPal. Por favor intenta de nuevo o utiliza otra forma de pago. No se realizó ningún cobro a tu cuenta.',
              showMessage: true,
            });
          }
        }).render(`#${containerId}`);
        this.setState({ buttonLoaded: true });
      }
    }

    render() {
      const { message, showMessage } = this.state;
      const paypal = {
        initPayPal: this.initPayPal,
        resetOrder: this.resetOrder,
        loading: this.state.loading,
        setUserCanPurchase: this.setUserCanPurchase,
        ...this.state,
      }
      // Renders the wrapped component with the paypal functions
      return <Fragment>
        <WrappedComponent paypal={paypal} {...this.props as P} />
        <SimpleAlert title='' text={message} show={showMessage} onConfirm={() => this.setState({ message: '', showMessage: false })} />
      </Fragment>;
    }
  };
}

export default withPayPal;