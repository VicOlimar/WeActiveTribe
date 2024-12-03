import React, { Fragment } from 'react';
import { Row, Col } from 'react-bootstrap';
import Logo from './assets/logo.png';
import Instagram from './assets/instagram.png';
import './Footer.scss';
import Line from '../Line';
import { Link } from 'react-router-dom';

const Footer = ({ className = '', forcedFooterRedirect = false }: { className?: string, forcedFooterRedirect?: boolean }) => {
  return (
    <footer className={`app-footer ${className}`}>
      <Row>
        <Col xs={6} lg={1}>
          <Link to='/'><img src={Logo} className='app-footer__logo' alt='footer logo' /></Link>
        </Col>
        <Col xs={6} lg={1}>
          <a href='https://www.instagram.com/weactivecancun?igsh=ejFvMHRsMXNyNnpr' target='_blank' rel="noopener noreferrer"><img src={Instagram} className='app-footer__instagram' alt='instagram logo' /></a>
        </Col>
        <Col xs={12} lg={9}>
          <div className='app-footer__info'>
            {
              !forcedFooterRedirect ? <Fragment>
                <Link to='/policies' className={'app-footer__info__link'}>Pol&iacute;tica de Privacidad</Link>
                <Line containerClassName='app-footer__line' lineClassName='app-footer__line-gray' />
                <Link to='/terms' className='app-footer__info__link'>T&eacute;rminos y Condiciones</Link>
                <Line containerClassName='app-footer__line' lineClassName='app-footer__line-gray' />
                <Link to='/about' className='app-footer__info__link'>¿Qué es We Active Tribe?</Link>
              </Fragment> : <Fragment>
                  <a href='/policies' className={'app-footer__info__link'}>Pol&iacute;tica de Privacidad</a>
                  <Line containerClassName='app-footer__line' lineClassName='app-footer__line-gray' />
                  <a href='/terms' className='app-footer__info__link'>T&eacute;rminos y Condiciones</a>
                  <Line containerClassName='app-footer__line' lineClassName='app-footer__line-gray' />
                  <a href='/about' className='app-footer__info__link'>¿Qué es We Active Tribe?</a>
                </Fragment>
            }
          </div>
        </Col>
      </Row>
    </footer>
  )
}

export default Footer;