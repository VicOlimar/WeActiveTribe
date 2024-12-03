import React, { Component } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import './Cards.scss';

import Edit from './../../assets/edit.png';
import PaymentMethodsImage from './../../assets/payment_methods.png';
import ProfileInfo from '../../components/ProfileInfo';
import CardsService from '../../../../api/Cards';
import { Card } from '../../../../api/Cards/CardsService';
import CreditCardModal from '../../../../shared/CreditCardModal';

import VISA from './../../assets/visa.jpg';
import AMEX from './../../assets/amex.jpg';
import MASTERCARD from './../../assets/mastercard.jpg';
import STAR from './../../assets/star.png';
import TRASH from './../../assets/trash.png';
import { isUndefined } from 'util';
import WithConekta from '../../../../shared/WithConekta';
import { ConektaProps } from '../../../../shared/WithConekta/WithConekta';
import WithPayPal from '../../../../shared/WithPayPal';
import { PayPalProps } from '../../../../shared/WithPayPal/WithPayPal';
import SimpleAlert from '../../../../shared/SimpleAlert';

type ConektaTokenizeResponse = {
  id: string,
  livemode: boolean,
  object: string,
  used: boolean,
}

type Props = {
  conekta: ConektaProps,
  paypal: PayPalProps,
}

type State = {
  cards?: Array<Card>,
  rowsData: Array<{ label: string, value: string }>,
  loading: boolean,
  showModal: boolean,
  message: string,
  isEditing?: boolean,
  showMessage: boolean,
}

class Cards extends Component<Props, State> {
  CARD_BRANDS = {
    visa: "visa",
    amex: "american_express",
    mastercard: "mastercard",
  }
  state = {
    cards: [],
    rowsData: [],
    loading: false,
    showModal: false,
    message: '',
    isEditing: false,
    showMessage: false,
  }

  componentDidMount() {
    this.getUserCards();
  }

  /**
   * Get the user Conekta cards from backend
   */
  getUserCards = async () => {
    this.setState({ loading: true });
    let cards = await CardsService.find();
    this.setState({ cards }, () => this.mapCards());
  }

  /**
   * Function for open/close the modal
   */
  handleModalOpen = () => {
    const { showModal } = this.state;
    this.setState({ showModal: !showModal });
  }

  /**
   * Callback function when user submit the modal
   */
  handleOnSubmitModal = async (values: any, conekta: ConektaTokenizeResponse) => {
    const card: Card | undefined = await CardsService.create(conekta.id);
    if (card) {
      this.setState({ showModal: false }, () => this.getUserCards());
    } else {
      this.setState({ showModal: false, message: 'Ocurrió un error con tu tarjeta, por favor intenta de nuevo.' });
    }
  }

  /**
   * Get the Conekta error message and set to state
   */
  handleConektaError = (error: string) => {
    this.setState({ message: error });
  }

  /**
   * Map the cards array to {label, value}
   */
  mapCards = () => {
    const { cards } = this.state;
    if (!isUndefined(cards)) {
      const mapedCards: Array<{ label: any, value: any }> = cards.map((card: Card) => ({ label: this.createCardLabel(card), value: this.createCardValue(card) }));
      this.setState({ rowsData: mapedCards, loading: false });
    } else {
      this.setState({ loading: false });
    }
  }

  /**
   * Function to create the card label (Is for add editing behavior)
   */
  createCardLabel = (card: Card) => {
    const { isEditing } = this.state;
    if (isEditing) {
      return <span>
        <OverlayTrigger
          placement="left"
          overlay={
            <Tooltip id={`card-${card.last4}`}>
              Eliminar tarjeta.
            </Tooltip>
          }
        >
          <img className='cards__label__image-tertiary' src={TRASH} alt='card brand' onClick={() => this.handleDeleteCard(card)} />
        </OverlayTrigger>
        <OverlayTrigger
          placement="left"
          overlay={
            <Tooltip id={`card-${card.last4}`}>
              Definir como predeterminada.
            </Tooltip>
          }
        >
          <img className='cards__label__image-tertiary' src={STAR} alt='card brand' onClick={() => this.handleSetDefault(card)} />
        </OverlayTrigger>
        {card.name}
      </span>
    } else {
      return <span>{card.name}</span>
    }
  }

  /**
   * Callback function to delete a card
   */
  handleDeleteCard = async (card: Card) => {
    this.setState({ loading: true });
    const response = await CardsService.delete(card.id);
    if (response) {
      this.getUserCards();
      this.setEditing();
    } else {
      this.setState({ message: "Ocurrió un error al elminar la tarjeta seleccionada, porfavor intenta de nuevo.", showMessage: true });
    }
    this.setState({ loading: false });
  }

  /**
   * Callback function to delete a card
   */
  handleSetDefault = async (card: Card) => {
    this.setState({ loading: true });
    const response = await CardsService.update(card.id);
    if (response) {
      this.getUserCards();
      this.setEditing();
    } else {
      this.setState({ message: "Ocurrió un error al cambiar tu tarjeta predeterminada, porfavor intenta de nuevo.", showMessage: true });
    }
    this.setState({ loading: false });
  }

  /**
   * Function to change the editing value
   */
  setEditing = () => {
    const { isEditing } = this.state;
    this.setState({ isEditing: !isEditing }, () => this.mapCards());
  }

  /**
   * Create the value for a Card
   */
  createCardValue = (card: Card) => {
    const { isEditing } = this.state;
    let cardBrand = '';
    switch (card.brand) {
      case this.CARD_BRANDS.visa:
        cardBrand = VISA;
        break;
      case this.CARD_BRANDS.amex:
        cardBrand = AMEX;
        break;
      case this.CARD_BRANDS.mastercard:
        cardBrand = MASTERCARD;
        break;
      default:
        cardBrand = VISA;
        break;
    }
    return <p className='cards__label'>
      {`---- ---- ---- ${card.last4}`}
      <img className='cards__label__image' src={cardBrand} alt='card brand' />
      {card.default && !isEditing ? <img className='cards__label__image-secondary' src={STAR} alt='card brand' /> : ''}
    </p>
  }

  render() {
    const { showModal, message, rowsData, loading, isEditing, showMessage } = this.state;
    const errorMessage = 'Error al cargar tus métodos de pago';
    return (
      <div className='cards'>
        { showModal && 
          <CreditCardModal
            headerText='Agregar nueva tarjeta'
            show={showModal}
            onAccept={this.handleOnSubmitModal}
            onClose={this.handleModalOpen}
            onConektaError={this.handleConektaError}
            showCardSelector={false}
            confirmButtonText='Agregar tarjeta'
            errorMessage={message}
            loadingMessage='Agregando tu método de pago...'
          />
        }
        <ProfileInfo
          image={PaymentMethodsImage}
          buttonText='Editar tarjetas'
          buttonIcon={Edit}
          buttonAction={this.setEditing}
          rowsData={rowsData}
          errorMessage={errorMessage}
          retryText='Reintentar'
          retryCallback={this.getUserCards}
          emptyText='Parece que no tienes tarjetas'
          emptyActionText='Agregar una nueva'
          emptyActionCallback={this.handleModalOpen}
          loading={loading}
          secondaryButtonText={!isEditing && rowsData.length > 0 ? 'Agregar una nueva' : undefined}
          secondaryAction={this.handleModalOpen}
        />
        <SimpleAlert title='' text={message} show={showMessage} onConfirm={() => this.setState({ message: '', showMessage: false })} />
      </div>
    )
  }
}

export default WithPayPal(WithConekta(Cards));