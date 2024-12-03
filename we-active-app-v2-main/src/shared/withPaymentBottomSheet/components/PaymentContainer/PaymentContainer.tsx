import React, { Component } from 'react';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { Alert, Text, View, TouchableOpacity } from 'react-native';
import Divider from '../../../Divider';

// Styles
import bem from 'react-native-bem';
// @ts-ignore
import styles from  './PaymentContainer.scss';

import CardService from './../../../../services/Card';
import PlanService, { Plan } from './../../../../services/Plan/Plan';
import PaymentMethods from '../PaymentMethods';
import CardForm from './../CardForm';
import { PaymentMehodElement } from '../PaymentMethods/PaymentMethods';
import withUserContext from '../../../../contexts/UserContext/WithUserContext';
import { DefaultUserContext } from '../../../../contexts/UserContext/UserContext';
import { Card } from '../../../../services/Card/Card';
import { PlanPurcharseResponse } from '../../../../services/Plan/Plan';
import { getMoneyFormat } from '../../../../utils/money';
import Loader from '../../../Loader';
import { simpleAlert, confirmAlertWithInput } from '../../../../utils/common';

type Props = {
  onCancel: Function;
  userContext: DefaultUserContext;
  plan?: Plan;
}

type State = {
  showCardForm: boolean,
  cards: Array<Card>,
  loading: boolean,
}

class PaymentContainer extends Component<Props, State> {

  state = {
    showCardForm: false,
    cards: [],
    loading: false,
  }

  componentDidMount() {
    this.getUserCards();
  }

  getUserCards = async () => {
    this.setLoading(true);
    try {
      const cards = await CardService.find();
      this.setState({ cards });
    } catch (error) {
      console.log(error); // Create a method that notify the error
    }
    this.setLoading(false);
  }

  /**
   * On payment method press
   */
  paymentMethodPress = (paymentMethod: PaymentMehodElement) => {
    if (paymentMethod.type === 'card') {
      this.setState({ showCardForm: true });
    }
  }

  /**
   * on submit callback for conekta tokenization in CardForm component
   */
  onSubmit = async (tokenId: string, code: string) => {
    try {
      this.confirmPurchase(tokenId, true, code);
    } catch (error) {
      this.onError('Ocurrió un error en la transacción pero no te preocupes, no se hizo ningún cargo, por favor intenta de nuevo o intenta con otra tarjeta');
    }
  }

  /**
   * Handle the card press
   */
  onCardPress = async (card: Card) => {
    this.showBuyPlanConfirmationDialogWithDiscount(card.id.toString(), false);
  }

  /**
   * Confirm if the user want to purchase the selected plan
   */
  confirmPurchase = (tokenId: string, chargeUnique: boolean = false, code: string) => {
    const { plan } = this.props;

    if (plan === undefined) {
      this.showAddCardConfirmation(tokenId);
    } else {
      this.showBuyPlanConfirmationDialog(tokenId, chargeUnique, code);
    }
  }

  showAddCardConfirmation = (tokenId: string) => {
    // Works on both Android and iOS
    Alert.alert(
      'Antes de continuar',
      '¿Realmente deseas agregar la tarjeta como método de pago?',
      [
        {
          text: 'No',
          style: 'cancel',
        },
        { text: 'Sí', onPress: () => this.addPaymentMethodToUser(tokenId) },
      ],
      { cancelable: false },
    );
  }

  /**
   * Confirmation before purchase
   */
  showBuyPlanConfirmationDialog = (tokenId: string, chargeUnique: boolean = false, code: string) => {
    const { plan } = this.props;

    // Works on both Android and iOS
    Alert.alert(
      'Confirmar',
      `Confirma si deseas comprar el plan ${plan.name} por un total de ${getMoneyFormat(plan.price)}`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        { text: 'Confirmar', onPress: () => this.purchasePlan(tokenId, plan, chargeUnique, code) },
      ],
      { cancelable: false },
    );
  }

  /**
   * Confirmation before purchase
   */
  showBuyPlanConfirmationDialogWithDiscount = (tokenId: string, chargeUnique: boolean = false) => {
    const { plan } = this.props;

    // Works on both Android and iOS
    confirmAlertWithInput(
      'Confirmar',
      `Confirma si deseas comprar el plan ${plan.name} por un total de ${getMoneyFormat(plan.price)}. Si tienes un código de descuento, ingrésalo ahora`,
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        { text: 'Confirmar', onPress: (code) => this.purchasePlan(tokenId, plan, chargeUnique, code) },
      ],
    );
  }

  addPaymentMethodToUser = async (tokenId: string) => {
    this.setState({ loading: true });
    try {
      await CardService.create(tokenId);
      this.showAddedCardSuccessMessage();
    } catch (error) {
      simpleAlert('Ups', error.message);
    }
    this.setState({ loading: false });
  }

  /**
   * Function to request the Plan purchase
   */
  purchasePlan = async (tokenId: string, plan: Plan, chargeUnique: boolean = false, code: string) => {
    this.setLoading(true);
    try {
      if (chargeUnique) {
        await CardService.create(tokenId);
      }
      await PlanService.purchase(Number(plan.id), tokenId, chargeUnique, code);
      this.showSuccessAlert(plan);
    } catch (error) {
      this.onError(error.message);
    }
    this.setLoading(false);
  }

  /**
   * Display an alert with the error
   */
  onError = (error: string) => {
    Alert.alert('Ups', error, [{ text: 'Entendio' }]);
  }

  /**
   * Set the loading state
   */
  setLoading = (isLoading: boolean) => {
    this.setState({ loading: isLoading });
  }

  /**
   * Show an alert for success payment method creation
   */
  showAddedCardSuccessMessage = () => {
    simpleAlert('Correcto', 'Se ha agregado tu método de pago exitosamente', () => this.props.onCancel());
  }

  /**
   * Show the success alert after purchase
   */
  showSuccessAlert = (plan: Plan) => {
    // Works on both Android and iOS
    Alert.alert(
      'Correcto',
      `Se ha realizado la compra del plan ${plan.name} correctamente, ${plan.credits > 1 ? 'clase se han agregado' : 'clases se ha agregado'} ${plan.credits} a tu cuenta.`,
      [
        { text: 'Entendido', onPress: () => this.props.onCancel() },
      ],
      { cancelable: false },
    );
  }

  render() {
    const { cards, loading, showCardForm } = this.state;
    const { plan } = this.props;
    const b = (selector) => bem(selector, this.props, styles);

    return (
      <View style={b('payment-form')}>
        <Grid>
          <Row style={b('payment-form__header')} size={20}>
            <Col style={{ width: 100 }}>
              <TouchableOpacity onPress={() => { if (!loading) this.props.onCancel() }}>
                <Text style={b('payment-form__action')}>Cancelar</Text>
              </TouchableOpacity>
            </Col>
            <Col >
              <Text style={[b('payment-form__header__text'), { textAlign: showCardForm ? 'center' : 'left' }]}>
                {showCardForm ? 'Tarjeta' : 'Seleccionar método de pago'}
              </Text>
            </Col>
          </Row>
          <Row size={80}>
            <Col>
              <Divider color='#000' />
              {
                loading && <Loader color='#212121' />
              }
              {
                showCardForm && !loading ? <CardForm 
                cards={cards} 
                onSubmit={this.onSubmit} 
                onCardPress={this.onCardPress} 
                onError={this.onError} 
                isPayment={plan !== undefined} /> : <PaymentMethods onPress={this.paymentMethodPress} />
              }
            </Col>
          </Row>
        </Grid>
      </View>
    )
  }
}

export default withUserContext(PaymentContainer);