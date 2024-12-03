import React, { Component } from 'react';
import { Alert } from 'react-bootstrap';
import Modal from './../Modal';
import CreditCardForm from './components/CreditCardForm';
import Header from './components/Header';

import './CreditCardModal.scss';
import { Plan } from '../../api/Plan/Plan';
import { Card } from '../../api/Cards/CardsService';
import { PayPalProps } from '../WithPayPal/WithPayPal';
import WithPayPal from '../WithPayPal';
import { Purchase } from './../../api/Purchases/Purchases';
import PurchasesServices from './../../api/Purchases';
import WithPaymentGateway from '../WithPaymentGateway/WithPaymentGateway';
import { ConektaProps } from '../WithConekta/WithConekta';
import { StripeProps } from '../WithStripe/WithStripe';
import { StripeElements } from '@stripe/stripe-js';

type Props = {
  show: boolean;
  onClose: Function;
  onAccept: Function;
  notifyError?: Function;
  plan?: Plan | null;
  headerText?: string;
  showCardSelector?: boolean;
  confirmButtonText?: string;
  errorMessage?: string;
  onPaymentGatewayError?: Function;
  cards?: Card[];
  loading?: boolean;
  paypal?: PayPalProps;
  paypalOnly?: boolean;
  loadingMessage?: string;
  onCloseMessage?: Function;
  showDiscount?: boolean;
  paymentGateway?: ConektaProps | StripeProps;
  gatewayName?: 'conekta' | 'stripe';
  elements?: StripeElements;
};

type FormValues = {
  card: string;
  name: string;
  card_one: string;
  card_two: string;
  card_three: string;
  card_four: string;
  month: string;
  year: string;
  cvc: string;
  isDefault: boolean;
  code: string;
};

type State = {
  currentFocus: string;
  loading: boolean;
  resetForm: boolean;
  touched?: boolean;
  paypalLoaded: boolean;
  paypalProcessed: boolean;
  canPurchaseChecked: boolean;
  purchasesLoaded: boolean;
};

class CreditCardModal extends Component<Props, State> {
  formik: any = React.createRef();
  state = {
    currentFocus: '',
    loading: false,
    resetForm: false,
    touched: false,
    paypalLoaded: false,
    paypalProcessed: false,
    canPurchaseChecked: false,
    purchasesLoaded: false,
  };

  componentDidUpdate(nextProps: Props) {
    if (
      !this.state.canPurchaseChecked &&
      nextProps.show &&
      !this.state.purchasesLoaded &&
      !this.state.loading
    ) {
      this.getUserPurchases();
    }

    if (
      nextProps.paypal &&
      nextProps.paypal.payPalReady &&
      !this.state.paypalLoaded &&
      this.props.plan
    ) {
      this.props.paypal!.initPayPal('paypal-button', {
        amount: {
          value: this.props.plan.price.toString(),
          currency_code: 'MXN',
        },
      });
      this.setState({ paypalLoaded: true });
    }

    if (
      this.props.paypal &&
      this.props.paypal.order &&
      !this.state.paypalProcessed
    ) {
      this.setState({ resetForm: true, paypalProcessed: true });
      this.props.onAccept(null, null, this.props.paypal.order, null, { gatewayName: 'paypal', isDefault: null });
      this.props.paypal.resetOrder();
    }
  }

  getUserPurchases = async (callback: any = () => {}) => {
    const plan = this.props.plan;
    const purchases: { data: Purchase[]; count: number } | string =
      await PurchasesServices.find(1, 10000); // Set temporally

    if (typeof purchases === 'string') {
      const { onPaymentGatewayError } = this.props;
      if (onPaymentGatewayError) {
        onPaymentGatewayError(
          'Ocurrió un problema al verificar si puedes comprar este plan, por favor intenta de nuevo',
        );
      }
    } else {
      if (plan && plan.new_users_only) {
        const purchased = purchases.data.find((purchase: Purchase) => {
          return purchase.plan_name.toLowerCase() === plan.name.toLowerCase();
        });
        if (purchased) {
          this.props.paypal!.setUserCanPurchase(false, callback);
        } else {
          this.props.paypal!.setUserCanPurchase(true, callback);
        }
        this.setState({ purchasesLoaded: true });
      } else {
        this.props.paypal!.setUserCanPurchase(true, callback);
        this.setState({ purchasesLoaded: true });
      }
    }
  };

