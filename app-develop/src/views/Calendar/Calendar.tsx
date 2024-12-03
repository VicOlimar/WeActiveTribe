import React, { Component } from 'react';
import moment from 'moment-timezone';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { StatusBar, Text, View } from 'react-native';

import LessonService from './../../services/Lesson';
import StudioService from './../../services/Studio';
import { Lesson } from '../../services/Lesson/Lesson';
import { Studio } from '../../services/Studio/Studio';

// Styles
import bem from 'react-native-bem';
import styles from './Calendar.scss';
import WeekSelection from './components/WeekSelection';
import CalendarBody from './components/CalendarBody';
import Loader from '../../shared/Loader';
import { simpleAlert, confirmAlert } from '../../utils/common';
import { WithStudioContext } from '../../contexts/StudioContext';
import { DefaultStudioContext } from '../../contexts/StudioContext/StudioContext';
import withUserContext from '../../contexts/UserContext/WithUserContext';
import { DefaultUserContext } from '../../contexts/UserContext/UserContext';
import WaitingService, { Waiting } from '../../services/Waiting/Waiting';

type Props = {
  navigation: any,
  studioContext: DefaultStudioContext,
  userContext: DefaultUserContext,
}

type State = {
  lessons: Array<Lesson>,
  studio?: Studio,
  previewNextWeek: boolean,
  loadingLessons: boolean,
}

type Day = {
  name: String,
  surname?: String,
  date: String
}
class Calendar extends Component<Props, State> {
  weekDays = 7;

  state = {
    lessons: [],
    studio: undefined,
    previewNextWeek: false,
    loadingLessons: false,
  }

  componentDidMount() {
    this.props.navigation.addListener('willFocus', (payload) => {
      const { studio: currentStudio } = this.props.studioContext;
      if(!this.state.loadingLessons){
        if (currentStudio === undefined) {
          this.findStudio('we-ride'); // We always load the We Ride studio first
        } else {
          this.findStudio(currentStudio.slug);
        }
      }
    });
  }

  componentWillUpdate(nextProps: Props) {
    const { studioContext: currentStudioProps } = this.props;
    const { studioContext: nextStudioProps } = nextProps;
    if (nextStudioProps && nextStudioProps.studio !== undefined) {
      if (currentStudioProps.studio && !this.state.loadingLessons && nextStudioProps.studio.id !== currentStudioProps.studio.id) {
        this.findStudio(nextStudioProps.studio.slug);
      } else if (this.state.studio && !this.state.loadingLessons && this.state.studio.slug !== currentStudioProps.studio.slug) {
        this.findStudio(currentStudioProps.studio.slug);
      }
    }
  }

  /**
 * Find studio by slug
 * @param slug - <String> Studio slug
 */
  findStudio = async (slug: string) => {
    this.setState({ loadingLessons: true });
    const studio = await StudioService.findOne(slug);
    if (studio) {
      this.setState({ studio });
      this.findLessons(studio!);
    } else {
      this.handleError('Ocurrió un problema al obtener el estudio solicitado');
    }
  }

  /**
 * Find lesson by studio
 * @param studio - <Studio> A Studio
 */
  findLessons = async (studio: Studio) => {
    const { previewNextWeek } = this.state;
    const lessons = await LessonService.find(studio, previewNextWeek);
    if (lessons !== null) {
      this.setState({ lessons });
    } else {
      this.handleError('Ocurrió un problema al obtener las clases del estudio solicitado');
    }
    this.setState({ loadingLessons: false });
  }

  /**
     * Notify an error
     * @param message - <String> Message to notify
     */
  handleError = (message: string) => {
    console.log(message);
  }

  /**
 * Get the interval string for the week
 * @returns String
 */
  getCalendarCurrentWeekInterval = () => {
    const firstWeekDay = this.getWeekFirstDay(true).date();
    const lastWeekDay = this.getWeekLastDay(true).date();
    let month: string = this.capitalize(this.getWeekLastDay().format('MMMM'));

    return `${firstWeekDay} - ${lastWeekDay} de ${month}`;
  }

  /**
 * Get the interval string for the next week
 * @returns String
 */
  getCalendarNextWeekInterval = () => {
    const firstNextWeekDay = this.getNextWeekFirstDay().date();
    const lastNextWeekDay = this.getNextWeekLastDay().date();
    let month: string = this.capitalize(this.getNextWeekLastDay().format('MMMM'));

    return `${firstNextWeekDay} - ${lastNextWeekDay} de ${month}`;
  }

  /**
 * Get the start day of the current week
 * @returns MomentDate
 */
  getWeekFirstDay = (isLabel: boolean = false) => {
    const { previewNextWeek } = this.state;
    return previewNextWeek && !isLabel ? moment().add(this.weekDays, 'days').startOf('day') : moment().startOf('day');
  }

  /**
 * Get the last day of the current week
 * @returns MomentDate
 */
  getWeekLastDay = (isLabel: boolean = false) => {
    const { previewNextWeek } = this.state;
    return previewNextWeek && !isLabel ? moment().add(this.weekDays * 2, 'days').endOf('day') : moment().add(this.weekDays - 1, 'days').endOf('day');
  }

  /**
 * Get the last day of the next week
 * @returns MomentDate
 */
  getNextWeekLastDay = (isLabel: boolean = false) => {
    return moment().add(13, 'days').endOf('day');
  }

