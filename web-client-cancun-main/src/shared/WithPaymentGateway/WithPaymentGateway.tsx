import React, { Component } from 'react';
import WithConekta, { ConektaProps } from '../WithConekta/WithConekta';
import WithStripe, { StripeProps } from '../WithStripe/WithStripe';
import SettingService from '../../api/Setting/SettingService';
import { StripeElements } from '@stripe/stripe-js';

export type PaymentGatewayProps = {
  paymentGateway: ConektaProps | StripeProps;
  gatewayName: 'conekta' | 'stripe';
  elements?: StripeElements;
}

const withPaymentGateway = <P extends object>(WrappedComponent: React.ComponentType<P>) => {
  class WithPaymentGateway extends Component<P, { gatewayName: 'conekta' | 'stripe' | null }> {
    state = {
      gatewayName: null as 'conekta' | 'stripe' | null,
    }

    async componentDidMount() {
      const gatewayName = await SettingService.getPaymentGateway();
      this.setState({ gatewayName: gatewayName as 'conekta' | 'stripe' });
    }

    render() {
      const { gatewayName } = this.state;

      if (!gatewayName) {
        return null; // or a loading indicator
      }

      const ComponentWithGateway = gatewayName === 'conekta' ? WithConekta(WrappedComponent) : WithStripe(WrappedComponent);

      return <ComponentWithGateway {...this.props} gatewayName={gatewayName} />;
    }
  }

  return WithPaymentGateway;
};

export default withPaymentGateway;