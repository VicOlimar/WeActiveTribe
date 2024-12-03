import React, { Component } from 'react';
import { View, ScrollView, Text, Image } from 'react-native';
import hoistNonReactStatics from 'hoist-non-react-statics';
import LinearGradient from 'react-native-linear-gradient';
import Logo from '../../assets/img/logo.png';
import WeHiit from '../../assets/img/we-hiit.png';
import WeRide from '../../assets/img/we-ride.png';
import bem from 'react-native-bem';

const styles = require('./About.scss');

type Props = {}
type State = {}

class Terms extends Component<Props, State> {
  static navigationOptions = {
    headerShown: true,
    headerMode: 'screen',
  }

  render() {
    const b = (selector) => bem(selector, {}, styles);

    return (
      <LinearGradient
        style={b('about')}
        colors={['#171c32', '#3e0923']} // PURPLE / BLUE
        start={{ x: 0.0, y: 0.0 }} end={{ x: 0.5, y: 1.0 }}>
        <ScrollView style={b('about__content')}>
          <View style={b('about__logo_container')}>
            <Image source={Logo} style={b('about__logo_container__image')} />
          </View>
          <View style={b('about__content__info')}>
            <Text style={b('about__content__info__title')}>¿Qué es We Active Tribe?</Text>
            <Text style={b('about__content__info__text')}>
              El nombre We nace de esa fiel creencia que para avanzar y superarnos de manera personal, es primordial el trabajo en equipo.
    We es una tribu conformada por socios accionistas, coaches, staff, riders, agencia de publicidad, entre muchos otros.
    En We trabajamos juntos por las metas personales de cada quien. Queremos que te sientas cómodo y seguro de que con nosotros podrás salir de tu zona de confort y sacar tu máximo potencial.
    We está conformado actualmente por 2 estudios: Weride y Wehiit.
            </Text>
            <View style={b('about__content__info__studio')}>
              <Image style={b('about__content__info__studio__logo')} source={WeRide} resizeMode='contain' />
            </View>
            <Text style={b('about__content__info__text')}>
              Tribu enfocada al indoor cycling. En las clases de Weride podrás encontrar muchísima energía y diversión; pero sobre todo podrás encontrar coaches comprometidos con motivarte e inspirarte cada segundo.
    La clase consiste en rodar 45 minutos al beat de la música ejercitando mente, cuerpo y alma.
            </Text>
            <View style={b('about__content__info__studio')}>
              <Image style={b('about__content__info__studio__logo')} source={WeHiit} resizeMode='contain' />
            </View>
            <Text style={b('about__content__info__text')}>
              Tribu dedicada al High Intensity Interval Training. Consiste en 50 minutos de clase de tipo circuito que consta de 15 estaciones combinadas entre maquinas cardiovasculares, ejercicios con distintos equipos y con tu propio cuerpo. En Wehiit la intención es elevar tu corazón al 80%-90% alternando con pequeños intervalos de descanso para lograr una alta quema de calorías así como una excelente condición física.
            </Text>
            <Text style={b('about__content__info__title')}>¿Qué necesito para mi clase?</Text>
            <Text style={b('about__content__info__text')}>
              Si vienes a una clase de Weride nosotros te otorgaremos zapatos de tu talla en mostrador para encliparte a la bici.
    Si vienes a Wehiit únicamente asiste con unos tenis cómodos.
    Nosotros te entregamos una toalla limpia para cualquiera de ambas clases.
    Puedes traer tu propia agua, de lo contrario tenemos agua alcalina a la venta y un dispensador de agua para rellenar tu termo.
            </Text>
          </View>
        </ScrollView>
      </LinearGradient>
    )
  }
}


export default hoistNonReactStatics(Terms, Terms);