  /**
   *
   * @param {*} values
   */
  onSubmit = async (values: FormValues) => {
    const { card, name, isDefault } = values;
    this.setState({ touched: true });
    const { paymentGateway, gatewayName, elements } = this.props;

    if (paymentGateway && paymentGateway.paymentGatewayReady) {
      this.setState({ loading: true, currentFocus: '' });
      if (card !== '') {
        this.props.onAccept(values, null, null, values.code, { gatewayName, isDefault });
        this.setState({ loading: false, currentFocus: '' });
      } else {
        if (gatewayName === 'stripe' && elements) {
          await (paymentGateway as StripeProps).tokenize(
              name,
              elements,
              (response: any) => {
                this.handleSuccessResponse(response, values.code, isDefault);
              },
              this.handleErrorResponse,
          );
        } else if (gatewayName === 'conekta') {
          // Handle Conekta or other payment gateways
          const {
            card_one,
            card_two,
            card_three,
            card_four,
            month,
            year,
            cvc,
          } = values;
          (paymentGateway as ConektaProps).tokenize(
            `${card_one}${card_two}${card_three}${card_four}`,
            name,
            month,
            year,
            cvc,
            (response: any) => {
              this.handleSuccessResponse(response, values.code, isDefault);
            },
            this.handleErrorResponse,
          );
        }
      }
    }
  };

  handleSuccessResponse = (response: any, code: string, isDefault: boolean) => {
    const { gatewayName } = this.props;
    this.setState({ loading: false, resetForm: true });
    this.props.onAccept(null, response, null, code, { gatewayName, isDefault });
  };

  handleErrorResponse = (error: any) => {
    const { onPaymentGatewayError } = this.props;
    this.setState({ loading: false, resetForm: false });
    if (onPaymentGatewayError) {
      const errorMessage =
        error.message_to_purchaser ||
        'Un error inesperado ocurrió durante el proceso de pago. Intenta de nuevo.';
      onPaymentGatewayError(errorMessage);
    }
  };

  /**
   * Function for do something in modal behavior after closes
   */
  onClose = () => {
    const { loading } = this.state;
    const { loading: propsLoading } = this.props;
    if (
      loading ||
      propsLoading ||
      (this.props.paypal && this.props.paypal.loading)
    ) {
      return;
    }
    this.setState({
      currentFocus: '',
      resetForm: true,
      canPurchaseChecked: false,
      loading: false,
    });
    this.props.onClose();
  };

  /**
   * Callback function when the form need change the focus (Credit card numbers)
   * @param inputName - The new input that be in focus
   */
  onFocusChange = (inputName: string) => {
    this.setState({ currentFocus: inputName });
  };

  handleReset = () => {
    const { resetForm } = this.state;
    this.setState({ resetForm: !resetForm });
  };

  render() {
    const { currentFocus, loading, resetForm } = this.state;
    const {
      plan,
      headerText,
      showCardSelector,
      confirmButtonText,
      errorMessage,
      cards,
      loading: propsLoading,
      onCloseMessage,
    } = this.props;

    return (
      <div className={'credit-card__modal'}>
        <Modal
          className="credit-card__modal-width"
          show={this.props.show}
          header={
            <Header
              headerText={headerText}
              plan={plan}
              onCancel={this.onClose}
            />
          }
          footer={null}
          onClose={this.onClose}
        >
          <div className={`credit-card__modal__form`}>
            {errorMessage && (
              <Alert
                className="credit-card__modal__form__error"
                show={errorMessage !== undefined}
                key={errorMessage}
                variant="danger"
                onClose={() => {
                  if (onCloseMessage) onCloseMessage();
                }}
                dismissible
              >
                {errorMessage}
              </Alert>
            )}
            <CreditCardForm
              cards={cards}
              onSubmit={this.onSubmit}
              currentFocus={currentFocus}
              onFocusChange={this.onFocusChange}
              loading={
                loading ||
                propsLoading ||
                (this.props.paypal ? this.props.paypal.loading : false)
              }
              showCardSelector={showCardSelector}
              confirmButtonText={confirmButtonText}
              needClearForm={resetForm}
              onReset={this.handleReset}
              touched={this.state.touched}
              loadingMessage={this.props.loadingMessage}
              showDiscount={this.props.showDiscount}
              gatewayName={this.props.gatewayName}
              elements={this.props.elements}
            />
          </div>
        </Modal>
      </div>
    );
  }
}

export default WithPaymentGateway(WithPayPal(CreditCardModal));
