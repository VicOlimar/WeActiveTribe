import React from 'react';
import { View, Text, SafeAreaView, ScrollView } from 'react-native';
import { Col, Row, Grid } from 'react-native-easy-grid';
import moment from 'moment-timezone';

import bem from 'react-native-bem';
import styles from './CalendarBody.scss';
import CalendarDays from '../CalendarDays';
import { Day } from '../CalendarDays/CalendarDays';
import Divider from '../../../../shared/Divider';
import { Lesson } from '../../../../services/Lesson/Lesson';
import LessonCard from './components/LessonCard';
import { Instructor } from '../../../../services/Instructor/Instructor';
import { isSmallDevice } from '../../../../utils/common';

type Props = {
  days: Array<Day>,
  lessons: Array<Lesson>,
  previewNextWeek?: boolean,
  showDaySurname: boolean,
  onClick?: Function,
}

const CalendarBody = (props: Props) => {
  // BEM transform
  const b = (selector) => bem(selector, props, styles);
  // Lessons by day HasMap
  const daysLessonsMap = createWeekLessonsArray(props.lessons, props.previewNextWeek);

  /**
   * Function used to split lesson array and set to a HasMap where the key is the Date of the week
   * @param lessons Lessons Array
   * @param previewNextWeek Boolean that indicates if is a preview of the next week
   */
  function createWeekLessonsArray(lessons: Array<Lesson>, previewNextWeek: boolean = false) {
    const weekStart = previewNextWeek ? moment().add(1, 'week').startOf('day') : moment().startOf('day');
    const weekDays = 7;
    var lessonsMap = new Map();

    for (let weekDay = 1; weekDay <= weekDays; weekDay++) {

      const dayLessons = lessons.filter(lesson => {
        return new Date(lesson.starts_at).getDate() === weekStart.date();
      });
      lessonsMap.set(weekStart.date(), dayLessons);
      weekStart.add(1, 'days');
    }
    return lessonsMap;
  }

  /**
  * Function used to create the Calendar layout based in the Lessons HasMap
  * @param lessonsMap The lessons by day HasMap
  * @param onClick The click callback
  * @param selectedInstructor The instructor selected (For filter)
  */
  function displayLessonsByDay(lessonsMap: Map<Number, Array<Lesson>>, onClick?: Function, selectedInstructor?: Instructor) {
    let columns: Array<Object> = [];
    lessonsMap.forEach((lessons, date) => {
      columns.push(<Col key={`${date} - ${lessons.length}`} >
        <ScrollView>
          {
            lessons.length > 0 ? lessons.map(lesson => <LessonCard key={lesson.id} lesson={lesson} onClick={onClick} />) :
              <LessonCard lesson={undefined} />
          }
        </ScrollView>
      </Col>)
    });
    return <Row>
      {columns}
    </Row>;
  }

  /**
   * Function used to get the max number of lessons on a Day
   * @param lessonsMap Lessons HasMap
   */
  function getMaxLessonsNumber(lessonsMap: Map<Number, Array<Lesson>>) {
    let maxLessons = 0;
    lessonsMap.forEach((lessons, date) => {
      if (lessons.length > maxLessons) {
        maxLessons = lessons.length;
      }
    });
    return maxLessons;
  }

  return (
    <SafeAreaView style={b('calendar-body')}>
      <Divider />
      <ScrollView
        style={b('calendar-body__container')}
        horizontal={true}>
        <Grid>
          <Row style={{ height: props.showDaySurname ? 85 : 65 }}>
            <Col>
              <CalendarDays days={props.days} />
            </Col>
          </Row>
          <Row>
            <Grid>
              {displayLessonsByDay(daysLessonsMap, props.onClick)}
            </Grid>
          </Row>
        </Grid>
      </ScrollView>
    </SafeAreaView>
  );
}

export default CalendarBody;