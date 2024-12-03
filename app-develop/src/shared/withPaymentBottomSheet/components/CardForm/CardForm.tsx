import React, { Component } from 'react';
import { CONEKTA_PUBLIC_KEY } from 'react-native-dotenv';
import { Row, Col, Grid } from 'react-native-easy-grid';
import { Text, TextInput, Button, ScrollView, NativeModules } from 'react-native';
import { Formik } from 'formik';
import * as Yup from 'yup';

import styles from './CardForm.scss';
import bem from 'react-native-bem';
import { Card } from '../../../../services/Card/Card';
import CardItem from '../CardItem';
import { TouchableOpacity } from 'react-native-gesture-handler';

const conekta = NativeModules.RNConekta;
// Set public key
conekta.setPublicKey(CONEKTA_PUBLIC_KEY);

type State = {

};

type Props = {
  cards: Array<Card>,
  onCardPress: Function,
  onSubmit: Function,
  onError: Function,
  isPayment: boolean,
};

type FormValues = {
  name: string,
  cardNumber: string,
  expYear: string,
  expMonth: string,
  cvc: string,
  code: string,
}

class CardForm extends Component<Props, State> {

  state = {
    cards: [],
  }

  /**
   * Submit callback for card form
   */
  handleSubmit = (values: FormValues) => {
    conekta.createToken(values, ((data: any) => this.handleConektaTokenization(data, values.code)), this.handleConektaError);
  }

  /**
   * Handle the correct card tokenization from Conekta
   */
  handleConektaTokenization = (data: any, code: string) => {
    this.props.onSubmit(data.id, code);
  }

  /**
   * Send and error when conekta fails to the parent component
   */
  handleConektaError = (error: any) => {
    this.props.onError('Ocurrió un error con tu tarjeta, no se hizo ningún cargo, por favor intenta de nuevo o intenta con otra tarjeta');
  }

  /**
   * Find the default card in Cards array and return it
   */
  getDefaultCard = () => {
    const { cards } = this.props;
    return cards.length > 0 ? cards.find((card: Card) => card.default) : null;
  }

  /**
   * Filter the Cards array without the default card
   */
  getCardsWithoutDefault = () => {
    const { cards } = this.props;
    return cards.length > 0 ? cards.filter((card: Card) => !card.default) : [];
  }

  render() {
    const { isPayment } = this.props;
    const b = (selector) => bem(selector, {}, styles);

    const validationSchema = Yup.object().shape({
      name: Yup.string().required('Campo requerido'),
      cardNumber: Yup.string().required('Campo requerido'),
      expMonth: Yup.string().required('Campo requerido'),
      expYear: Yup.string().required('Campo requerido'),
      cvc: Yup.string().required('Campo requerido'),
    });

    const initialValues: FormValues = {
      name: '',
      cardNumber: '',
      expYear: '',
      expMonth: '',
      cvc: '',
      code: '',
    };
    const defaultCard = this.getDefaultCard();
    const cards = this.getCardsWithoutDefault();

    return (
      <ScrollView style={b('card_form')}>
        <Formik
          initialValues={initialValues}
          onSubmit={this.handleSubmit}
          validationSchema={validationSchema}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
            <Grid>
              {
                isPayment && <Row>
                  <Col>
                    <ScrollView style={b('card_form__cards')} horizontal={true}>
                      <Grid>
                        <Row>
                          {
                            defaultCard !== null && <Col style={{ marginRight: 20 }}>
                              <Text style={b('card_form__card_title')}>Predeterminada</Text>
                              <CardItem card={defaultCard} onPress={this.props.onCardPress} />
                            </Col>
                          }
                          {
                            cards.length > 0 && < Col >
                              <Text style={b('card_form__card_title')}>Recientes</Text>
                              <Row>
                                {
                                  cards.map(card => <Col key={card.created_at} >
                                    <CardItem card={card} onPress={this.props.onCardPress} />
                                  </Col>)
                                }
                              </Row>
                            </Col>
                          }
                        </Row>
                      </Grid>
                    </ScrollView>
                  </Col>
                </Row>
              }
              <Row>
                <Col>
                  <TextInput
                    style={b('card_form__input')}
                    onChangeText={handleChange('name')}
                    onBlur={handleBlur('name')}
                    value={values.name}
                    placeholder='Nombre'
                    placeholderTextColor='#bdbdbd'
                  />
                  {
                    errors.name && touched.name && <Text style={b('card_form__error')}>{errors.name}</Text>
                  }
                </Col>
              </Row>
              <Row>
                <Col>
                  <TextInput
                    style={b('card_form__input')}
                    keyboardType='numeric'
                    onChangeText={handleChange('cardNumber')}
                    onBlur={handleBlur('cardNumber')}
                    value={values.cardNumber}
                    placeholder='Número de la tarjeta'
                    placeholderTextColor='#bdbdbd'
                  />
                  {
                    errors.cardNumber && touched.cardNumber && <Text style={b('card_form__error')}>{errors.cardNumber}</Text>
                  }
                </Col>
              </Row>
              <Row>
                <Col>
                  <Text style={b('card_form__label')}>Mes de{'\n'}expiración</Text>
                  <TextInput
                    style={b('card_form__input')}
                    onChangeText={handleChange('expMonth')}
                    onBlur={handleBlur('expMonth')}
                    value={values.expMonth}
                    keyboardType='numeric'
                  />
                  {
                    errors.expMonth && touched.expMonth && <Text style={b('card_form__error')}>{errors.expMonth}</Text>
                  }
                </Col>
                <Col>
                  <Text style={b('card_form__label')}>Año de{'\n'}expiración</Text>
                  <TextInput
                    style={b('card_form__input')}
                    onChangeText={handleChange('expYear')}
                    onBlur={handleBlur('expYear')}
                    value={values.expYear}
                    keyboardType='numeric'
                  />
                  {
                    errors.expYear && touched.expYear && <Text style={b('card_form__error')}>{errors.expYear}</Text>
                  }
                </Col>
                <Col>
                  <Text style={b('card_form__label')}>Número de {'\n'}seguridad</Text>
                  <TextInput
                    style={b('card_form__input')}
                    onChangeText={handleChange('cvc')}
                    onBlur={handleBlur('cvc')}
                    value={values.cvc}
                    keyboardType='numeric'
                  />
                  {
                    errors.cvc && touched.cvc && <Text style={b('card_form__error')}>{errors.cvc}</Text>
                  }
                </Col>
              </Row>
              {
                isPayment && <Row>
                  <Col>
                    <Text style={b('card_form__label')}>Cupón</Text>
                    <TextInput
                      style={b('card_form__input')}
                      onChangeText={handleChange('code')}
                      onBlur={handleBlur('code')}
                      value={values.code}
                      keyboardType='numeric'
                    />
                    {
                      errors.code && touched.code && <Text style={b('card_form__error')}>{errors.code}</Text>
                    }
                  </Col>
                </Row>
              }
              <Row>
                <Col>
                  <Button color='#757575' onPress={() => handleSubmit()} title="Agregar" />
                </Col>
              </Row>
            </Grid>
          )}
        </Formik>
      </ScrollView >
    );
  }
}

export default CardForm;