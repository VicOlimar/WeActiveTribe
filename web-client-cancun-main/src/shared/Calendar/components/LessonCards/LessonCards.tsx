import React from 'react';
import { Col, Row } from 'react-bootstrap';
import moment from 'moment';
import './LessonCards.scss';
import { Lesson } from '../../../../api/Lesson/Lesson';
import Loader from '../../../Loader';
import { Instructor } from '../../../../api/Instructor/Instructor';
import { isUndefined } from 'util';

let TWO_TRIBES_ONE_SOUL_IDS = process.env.REACT_APP_SPECIAL_LESSONS ? process.env.REACT_APP_SPECIAL_LESSONS.split(',') : [];

type Props = {
  onClick?: Function,
  lessons: Array<Lesson>,
  loading?: boolean,
  selectedInstructor?: Instructor,
  previewNextWeek?: boolean,
}

/**
 * Return the lessons by day in a HashMap
 * @param lessons 
 * @param previewNextWeek 
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
 * Return the max lesson number in a day inside the HasMap
 * @param lessonsMap
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

/**
 * Return the lessons components based in the lesson HasMap
 * @param lessonsMap 
 * @param onClick 
 * @param selectedInstructor 
 */
function displayLessonsByDay(lessonsMap: Map<Number, Array<Lesson>>, onClick?: Function, selectedInstructor?: Instructor) {
  const maxLessons = getMaxLessonsNumber(lessonsMap);
  const rows: Array<Object> = [];

  for (let iteration = 0; iteration < maxLessons; iteration++) {
    let columns: Array<Object> = [];
    lessonsMap.forEach((lessons, date) => {
      columns.push(<LessonColumn key={`${date} - ${lessons.length}`} lesson={lessons[iteration]} onClick={onClick} selectedInstructor={selectedInstructor} />)
    });
    rows.push(<Row key={iteration} className='lesson__card_row' noGutters>
      {columns}
    </Row>)
  }
  return rows;
}

/**
 * Return if a lesson had empty name and is a community class
 * @param lesson 
 */
function isEmptyNameAndCommunity(lesson: Lesson) {
  return (!lesson.name || lesson.name === '' || lesson.name === ' ') && !lesson.community;
}

/**
   * Return if a lesson is a Two Tribes One Soul special class
   * @param lesson_id 
   */
function isTwoTribesOneSoul(lesson: Lesson) {
  let result = -1;
  if (lesson.name) {
    result = lesson.name.toLowerCase().search(/two tribes/);
  }
  return (TWO_TRIBES_ONE_SOUL_IDS.find(id => Number(id) === lesson.id) !== undefined) || (result !== -1);
}

/**
 * Return if a lesson is a hiit buddies special class
 * @param lesson_name 
 */
function isHiitBuddies(lesson_name: String) {
  let result = -1;
  if (lesson_name) {
    result = lesson_name.toLowerCase().search(/hiit buddies/);
  }
  return result !== -1;
}

const LessonColumn = ({ lesson, onClick, selectedInstructor }: { lesson: Lesson, onClick?: Function, selectedInstructor?: Instructor }) => {
  let cardClass = '';
  let instructorsNames: Array<string> = [];
  let isAvailable = false;

  if (lesson && lesson.instructors) {
    cardClass = lesson.available === 0 ? 'lesson__card-not-available' : `lesson__card-normal`;
    instructorsNames = lesson.instructors.map(instructor => instructor.name);
    isAvailable = moment.utc(lesson.ends_at).utcOffset('-05:00') >= moment().utcOffset('-05:00');
  }

  return (
    <Col>
      {
        lesson ? <div className='lesson__card'>
          <div className={`${cardClass} ${isEmptyNameAndCommunity(lesson) ? 'empty' : ''} ${cardClass}-${lesson.studio.slug}`} onClick={onClick && isAvailable ? () => onClick(lesson) : () => { }} style={getCardOpacity(lesson, selectedInstructor)}>
            <div className='lesson__card_container'>
              <p className={`${cardClass}__name text-center`}>{instructorsNames.length > 1 ? instructorsNames.join(' + ') : instructorsNames[0]}</p>
              <p className={`${cardClass}__lessons ${cardClass}__lessons-${lesson.studio.slug} text-center`}>{lesson.available === 0 || lesson.available === undefined ? 'Sin lugares disponibles' : lesson.available <= 5 ? `${lesson.available} ${lesson.available === 1 ? 'Lugar disponible' : 'Lugares disponibles'}` : ''}</p>
              <p className={`${cardClass}__hour text-center`}>{moment(lesson.starts_at).utc().utcOffset('-05:00').format('h:mm A')}</p>
            </div>
          </div>
          {
            lesson.community &&
            (!lesson.name || lesson.name === '') &&
            !isTwoTribesOneSoul(lesson) &&
            !isHiitBuddies(lesson.name) &&
            <div className={`${cardClass}-${lesson.studio.slug}__special_text`}>
              <p>Community class</p>
            </div>
          }
          {
            lesson.name &&
            lesson.name !== '' &&
            lesson.name !== ' ' &&
            !isTwoTribesOneSoul(lesson) &&
            !isHiitBuddies(lesson.name) &&
            !lesson.special &&
            <div className={`${cardClass}-${lesson.studio.slug}__special_text`}>
              <p>{lesson.name}</p>
            </div>
          }
          {
            (isTwoTribesOneSoul(lesson) || isHiitBuddies(lesson.name) || lesson.special) && <div className={`${cardClass}-${lesson.studio.slug}__special_text ${cardClass}-${lesson.studio.slug}__special_text-animated`}>
              <p>{lesson.name}</p>
            </div>
          }
        </div> : ''
      }
    </Col>
  )
}

/**
 * Return the opacity for a lesson card
 * @param lesson 
 * @param selectedInstructor 
 */
function getCardOpacity(lesson: Lesson, selectedInstructor?: Instructor) {
  if (moment.utc(lesson.ends_at).utcOffset('-05:00') < moment().utcOffset('-05:00')) {
    return { opacity: .4 };
  }

  if (isUndefined(selectedInstructor)) {
    return { opacity: 1 };
  } else {
    const foundInstructor = lesson.instructors.find(instructor => instructor.id === selectedInstructor.id);
    return { opacity: foundInstructor !== undefined && selectedInstructor.id === foundInstructor.id ? 1 : .4 }
  }
}

/**
 * Empty lessons component
 */
const EmptyLessons = () => {
  return (
    <div className='lessons-empty'>
      <h4>Parece que no hay clases esta semana, ¡Prueba visualizando la siguiente semana!</h4>
    </div>
  )
}

const LessonCards = ({ lessons, onClick, loading = false, selectedInstructor, previewNextWeek = false }: Props) => {
  const daysLessonsMap = createWeekLessonsArray(lessons, previewNextWeek);
  return (
    <div className='lessons'>
      {
        loading && <Loader show={loading} />
      }
      {
        !loading && lessons.length === 0 && <EmptyLessons />
      }
      {displayLessonsByDay(daysLessonsMap, onClick, selectedInstructor)}
    </div>
  );
}

export default LessonCards;