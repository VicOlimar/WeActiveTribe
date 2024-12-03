import React, { Component, Fragment } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import Logo from './assets/logo.png';
import './About.scss';
import Footer from '../../shared/Footer';
import AppMeta from '../../shared/AppMeta';
import WE_RIDE from './assets/we-ride.png';
import WE_HIIT from './assets/we-train.png';

class About extends Component {

  componentDidMount() {
    window.scrollTo(0, 0);
  }

  render() {
    return (
      <Fragment>
        <AppMeta title='Políticas de privacidad' />
        <div className='about'>
          <Container>
            <Row>
              <Col xs='12'>
                <div className='about__logo_container'>
                  <img className='about__logo_container__image' src={Logo} alt='We Cycling logo' />
                </div>
              </Col>
              <Col xs='12'>
                <h1 className='about__title'>¿Qué es We Active Tribe?</h1>
              </Col>
            </Row>
            <Row>
              <Col xs='12'>
                <p className='about__text about__text-white'>
                  El nombre We nace de esa fiel creencia que para avanzar y superarnos de manera personal, es primordial el trabajo en equipo.
  We es una tribu conformada por socios accionistas, coaches, staff, riders, agencia de publicidad, entre muchos otros.
  En We trabajamos juntos por las metas personales de cada quien. Queremos que te sientas cómodo y seguro de que con nosotros podrás salir de tu zona de confort y sacar tu máximo potencial.
  We está conformado actualmente por 2 estudios: Weride y Wetrain.
                </p>
              </Col>
              <Col xs='12' lg='6'>
                <div className='about__studio_container'>
                  <img src={WE_RIDE} className='about__studio_container__logo' alt='we ride logo'/>
                </div>
                <p className='about__text about__text-white'>
                  Tribu enfocada al indoor cycling. En las clases de Weride podrás encontrar muchísima energía y diversión; pero sobre todo podrás encontrar coaches comprometidos con motivarte e inspirarte cada segundo.
  La clase consiste en rodar 45 minutos al beat de la música ejercitando mente, cuerpo y alma.
                </p>
              </Col>
              <Col xs='12' lg='6'>
                <div className='about__studio_container'>
                  <img src={WE_HIIT} className='about__studio_container__logo' alt='we hiit logo'/>
                </div>
                <p className='about__text about__text-white'>
                Tribu dedicada al entrenamiento funcional enfocado en trabajar
                  fuerza y rendimiento corporal utilizando diferentes pesos y
                  materiales. Cada día trabajamos músculos específicos del
                  cuerpo para un entrenamiento semanal completo que de cómo
                  resultado crecimiento y resistencia muscular.
                </p>
              </Col>
              <Col xs='12'>
                <h1 className='about__subtitle'>¿Qué necesito para mi clase?</h1>
                <p className='about__text about__text-white'>
                  Si vienes a una clase de Weride nosotros te otorgaremos zapatos de tu talla en mostrador para encliparte a la bici.
  Si vienes a Wetrain únicamente asiste con unos tenis cómodos.
  Nosotros te entregamos una toalla limpia para cualquiera de ambas clases.
  Puedes traer tu propia agua, de lo contrario tenemos agua alcalina a la venta y un dispensador de agua para rellenar tu termo.
                </p>
              </Col>
            </Row>
          </Container>
        </div>
        <Footer />
      </Fragment>
    )
  }
}

export default About;