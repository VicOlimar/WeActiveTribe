import React, { Component, Fragment } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import Logo from './assets/logo.png';
import './Policies.scss';
import Paragraph from './components/Paragraph';
import {
  PARAGRAPH_1_TEXT,
  PARAGRAPH_2_TITLE,
  PARAGRAPH_2_TEXT,
  PARAGRAPH_3_TITLE,
  PARAGRAPH_3_TEXT,
  PARAGRAPH_3_TERMS,
  PARAGRAPH_4_TITLE,
  PARAGRAPH_4_TEXT_1,
  PARAGRAPH_4_TEXT_2,
  PARAGRAPH_4_TEXT_3,
  PARAGRAPH_4_TERMS,
  PARAGRAPH_5_TITLE,
  PARAGRAPH_5_TEXT,
  PARAGRAPH_5_TERMS,
  PARAGRAPH_6_TEXT,
  PARAGRAPH_6_TITLE,
  PARAGRAPH_7_TITLE,
  PARAGRAPH_7_TEXT_1,
  PARAGRAPH_7_TEXT_2,
  PARAGRAPH_8_TITLE,
  PARAGRAPH_8_TEXT_1,
  PARAGRAPH_8_TEXT_2,
} from './constants';
import Footer from '../../shared/Footer';
import AppMeta from '../../shared/AppMeta';

class Policies extends Component {
  
  componentDidMount(){
    window.scrollTo(0, 0);
  }

  render() {
    return (
      <Fragment>
        <AppMeta title='Políticas de privacidad'/>
        <div className='policies'>
          <Container>
            <Row>
              <Col xs='12'>
                <div className='policies__logo_container'>
                  <img className='policies__logo_container__image' src={Logo} alt='We Cycling logo' />
                </div>
              </Col>
              <Col xs='12'>
                <h1 className='policies__title'>AVISO DE PRIVACIDAD</h1>
              </Col>
            </Row>
            <Row>
              <Col xs='12'>
                <Paragraph text={PARAGRAPH_1_TEXT} />
              </Col>
              <Col xs='12'>
                <Paragraph title={PARAGRAPH_2_TITLE} text={PARAGRAPH_2_TEXT} />
              </Col>
              <Col xs='12'>
                <Paragraph title={PARAGRAPH_3_TITLE} text={PARAGRAPH_3_TEXT} terms={PARAGRAPH_3_TERMS} />
              </Col>
              <Col xs='12'>
                <Paragraph title={PARAGRAPH_4_TITLE} text={PARAGRAPH_4_TEXT_1} />
              </Col>
              <Col xs='12'>
                <Paragraph text={PARAGRAPH_4_TEXT_2} />
              </Col>
              <Col xs='12'>
                <Paragraph text={PARAGRAPH_4_TEXT_3} terms={PARAGRAPH_4_TERMS} />
              </Col>
              <Col xs='12'>
                <Paragraph title={PARAGRAPH_5_TITLE} text={PARAGRAPH_5_TEXT} terms={PARAGRAPH_5_TERMS} />
              </Col>
              <Col xs='12'>
                <Paragraph title={PARAGRAPH_6_TITLE} text={PARAGRAPH_6_TEXT} />
              </Col>
              <Col xs='12'>
                <Paragraph title={PARAGRAPH_7_TITLE} text={PARAGRAPH_7_TEXT_1} />
              </Col>
              <Col xs='12'>
                <Paragraph text={PARAGRAPH_7_TEXT_2} />
              </Col>
              <Col xs='12'>
                <Paragraph title={PARAGRAPH_8_TITLE} text={PARAGRAPH_8_TEXT_1} />
              </Col>
              <Col xs='12'>
                <Paragraph text={PARAGRAPH_8_TEXT_2} />
              </Col>
            </Row>
          </Container>
        </div>
        <Footer />
      </Fragment>
    )
  }
}

export default Policies;