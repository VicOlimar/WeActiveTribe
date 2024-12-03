import React from 'react';
import { Col, Row } from 'react-bootstrap';
import './DaysHeader.scss';

type Day = {
  name: String,
  date: String
}

const mdBreakPoint = 768;

const DayColumn = ({ day } : { day : Day }) => {
  let shortName = false;
  if(window.innerWidth <= mdBreakPoint){
    shortName = true;
  }
  return (
    <Col>
      <p className='days-column__title'>{shortName ? day.name[0] : day.name} <span>{day.date}</span></p>
    </Col>
  )
}

const DaysHeader = ({ days }: { days: Array<Day> }) => {
  return (
    <Row className='days-header'>
      {days.map((day, index) => <DayColumn key={index} day={day}/>)}
    </Row>
  )
}

export default DaysHeader;