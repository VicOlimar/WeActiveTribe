import React, { Component } from 'react';

declare global {
  interface Window {
    Conekta: any;
  }
}

export type ConektaProps = {
  initConekta: Function,
  getCardBrand: Function,
  validateCardNumber: Function,
  validateCvc: Function,
  validateExpirationDate: Function,
  tokenize: Function,
  paymentGatewayReady: boolean,
}

type Props = {}
type State = {
  paymentGatewayReady: boolean,
}

// This function takes a component...
const withConekta = <P extends object>(WrappedComponent: React.ComponentType<P>) => {
  // ...and returns another component with conekta methods...
  return class extends Component<P & Props, State> {
    state = {
      paymentGatewayReady: false,
    }
    script: any = null;

    componentDidMount() {
      if (!this.isAlreadyInDOM()) {
        this.prepareScriptLoading();
      } else {
        this.setState({ paymentGatewayReady: true });
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
     * Function for load and listen the script load for Conekta
     */
    prepareScriptLoading() {
      this.script = document.createElement('script');
      this.script.src = process.env.REACT_APP_CONEKTA_CDN_ENDPOINT || '';
      this.script.async = true;
      this.script.addEventListener('load', this.handleLoad);
      document.body.appendChild(this.script);
    }

    /**
     * On script loaded callback
     */
    handleLoad = (event?: any) => {
      this.initConekta();
    }

    /**
     * Check if Conekta is alreade loaded
     */
    isAlreadyInDOM() {
      const scripts: any = document.scripts;
      try {
        for (let script of scripts) {
          if (script.src === process.env.REACT_APP_CONEKTA_CDN_ENDPOINT) {
            return true;
          }
        }
      } catch (error) {
        return false;
      }
      return false;
    }

    /**
     * Init Conekta JS
     */
    initConekta() {
      if (window.Conekta) {
        window.Conekta.setPublicKey(process.env.REACT_APP_CONEKTA_PUBLIC_KEY || '');
        this.setState({ paymentGatewayReady: true });
      }
    }

    /**
     * Get the card brand using Conekta JS
     * @param cardNumber Card Number
     */
    getCardBrand(cardNumber: string) {
      return window.Conekta.card.getBrand(cardNumber);
    }

    /**
     * Validate the card number
     * @param cardNumber 
     */
    validateCardNumber(cardNumber: string) {
      return window.Conekta.card.validateNumber(cardNumber);
    }

    /**
     * Validate the card CVC
     * @param cvc 
     */
    validateCvc(cvc: string) {
      return window.Conekta.card.validateCVC(cvc);
    }

    /**
     * Validate the expiration date of the card
     * @param expiryMonth 
     * @param expiryYear 
     */
    validateExpirationDate(expiryMonth: string, expiryYear: string) {
      return window.Conekta.card.validateExpirationDate(expiryMonth, `20${expiryYear}`);
    }

    /**
     * Tokenize the card with the following data
     * @param cardNumber 
     * @param cardHolder 
     * @param expiryMonth 
     * @param expiryYear 
     * @param cvc 
     * @param successCallback 
     * @param errorCallback 
     */
    tokenize(
      cardNumber: string,
      cardHolder: string,
      expiryMonth: string,
      expiryYear: string,
      cvc: string,
      isDefault: boolean,
      successCallback: string,
      errorCallback: string
    ) {
      const tokenParams = {
        card: {
          number: cardNumber,
          name: cardHolder,
          exp_year: expiryYear,
          exp_month: expiryMonth,
          cvc,
          default: isDefault,
        }
      }
      window.Conekta.Token.create(tokenParams, successCallback, errorCallback);
    }

    render() {
      const conekta = {
        initConekta: this.initConekta,
        getCardBrand: this.getCardBrand,
        validateCardNumber: this.validateCardNumber,
        validateCvc: this.validateCvc,
        validateExpirationDate: this.validateExpirationDate,
        tokenize: this.tokenize,
        ...this.state,
      }
      // Renders the wrapped component with the conekta functions
      return <WrappedComponent paymentGateway={conekta} {...this.props as P} />;
    }
  };
}

export default withConekta;