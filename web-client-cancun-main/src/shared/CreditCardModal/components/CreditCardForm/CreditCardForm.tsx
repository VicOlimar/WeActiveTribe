import React from 'react';
import { Col, Row } from 'react-bootstrap';
import { Formik, Form, FormikProps } from 'formik';
import { validateNumber } from './../../../../utils/common';
import Button from './../Button';
import Input from './../../../Input';
import Select from './../../../Select';
import Visa from './../../assets/visa.jpg';
import Amex from './../../assets/amex.jpg';
import MasterCard from './../../assets/mastercard.jpg';
import * as Yup from 'yup'
import './CreditCardForm.scss';
import { Card } from '../../../../api/Cards/CardsService';
import { isNullOrUndefined } from 'util';
import CircularLoader from '../../../CircularLoader';
import { CardNumberElement, CardExpiryElement, CardCvcElement } from '@stripe/react-stripe-js';
import { StripeElements, StripeElementStyle } from '@stripe/stripe-js';

type Props = {
  onSubmit: Function,
  loading?: boolean,
  currentFocus?: string,
  onFocusChange?: Function,
  showCardSelector?: boolean,
  confirmButtonText?: string,
  needClearForm?: boolean,
  onReset?: Function,
  cards?: Card[],
  showCardForm?: boolean,
  touched?: boolean,
  paypalOnly?: boolean,
  loadingMessage?: string,
  showDiscount?: boolean,
  gatewayName?: string,
  elements?: StripeElements,
}

type FormValues = {
  card: string,
  name: string,
  card_one: string,
  card_two: string,
  card_three: string,
  card_four: string
  month: string,
  year: string,
  cvc: string,
  isDefault: boolean,
  code: string,
}

