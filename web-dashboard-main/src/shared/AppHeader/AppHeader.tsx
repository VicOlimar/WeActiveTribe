import React from 'react';
import { Col, Row } from 'react-bootstrap';
import './AppHeader.scss';

type Props = {
  leftComponent?: any,
  monthComponent?: any,
  yearComponent?: any,
}
const AppHeader = ({ leftComponent, monthComponent, yearComponent } : Props) => {
  return (
    <Row className='app-header'>
      <Col className="col-md-12 align-self-center">
        <Row>
          <Col className='app-header__left' xs='10'>
            {leftComponent}
          </Col>
          <Col className='app-header__right' xs='1'>
            {monthComponent}
          </Col>
          <Col className='app-header__right' xs='1'>
            {yearComponent}
          </Col>
        </Row>
      </Col>
    </Row>
  )
}

export default AppHeader;