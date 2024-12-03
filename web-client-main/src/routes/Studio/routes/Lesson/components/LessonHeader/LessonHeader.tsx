import React from 'react';
import { Row, Col } from 'react-bootstrap';
import Back from './../../assets/back.png';
import Next from './../../assets/next.png';
import './LessonHeader.scss';
import VerticalLine from '../../../../../../shared/Line/Line';
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
            <VerticalLine containerClassName={'lesson_header-line'}/>
            <span className='lesson_header__left_side__next_text'>{leftText}</span>
          </div>
        </Col>
        <Col>
          <div className='lesson_header__right_side'>
            {
              nextLink && <Link to={'#'} onClick={() => { if (nextLink) nextLink() }} className={'lesson_header__right_side__link'}>
                <span className='lesson_header__right_side__next_text'>Siguiente día</span>
                <img src={Next} className='lesson_header__right_side__next' alt='next' />
              </Link>
            }
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