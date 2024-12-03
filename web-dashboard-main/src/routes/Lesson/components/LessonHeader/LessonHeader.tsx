import React from 'react';
import { Row, Col } from 'react-bootstrap';
import Back from './../../assets/back.png';
import './LessonHeader.scss';
import { Link } from 'react-router-dom';

type Props = { backLink?: string | Function, leftText?: string, nextLink?: Function }
const LessonHeader = ({ backLink = "", leftText = "", nextLink }: Props) => {
  return (
    <div className='lesson_header'>
      <Row>
        <Col className='lesson_header-desktop'>
          <div className='lesson_header__left_side'>
            {
              backLink && <Link to={typeof backLink === 'function' ? '#' : backLink} onClick={() => { if (typeof backLink === 'function') backLink() }} className={'lesson_header__left_side__link'}>
                <img src={Back} className='lesson_header__left_side__back' alt='back' />
                <span className='lesson_header__left_side__back_text'>Regresar</span>
              </Link>
            }
            <span className='lesson_header__left_side__next_text'>{leftText}</span>
          </div>
        </Col>
        <Col className='lesson_header-mobile' sm={'12'} md={'6'}>
          <span className='lesson_header__left_side__next_text-mobile'>{leftText}</span>
        </Col>
      </Row>
    </div>
  )
}

export default LessonHeader;