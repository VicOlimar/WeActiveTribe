import React, { Component } from 'react';
import { loadStripe, Stripe, StripeElements } from '@stripe/stripe-js';
import { ElementsConsumer, Elements, CardNumberElement } from '@stripe/react-stripe-js';

export type StripeProps = {
  initStripe: () => Promise<void>,
  getCardBrand: (cardNumber: string) => string | null,
  validateCardNumber: (cardNumber: string) => boolean,
  validateCvc: (cvc: string) => boolean,
  validateExpirationDate: (expiryMonth: string, expiryYear: string) => boolean,
  tokenize: (
    cardHolder: string,
    elements: StripeElements,
    successCallback: (response: PaymentGatewayTokenizeResponse) => void,
    errorCallback: (error: any) => void
  ) => void,
  paymentGatewayReady: boolean,
}

type PaymentGatewayTokenizeResponse = {
  id: string,
  livemode: boolean,
  object: string,
  used: boolean,
}

type Props = {}
type State = {
  paymentGatewayReady: boolean,
}

const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLIC_KEY || '');

const withStripe = <P extends object>(WrappedComponent: React.ComponentType<P>) => {
  return class extends Component<P & Props, State> {
    state = {
      paymentGatewayReady: false,
    }
    stripe: Stripe | null = null;
    elements: StripeElements | null = null;

    async componentDidMount() {
      await this.initStripe();
    }

    initStripe = async () => {
      if (!this.stripe) {
        this.stripe = await stripePromise;
        if (this.stripe) {
          this.setState({ paymentGatewayReady: true });
        }
      }
    }

    getCardBrand = (cardNumber: string) => {
      // Stripe.js doesn't provide a direct method to get card brand from number
      // This is a simple regex-based approach, consider using a more robust solution
      const cardPatterns = {
        visa: /^4/,
        mastercard: /^5[1-5]/,
        amex: /^3[47]/,
        discover: /^6(?:011|5)/,
        diners: /^3(?:0[0-5]|[68])/,
        jcb: /^(?:2131|1800|35)/
      };

      for (const [brand, pattern] of Object.entries(cardPatterns)) {
        if (pattern.test(cardNumber)) {
          return brand;
        }
      }

      return null;
    }

    validateCardNumber = (cardNumber: string) => {
      // Stripe.js doesn't provide a standalone method for this
      // Using a basic Luhn algorithm check
      let sum = 0;
      let isEven = false;
      for (let i = cardNumber.length - 1; i >= 0; i--) {
        let digit = parseInt(cardNumber.charAt(i), 10);
        if (isEven) {
          digit *= 2;
          if (digit > 9) {
            digit -= 9;
          }
        }
        sum += digit;
        isEven = !isEven;
      }
      return (sum % 10) === 0;
    }

    validateCvc = (cvc: string) => {
      // Simple length check, as Stripe.js doesn't provide a standalone method
      return /^[0-9]{3,4}$/.test(cvc);
    }

    validateExpirationDate = (expiryMonth: string, expiryYear: string) => {
      const currentDate = new Date();
      const expirationDate = new Date(parseInt(`20${expiryYear}`), parseInt(expiryMonth) - 1);
      return expirationDate > currentDate;
    }

    tokenize = async (
      cardHolder: string,
      elements: StripeElements,
      successCallback: (response: PaymentGatewayTokenizeResponse) => void,
      errorCallback: (error: any) => void
    ) => {
      if (!this.stripe || !elements) {
        errorCallback(new Error('Stripe not initialized'));
        return;
      }

      try {
        const cardElement = elements.getElement(CardNumberElement);
        if (!cardElement) {
          console.log("Not card element")
          errorCallback(new Error('Card element not found'));
          return;
        }

        const { error, token } = await this.stripe.createToken(cardElement, {
          name: cardHolder,
        });

        if (error) {
          errorCallback(error);
        } else if (token) {
          const formattedResponse: PaymentGatewayTokenizeResponse = {
            id: token.id,
            livemode: token.livemode,
            object: token.object,
            used: token.used,
          };
          successCallback(formattedResponse);
        }
      } catch (error) {
        console.log("Error tokenize", error)
        errorCallback(error);
      }
    }

    render() {
      const stripe: StripeProps = {
        initStripe: this.initStripe,
        getCardBrand: this.getCardBrand,
        validateCardNumber: this.validateCardNumber,
        validateCvc: this.validateCvc,
        validateExpirationDate: this.validateExpirationDate,
        tokenize: this.tokenize,
        ...this.state,
      }
      return (
        <Elements stripe={this.stripe}>
          <ElementsConsumer>
            {({ elements }) => (
              <WrappedComponent paymentGateway={stripe} elements={elements} {...this.props as P} />
            )}
          </ElementsConsumer>
        </Elements>
      );
    }
  };
}

export default withStripe;