const CreditCardForm = (props: Props) => {

  let cards: Array<{ value: any, label: string, default: boolean }> = [];
  if (props.cards) {
    cards = props.cards.map(card => {
      return { value: card.id, label: `**** **** **** ${card.last4}`, default: card.default }
    });
  }

  const CARD_IDENTIFIERS = {
    americanExpress: '3',
    visa: '4',
    masterCard: '5',
  }

  /**
    * Callback function when user submit the form
    * @param {*} values 
    */
  function onSubmit(values: FormValues, { resetForm }: any) {
    props.onSubmit(values);
  }

  /**
   * Function for validate the card input
   * @param event HTML Event
   * @param name Input name
   * @param formProps Formik formProps
   */
  function validateCardNumberInput(event: any, name: string, formProps: any) {
    const valueLength = event.target.value.length;
    const value = valueLength > 0 ? event.target.value[valueLength - 1] : event.target.value;

    if (validateNumber(value)) {
      if (valueLength <= 4) {
        formProps.setFieldValue(name, event.target.value);
      }
      if (valueLength === 4) {
        focusNeedChange(name);
      } else if (value === '') {
        focusNeedChange(name, true);
      }
    }
  }

  /**
   * Function for validate the card input
   * @param event HTML Event
   * @param name Input name
   * @param formProps Formik formProps
   */
  function validateExpDate(event: any, name: string, formProps: any, maxLength: number = 2) {
    const valueLength = event.target.value.length;
    const value = valueLength > 0 ? event.target.value[valueLength - 1] : event.target.value;

    if (validateNumber(value)) {
      if (valueLength <= maxLength) {
        formProps.setFieldValue(name, event.target.value);
      }
      if (valueLength === maxLength) {
        focusNeedChange(name);
      } else if (value === '') {
        focusNeedChange(name, true);
      }
    }
  }

  /**
   * Function called for change the current focus based in the latest focus
   * @param inputName The input name
   * @param backward If the focus need be backward
   */
  function focusNeedChange(inputName: string, backward: boolean = false) {
    if (props.onFocusChange) {
      let newInputFocus = '';
      switch (inputName) {
        case 'card_one':
          newInputFocus = backward ? '' : 'card_two';
          break;
        case 'card_two':
          newInputFocus = backward ? 'card_one' : 'card_three';
          break;
        case 'card_three':
          newInputFocus = backward ? 'card_two' : 'card_four';
          break;
        case 'card_four':
          newInputFocus = backward ? 'card_three' : 'month';
          break;
        case 'month':
          newInputFocus = backward ? 'card_four' : 'year';
          break;
        case 'year':
          newInputFocus = backward ? 'month' : 'cvc';
          break;
        case 'cvc':
          newInputFocus = backward ? 'year' : '';
          break;
        default:
          break;
      }
      props.onFocusChange(newInputFocus);
    }
  }

  /**
   * Function for get the card logo based in the first card number
   * @param firstNumber The card's firts number
   */
  function getCardLogo(firstNumber: string) {
    let logo = '';
    switch (firstNumber) {
      case CARD_IDENTIFIERS.americanExpress:
        logo = Amex;
        break;
      case CARD_IDENTIFIERS.visa:
        logo = Visa;
        break;
      case CARD_IDENTIFIERS.masterCard:
        logo = MasterCard;
        break;
      default:
        logo = Visa;
    }
    return logo;
  }

  function checkReset(formProps: any) {
    if (props.needClearForm) {
      formProps.resetForm();
      if (props.onReset) props.onReset();
    }
  }

  function getSchema(value: string, schema: any) {
    return value ? schema : schema.required('Campo requerido');
  }

  const { showCardSelector } = props;
  const defaultCard = cards.find(card => card.default);
  const initialValues = {
    card: !isNullOrUndefined(defaultCard) && !props.touched ? defaultCard.value : '',
    name: '',
    card_one: '',
    card_two: '',
    card_three: '',
    card_four: '',
    month: '',
    year: '',
    cvc: '',
    isDefault: false,
    code: '',
  };

  const creditCardValidationSchema = Yup.object().shape({
    card: Yup.string(),
    name: Yup.string().when('card', getSchema),
    card_one: Yup.string().when(['card', 'gatewayName'], {
      is: (card: string, gatewayName: string) => card === '' && gatewayName !== 'stripe',
      then: Yup.string().required('Campo requerido'),
      otherwise: Yup.string(),
    }),
    card_two: Yup.string().when(['card', 'gatewayName'], {
      is: (card: string, gatewayName: string) => card === '' && gatewayName !== 'stripe',
      then: Yup.string().required('Campo requerido'),
      otherwise: Yup.string(),
    }),
    card_three: Yup.string().when(['card', 'gatewayName'], {
      is: (card: string, gatewayName: string) => card === '' && gatewayName !== 'stripe',
      then: Yup.string().required('Campo requerido'),
      otherwise: Yup.string(),
    }),
    card_four: Yup.string().when(['card', 'gatewayName'], {
      is: (card: string, gatewayName: string) => card === '' && gatewayName !== 'stripe',
      then: Yup.string().required('Campo requerido'),
      otherwise: Yup.string(),
    }),
    month: Yup.string().when(['card', 'gatewayName'], {
      is: (card: string, gatewayName: string) => card === '' && gatewayName !== 'stripe',
      then: Yup.string().required('Campo requerido'),
      otherwise: Yup.string(),
    }),
    year: Yup.string().when(['card', 'gatewayName'], {
      is: (card: string, gatewayName: string) => card === '' && gatewayName !== 'stripe',
      then: Yup.string().required('Campo requerido'),
      otherwise: Yup.string(),
    }),
    cvc: Yup.string().when(['card', 'gatewayName'], {
      is: (card: string, gatewayName: string) => card === '' && gatewayName !== 'stripe',
      then: Yup.string().required('Campo requerido'),
      otherwise: Yup.string(),
    }),
    isDefault: Yup.bool(),
    code: Yup.string(),
  });

  const renderStripeElement = (elementType: string, placeholder?: string) => {
    if (props.gatewayName !== 'stripe' || !props.elements) {
      return null;
    }

    const style: StripeElementStyle = {
      base: {
        fontFamily: '"Raleway", "Helvetica Neue", Helvetica, Arial, sans-serif',
        color: "#212121",
        fontSize: "16px",
        fontWeight: 300,
        padding: "10px 15px",
        '::placeholder': {
          color: "#5d3188",
        },
        ':disabled': {
          color: '#757575',
        },
      },
      invalid: {
        color: '#9e2146',
      },
    };
    const options = {
      style: style,
      placeholder: placeholder,
    };

    switch (elementType) {
      case 'cardNumber':
        return <CardNumberElement options={options} />;
      case 'cardExpiry':
        return <CardExpiryElement options={options} />;
      case 'cardCvc':
        return <CardCvcElement options={options} />;
      default:
        return null;
    }
  };

  const renderDefaultCardFields = (formProps: FormikProps<FormValues>) => (
    <>
      <Row>
        <Col>
          <Input
            center
            label={''}
            type="text"
            name={'card_one'}
            placeholder=''
            required={true}
            value={formProps.values.card_one}
            focus={props.currentFocus === 'card_one'}
            className='credit_card__form__input'
            onFocus={() => { if (props.onFocusChange) props.onFocusChange('card_one') }}
            onChange={(e: any) => { validateCardNumberInput(e, 'card_one', formProps) }}
          />
          <span className='credit_card__form__divider'>-</span>
        </Col>
        <Col>
          <Input
            center
            label={''}
            type="text"
            name={'card_two'}
            placeholder=''
            required={true}
            value={formProps.values.card_two}
            focus={props.currentFocus === 'card_two'}
            onFocus={() => { if (props.onFocusChange) props.onFocusChange('card_two') }}
            onChange={(e: any) => { validateCardNumberInput(e, 'card_two', formProps) }}
          />
          <span className='credit_card__form__divider'>-</span>
        </Col>
        <Col>
          <Input
            center
            label={''}
            type="text"
            name={'card_three'}
            placeholder=''
            required={true}
            value={formProps.values.card_three}
            focus={props.currentFocus === 'card_three'}
            onFocus={() => { if (props.onFocusChange) props.onFocusChange('card_three') }}
            onChange={(e: any) => { validateCardNumberInput(e, 'card_three', formProps) }}
          />
          <span className='credit_card__form__divider'>-</span>
        </Col>
        <Col>
          <Input
            center
            label={''}
            type="text"
            name={'card_four'}
            placeholder=''
            required={true}
            value={formProps.values.card_four}
            focus={props.currentFocus === 'card_four'}
            onFocus={() => { if (props.onFocusChange) props.onFocusChange('card_four') }}
            onChange={(e: any) => { validateCardNumberInput(e, 'card_four', formProps) }}
          />
        </Col>
        <Col xs={2} lg={2}>
          <div className='credit_card__form__card_logo'>
            {formProps.values.card_one && formProps.values.card_one.length > 0 && <img alt='credit card logo' src={getCardLogo(formProps.values.card_one[0])} />}
          </div>
        </Col>
      </Row>
      <Row>
        <Col xs={6}>
          <p className={'credit_card__form__expiration'}>Fecha de Expiración:</p>
        </Col>
        <Col xs={6}>
          <p className={'credit_card__form__cvc'}>C&oacute;digo de Seguridad:</p>
        </Col>
        <Col xs={4} lg={4}>
          <Input
            label={''}
            type="text"
            name={'month'}
            placeholder='Mes'
            required={true}
            value={formProps.values.month}
            focus={props.currentFocus === 'month'}
            onFocus={() => { if (props.onFocusChange) props.onFocusChange('month') }}
            onChange={(e: any) => { validateExpDate(e, 'month', formProps) }}
          />
        </Col>
        <Col xs={4} lg={4}>
          <Input
            label={''}
            type="text"
            name={'year'}
            placeholder='Año'
            required={true}
            value={formProps.values.year}
            focus={props.currentFocus === 'year'}
            onFocus={() => { if (props.onFocusChange) props.onFocusChange('year') }}
            onChange={(e: any) => { validateExpDate(e, 'year', formProps) }}
          />
        </Col>
        <Col xs={4} lg={4}>
          <Input
            label={''}
            type="text"
            name={'cvc'}
            placeholder='CVC'
            required={true}
            value={formProps.values.cvc}
            focus={props.currentFocus === 'cvc'}
            onFocus={() => { if (props.onFocusChange) props.onFocusChange('cvc') }}
            onChange={(e: any) => { validateExpDate(e, 'cvc', formProps, getCardLogo(formProps.values.card_one[0]) === Amex ? 4 : 3) }}
          />
        </Col>
      </Row>
    </>
  );

  const renderStripeCardFields = () => (
    <>
      <Row>
        <Col xs={12}>
          <div className='credit_card__form__stripe-element'>
            {renderStripeElement('cardNumber', 'Número de tarjeta')}
          </div>
        </Col>
      </Row>
      <Row>
        <Col xs={6}>
          <label className='credit_card__form__expiration w-100'>Fecha de Expiración:</label>
          <div className='credit_card__form__stripe-element'>
            {renderStripeElement('cardExpiry', 'MM/AA')}
          </div>
        </Col>
        <Col xs={6}>
          <label className='credit_card__form__cvc text-left w-100'>Código de Seguridad:</label>
          <div className='credit_card__form__stripe-element'>
            {renderStripeElement('cardCvc', 'CVC')}
          </div>
        </Col>
      </Row>
    </>
  );

  return (
    <Formik
      enableReinitialize
      validationSchema={creditCardValidationSchema}
      onSubmit={onSubmit}
      initialValues={initialValues}
    >
      {(formProps: FormikProps<FormValues>) => (
        <Form className={'credit_card__form'}>
          {checkReset(formProps)}

          <div className={props.loading ? 'd-none' : ''}>
            <Row>
              {showCardSelector && !props.paypalOnly && (
                <Col xs={12}>
                  <Select
                    label={''}
                    name={'card'}
                    placeholder='Agregar tarjeta nueva'
                    required={false}
                    value={formProps.values.card}
                    options={cards}
                    onChange={(e: any) => { formProps.setFieldValue('card', e.target.value) }}
                    defaultLabel='Agregar nueva tarjeta'
                    emptyLabel={'Agregar nueva tarjeta'}
                  />
                </Col>
              )}
            </Row>

            <Row>
              <Col xs={12}>
                <Input
                  label={''}
                  type="text"
                  name={'name'}
                  placeholder='Nombre Completo'
                  required={true}
                  value={formProps.values.name}
                  focus={props.currentFocus === 'name'}
                  onFocus={() => { if (props.onFocusChange) props.onFocusChange('name') }}
                  onChange={(e: any) => { formProps.setFieldValue('name', e.target.value) }}
                />
              </Col>
            </Row>
            
            {formProps.values.card === '' && !props.paypalOnly && (
              <>
                {props.gatewayName === 'stripe' && props.elements
                  ? renderStripeCardFields()
                  : renderDefaultCardFields(formProps)}
              </>
            )}

            <Row>
              <Col xs={6}>
                {formProps.values.card === '' && !props.paypalOnly && cards.length !== 0 && (
                  <div className={'credit_card__form__checkbox'}>
                    <Input
                      label={'Predeterminada'}
                      name={'default'}
                      type='checkbox'
                      required={false}
                      checked={formProps.values.isDefault}
                      onChange={(e: any) => { formProps.setFieldValue('isDefault', e.target.checked) }}
                    />
                  </div>
                )}
              </Col>
            </Row>

            {props.showDiscount && (
              <Row>
                <Col xs={4} lg={4}>
                  <Input
                    label={''}
                    type="text"
                    name={'code'}
                    placeholder='Cupón'
                    required={false}
                    value={formProps.values.code}
                    onChange={(e: any) => { formProps.setFieldValue('code', e.target.value) }}
                  />
                </Col>
              </Row>
            )}
          </div>

          <Row>
            {props.paypalOnly && (
              <Col xs={12} lg={props.paypalOnly ? 12 : 6}>
                <p className='credit_card__form__paypal__message'>El plan seleccionado solo tiene como única forma de pago el uso de PayPal.</p>
              </Col>
            )}
            <Col xs={12} lg={props.paypalOnly ? 12 : 6}>
              <div id='paypal-button' className={`credit_card__form__paypal credit_card__form__paypal${(formProps.values.card === '' || props.paypalOnly) && !props.loading ? '' : '-hidde'}`}></div>
            </Col>
            {!props.paypalOnly && !props.loading && (
              <Col xs={12} lg={6}>
                <Button type='submit' className='credit_card__form__buy' text={props.confirmButtonText} loading={props.loading} />
              </Col>
            )}
            {props.loading && (
              <CircularLoader message={props.loadingMessage ? props.loadingMessage : 'Procesando tu pago...'} />
            )}
          </Row>
        </Form>
      )}
    </Formik>
  );
}

export default CreditCardForm;