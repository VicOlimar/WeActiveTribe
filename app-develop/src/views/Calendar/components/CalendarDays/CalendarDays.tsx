import React, { Component } from 'react';
import { View, Text } from 'react-native';
import { Col, Row, Grid } from 'react-native-easy-grid';

import bem from 'react-native-bem';
import styles from './CalendarDays.scss';

export type Day = {
    name: String,
    surname?: String,
    date: String
}

type Props = {
    days: Array<Day>
}

const CalendarDays = (props: Props) => {
    const b = (selector) => bem(selector, props, styles);
    return (
        <Row>
            {
                props.days.map((day: Day) => <Col key={String(day.date)} style={b('calendar-days__column')}>
                    <Text style={b('calendar-days__column__text')}>{day.name} {day.date}</Text>
                    {
                        day.surname && <Text style={b('calendar-days__column__lesson_type')}>{day.surname}</Text>
                    }
                </Col>)
            }

        </Row>
    );
}

export default CalendarDays;