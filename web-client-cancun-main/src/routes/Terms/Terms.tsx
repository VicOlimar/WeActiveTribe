import React, { Component, Fragment } from 'react';
import { Col, Container, Row } from 'react-bootstrap';
import Logo from './assets/logo.png';
import './Terms.scss';
import Paragraph from './components/Paragraph';
import {
  PARAGRAPH_1_TEXT,
  PARAGRAPH_2_TEXT,
  PARAGRAPH_3_TEXT,
  PARAGRAPH_4_TITLE,
  PARAGRAPH_4_TEXT,
  PARAGRAPH_5_TITLE,
  PARAGRAPH_5_TEXT,
  PARAGRAPH_6_TEXT,
  PARAGRAPH_6_TITLE,
  PARAGRAPH_7_TITLE,
  PARAGRAPH_7_TEXT,
  PARAGRAPH_8_TITLE,
  PARAGRAPH_8_TEXT,
  PARAGRAPH_9_TITLE,
  PARAGRAPH_9_TEXT,
  PARAGRAPH_10_TITLE,
  PARAGRAPH_10_TEXT,
  PARAGRAPH_11_TITLE,
  PARAGRAPH_11_TEXT,
  PARAGRAPH_12_TITLE,
  PARAGRAPH_12_TEXT,
  PARAGRAPH_13_TITLE,
  PARAGRAPH_13_TEXT,
  PARAGRAPH_14_TITLE,
  PARAGRAPH_14_TEXT,
  PARAGRAPH_15_TITLE,
  PARAGRAPH_15_TEXT,
  PARAGRAPH_16_TITLE,
  PARAGRAPH_16_TEXT,
} from './constants';
import Footer from '../../shared/Footer';
import AppMeta from '../../shared/AppMeta';

class Terms extends Component {
  componentDidMount() {
    window.scrollTo(0, 0);
  }

  render() {
    return (
      <Fragment>
        <AppMeta title='Términos y condiciones' />
        <div className='terms'>
          <Container>
            <Row>
              <Col xs='12'>
                <div className='terms__logo_container'>
                  <img className='terms__logo_container__image' src={Logo} alt='We Cycling logo' />
                </div>
              </Col>
              <Col xs='12'>
                <h1 className='terms__title'>TÉRMINOS DE USO</h1>
              </Col>
            </Row>
            <Row>
              <Col xs='12'>
                <Paragraph text={PARAGRAPH_1_TEXT} />
              </Col>
              <Col xs='12'>
                <Paragraph text={PARAGRAPH_2_TEXT} />
              </Col>
              <Col xs='12'>
                <Paragraph text={PARAGRAPH_3_TEXT} />
              </Col>
              <Col xs='12'>
                <Paragraph title={PARAGRAPH_4_TITLE} text={PARAGRAPH_4_TEXT} />
              </Col>
              <Col xs='12'>
                <Paragraph title={PARAGRAPH_5_TITLE} text={PARAGRAPH_5_TEXT} />
              </Col>
              <Col xs='12'>
                <Paragraph title={PARAGRAPH_6_TITLE} text={PARAGRAPH_6_TEXT} />
              </Col>
              <Col xs='12'>
                <Paragraph title={PARAGRAPH_7_TITLE} text={PARAGRAPH_7_TEXT} />
              </Col>
              <Col xs='12'>
                <Paragraph title={PARAGRAPH_8_TITLE} text={PARAGRAPH_8_TEXT} />
              </Col>
              <Col xs='12'>
                <Paragraph title={PARAGRAPH_9_TITLE} text={PARAGRAPH_9_TEXT} />
              </Col>
              <Col xs='12'>
                <Paragraph title={PARAGRAPH_10_TITLE} text={PARAGRAPH_10_TEXT} />
              </Col>
              <Col xs='12'>
                <Paragraph title={PARAGRAPH_11_TITLE} text={PARAGRAPH_11_TEXT} />
              </Col>
              <Col xs='12'>
                <Paragraph title={PARAGRAPH_12_TITLE} text={PARAGRAPH_12_TEXT} />
              </Col>
              <Col xs='12'>
                <Paragraph title={PARAGRAPH_13_TITLE} text={PARAGRAPH_13_TEXT} />
              </Col>
              <Col xs='12'>
                <Paragraph title={PARAGRAPH_14_TITLE} text={PARAGRAPH_14_TEXT} />
              </Col>
              <Col xs='12'>
                <Paragraph title={PARAGRAPH_15_TITLE} text={PARAGRAPH_15_TEXT} />
              </Col>
              <Col xs='12'>
                <Paragraph title={PARAGRAPH_16_TITLE} text={PARAGRAPH_16_TEXT} />
              </Col>
            </Row>
          </Container>
        </div>
        <Footer />
      </Fragment>
    )
  }
}

export default Terms;