import React from 'react';
import HeaderDropdown from './components/HeaderDropdown'
import CalendarHeader from '../AppHeader';
import moment from 'moment';
import './Calendar.scss';
import DaysHeader from './components/DaysHeader/DaysHeader';
import LessonCards from './components/LessonCards';
import CreditSelection from '../CreditSelection';
import Divider from '../Divider';
import { Plan } from '../../api/Plan/Plan';
import { Lesson } from '../../api/Lesson/Lesson';
import VerticalLine from '../Line';
import { Instructor } from '../../api/Instructor/Instructor';
import { isUndefined } from 'util';
import { Studio } from '../../api/Studio/Studio';
import { getLabelPlanBystudio } from '../../utils/plan';

type Day = {
  name: String,
  surname?: String,
  date: String
}

type Props = {
  studio?: Studio,
  studios: Studio[],
  lessons: Lesson[],
  plans: Plan[],
  onClick?: Function,
  onPlanClick?: Function,
  loading?: boolean,
  loadingPlans?: boolean,
  instructors?: Instructor[],
  onInstructorClick?: Function,
  selectedInstructor?: Instructor,
  previousWeekClick?: Function,
  nextWeekClick?: Function,
  previewNextWeek?: boolean,
};

const Calendar = ({
  studio,
  studios,
  lessons,
  plans,
  onClick,
  onPlanClick,
  instructors = [],
  loading = false,
  loadingPlans = false,
  onInstructorClick,
  selectedInstructor,
  previousWeekClick,
  nextWeekClick,
  previewNextWeek = false,
}: Props) => {
  instructors = instructors.filter(instructor => {
    const instructorLessons = lessons.filter(lesson => {
      if (lesson.instructors) {
        const foundInstructor = lesson.instructors.find(currentInstructor => currentInstructor.id === instructor.id);
        return foundInstructor !== undefined && foundInstructor.id === instructor.id;
      } else {
        return false;
      }
    });
    return instructorLessons.length > 0;
  });
  const DropDown = <HeaderDropdown emptyLabel='TODOS' dropDownText='Instructores' dropDownItems={instructors} onClick={onInstructorClick} />;

  /**
   * Function for create the Days Header Array for the Calendar
   * @returns Array<Day> 
   */
  function retrieveDays() {
    const weekStart = getWeekFirstDay();
    const weekDays = 7;
    const days: Array<Day> = []
    for (let weekDay = 1; weekDay <= weekDays; weekDay++) {
      const day: Day = {
        name: capitalize(weekStart.format('dddd')),
        date: weekStart.format('DD'),
      }
      if (studio) {
        switch (weekStart.day()) {
          case 0:
            if (studio!.slug === 'we-hiit' || studio!.slug === 'online') {
              day.surname = 'Full Body';
            }
            break;
          case 1:
            if (studio!.slug === 'we-hiit' || studio!.slug === 'online') {
              day.surname = 'Upper Body-Push';
            }
            break;
          case 2:
            if (studio!.slug === 'we-hiit' || studio!.slug === 'online') {
              day.surname = 'Lower Body';
            }
            break;
          case 3:
            if (studio!.slug === 'we-hiit' || studio!.slug === 'online') {
              day.surname = 'Full Body';
            }
            break;
          case 4:
            if (studio!.slug === 'we-hiit' || studio!.slug === 'online') {
              day.surname = 'Upper Body-Pull';
            }
            break;
          case 5:
            if (studio!.slug === 'we-hiit' || studio!.slug === 'online') {
              day.surname = 'Lower Body';
            }
            break;
          case 6:
            if (studio!.slug === 'we-hiit' || studio!.slug === 'online') {
              day.surname = 'Full Body';
            }
            break;
        }
      }
      days.push(day);
      weekStart.add(1, 'days');
    }
    return days;
  }

  /**
   * Get the interval string for the week
   * @returns String
   */
  function getCalendarDatesInterval() {
    const firstWeekDay = getWeekFirstDay(true).date();
    const lastWeekDay = getWeekLastDay(true).date();
    let month: string = capitalize(getWeekLastDay().format('MMMM'));

    return `${firstWeekDay} - ${lastWeekDay} de ${month}`;
  }

  /**
   * Get the interval string for the next week
   * @returns String
   */
  function getCalendarNextDatesInterval() {
    const firstNextWeekDay = getNextWeekFirstDay().date();
    const lastNextWeekDay = getNextWeekLastDay().date();
    let month: string = capitalize(getNextWeekLastDay().format('MMMM'));

    return `${firstNextWeekDay} - ${lastNextWeekDay} de ${month}`;
  }

  /**
   * Capitalize the first word of the string
   * @param word String
   * @returns String
   */
  function capitalize(word: String) {
    return `${word.charAt(0).toUpperCase()}${word.slice(1)}`;
  }

  /**
   * Get the start day of the current week
   * @returns MomentDate
   */
  function getWeekFirstDay(isLabel: boolean = false) {
    return previewNextWeek && !isLabel ? moment().add(7, 'days').startOf('day') : moment().startOf('day');
  }

  /**
   * Get the last day of the current week
   * @returns MomentDate
   */
  function getWeekLastDay(isLabel: boolean = false) {
    return previewNextWeek && !isLabel ? moment().add(14, 'days').endOf('day') : moment().add(6, 'days').endOf('day');
  }

  /**
   * Get the start day of the next week
   * @returns MomentDate
   */
  function getNextWeekFirstDay(isLabel: boolean = false) {
    return moment().add(7, 'days').startOf('day');
  }

  /**
   * Get the last day of the next week
   * @returns MomentDate
   */
  function getNextWeekLastDay(isLabel: boolean = false) {
    return moment().add(13, 'days').endOf('day');
  }

  /**
   * Returns the calendar dates left header
   * @returns ReactComponent
   */
  function getCalendarHeader() {
    return (
      <div className='inline-flex calendar__header'>
        <span onClick={() => { if (!isUndefined(previousWeekClick)) previousWeekClick() }}>{getCalendarDatesInterval()}</span>
        <VerticalLine />
        <span onClick={() => { if (!isUndefined(nextWeekClick)) nextWeekClick() }}>{getCalendarNextDatesInterval()}</span>
      </div>
    )
  }

  let filteredPlans = [];

  if (studio !== undefined && studio!.slug === 'online') {
    filteredPlans = plans.filter((plan: Plan) => plan.credit_type === 'online');
  } else {
    filteredPlans = plans.filter((plan: Plan) => plan.credit_type === 'classic')
      .map((plan: Plan) => ({ ... plan, labelByStudio: getLabelPlanBystudio(plan, studios ) }));
  }

  return (
    <div className='calendar'>
      <CalendarHeader slug={studio ? studio.slug : ''} leftComponent={getCalendarHeader()} rightComponent={instructors.length > 0 ? DropDown : null} />
      <div className='calendar__body'>
        <DaysHeader days={retrieveDays()} />
        <LessonCards lessons={lessons} onClick={onClick} loading={loading} selectedInstructor={selectedInstructor} previewNextWeek={previewNextWeek} />
      </div>
      <Divider className='calendar__divider' />
      <CreditSelection
        title={studio && studio.slug === 'online' ? '¡Compra clases Hiit online!' : 'Comprar clases'}
        description={studio && studio.slug === 'online' ? '¿Estás listo para cumplir tus metas? ¡Bienvenido a nuestra nueva normalidad, We TRAIN online!' : 'Compra el plan que más se acomode a tu ritmo, y ¡Prepárate para no parar!'}
        plans={filteredPlans}
        onClick={onPlanClick}
        loading={loadingPlans}
      />
    </div>
  )
}
export default Calendar;