  /**
 * Get the start day of the next week
 * @returns MomentDate
 */
  getNextWeekFirstDay = (isLabel: boolean = false) => {
    return moment().add(this.weekDays, 'days').startOf('day');
  }

  /**
 * Capitalize the first word of the string
 * @param word String
 * @returns String
 */
  capitalize = (word: String) => {
    return `${word.charAt(0).toUpperCase()}${word.slice(1)}`;
  }

  /**
 * Function for create the Days Header Array for the Calendar
 * @returns Array<Day> 
 */
  retrieveDays = () => {
    const { studio } = this.state;
    const weekStart = this.getWeekFirstDay();
    const days: Array<Day> = []
    for (let weekDay = 1; weekDay <= this.weekDays; weekDay++) {
      const day: Day = {
        name: this.capitalize(weekStart.format('dddd')),
        date: weekStart.format('DD'),
      }
      if (studio) {
        switch (weekStart.day()) {
          case 0:
            if (studio!.slug === 'we-hiit') {
              day.surname = 'Full Body';
            }
            break;
          case 1:
            if (studio!.slug === 'we-hiit') {
              day.surname = 'Full Body';
            }
            break;
          case 2:
            if (studio!.slug === 'we-hiit') {
              day.surname = 'Upper Body';
            }
            break;
          case 3:
            if (studio!.slug === 'we-hiit') {
              day.surname = 'Lower Body';
            }
            break;
          case 4:
            if (studio!.slug === 'we-hiit') {
              day.surname = 'Upper Body';
            }
            break;
          case 5:
            if (studio!.slug === 'we-hiit') {
              day.surname = 'Lower Body';
            }
            break;
          case 6:
            if (studio!.slug === 'we-hiit') {
              day.surname = 'Cardio';
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
   * Method used to display lessons or if the lesson are loading, display the loader indicator
   */
  displayLessons = () => {
    const { loadingLessons, previewNextWeek, lessons, studio } = this.state;
    const b = (selector) => bem(selector, this.props, styles);

    if (!loadingLessons) {
      return <CalendarBody
        days={this.retrieveDays()}
        onClick={this.handleLessonClick}
        previewNextWeek={previewNextWeek}
        lessons={lessons}
        showDaySurname={studio.slug === 'we-hiit'}
      />;
    } else {
      return <Loader />
    }
  }

  /**
 * Load the current week
 */
  loadCurrentWeek = () => {
    const { studio } = this.props.studioContext;
    if (studio !== undefined) {
      this.setState({ previewNextWeek: false }, () => this.findLessons(studio));
    }
  }

  /**
   * Load next week preview
   */
  loadNextWeekPreview = () => {
    const { studio } = this.props.studioContext;
    this.setState({ previewNextWeek: true }, () => this.findLessons(studio));
  }

  /**
   * Method used like a callback for a lesson click in the calendar
   */
  handleLessonClick = (lesson: Lesson) => {
    const { studio, previewNextWeek } = this.state;
    if (lesson.available === 0) {
      // Create waiting list alert
      confirmAlert(
        "¡Ups! Todos los espacios se encuentran reservados para esta clase",
        "No te preocupes, aún puedes agregarte en la lista de espera y reservar un sitio en caso de cancelación.",
        [{
          text: 'Anotarme',
          onPress: () => this.waitingListRequest(lesson)
        }]
      );
    } else if (studio) {
      if (!previewNextWeek) {
        this.props.navigation.navigate('Lesson', { lesson_id: lesson.id, studio_slug: studio.slug });
      } else {
        simpleAlert("¡Espera!", "Estás visualizando las clases de la siguiente semana, aún no es posible crear una reservación.");
      }
    }
  }

  /**
   * Waiting list request
   */
  waitingListRequest = async (lesson: Lesson) => {
    if (this.props.userContext.profile) {
      this.setState({ loadingLessons: true });
      try {
        const waiting: Waiting = await WaitingService.create(lesson.id);
        simpleAlert("Correcto", "Se te ha añadido a la lista de espera exitosamente. ¡Recuerda estar pendiente de esta reservación!");
      } catch (error) {
        simpleAlert("Ups", error.message);
      }
      this.setState({ loadingLessons: false });
    } else {
      confirmAlert(
        "¡Espera!",
        "Para anotarte a la lista de espera es necesario que inicies sesión.",
        [{
          text: 'Iniciar sesión',
          onPress: () => this.props.navigation('Login')
        }]
      );
    }
  }

  render() {
    const { lessons, loadingLessons } = this.state;
    const b = (selector) => bem(selector, this.props, styles);
    return (
      <View style={b('calendar')}>
        <StatusBar barStyle='light-content' />
        {
          loadingLessons ? <Loader /> : <Grid>
            <Row style={{ height: 60 }}>
              <WeekSelection
                firstDate={this.getCalendarCurrentWeekInterval()}
                secondDate={this.getCalendarNextWeekInterval()}
                previousWeekClick={this.loadCurrentWeek}
                nextWeekClick={this.loadNextWeekPreview}
              />
            </Row>
            <Row>
              <Col>
                {
                  lessons.length > 0 ? this.displayLessons() : <Text style={b('calendar__empty')}>Parece que no tenemos clases esta semana. ¡Prueba visualizando la siguiente!</Text>
                }
              </Col>
            </Row>
          </Grid>
        }
      </View>
    );
  }
}

export default WithStudioContext(withUserContext(Calendar));