import React from 'react';
import { Col, Row } from 'react-bootstrap';
import './AppHeader.scss';

type Props = {
  slug?: string,
  leftComponent?: any,
  rightComponent?: any,
}
const AppHeader = ({ slug, leftComponent, rightComponent } : Props) => {
  return (
    <Row className={`app-header app-header-${slug}`}>
      <Col className="col-md-12 align-self-center">
        <Row>
          <Col className='app-header__left' xs='12' md={leftComponent && !rightComponent ? '12' : '6'}>
            {leftComponent}
          </Col>
          <Col className='app-header__right' xs='12' md={rightComponent && !leftComponent ? '12' : '6'}>
            {rightComponent}
          </Col>
        </Row>
      </Col>
    </Row>
  )
}

export default AppHeader;