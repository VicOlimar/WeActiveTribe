import React from 'react';
import { Col, Row } from 'react-bootstrap';
import './DaysHeader.scss';

type Day = {
  name: String,
  surname?: String,
  date: String
}

const mdBreakPoint = 768;

const DayColumn = ({ day }: { day: Day }) => {
  let shortName = false;
  if (window.innerWidth <= mdBreakPoint) {
    shortName = true;
  }
  return (
    <Col>
      <div className='days-column'>
        <p className='days-column__title'>{shortName ? day.name[0] : day.name}&nbsp; <span>{day.date}</span></p>
        {
          day.surname && <p className='days-column__surname'>{day.surname.split(' ').length > 1 ? <span>{day.surname.split(' ')[0]}<br/>{day.surname.split(' ')[1]}</span> : day.surname}</p>
        }
      </div>
    </Col>
  )
}

const DaysHeader = ({ days }: { days: Array<Day> }) => {
  return (
    <Row className='days-header' noGutters>
      {days.map((day, index) => <DayColumn key={index} day={day} />)}
    </Row>
  )
}

export default DaysHeader;