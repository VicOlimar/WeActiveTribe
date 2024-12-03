import React, { Component } from 'react';
import moment from 'moment-timezone';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { View, StatusBar, TouchableOpacity, Dimensions, Text } from 'react-native';
import ReactNativeZoomableView from '@dudigital/react-native-zoomable-view/src/ReactNativeZoomableView';
import hoistNonReactStatics from 'hoist-non-react-statics';

import { Lesson } from '../../services/Lesson/Lesson';

// Styles
import bem from 'react-native-bem';
import styles from './Lesson.scss';

import WeekSelection from '../Calendar/components/WeekSelection';
import Divider from '../../shared/Divider';
import WeHiit from './components/WeHiit';
import { Place } from '../../services/Place/Place';
import { Instructor } from '../../services/Instructor/Instructor';
import LessonService from '../../services/Lesson';
import StudioService from '../../services/Studio';
import Loader from '../../shared/Loader';
import InstructorAvatar from './components/InstructorAvatar/InstructorAvatar';
import { Studio } from '../../services/Studio/Studio';
import WeRide from './components/WeRide/WeRide';
import withUserContext from '../../contexts/UserContext/WithUserContext';
import { DefaultUserContext } from '../../contexts/UserContext/UserContext';
import AuthService, { Profile, Me } from '../../services/Auth/Auth';
import ReservationService from '../../services/Reservation';
import { confirmAlert, simpleAlert } from '../../utils/common';
import { Reservation } from '../../services/Reservation/Reservation';
import { ScrollView } from 'react-native-gesture-handler';
import SpecialMessageModal from './components/SpecialMessageModal';

// Var used to get from the env the special lessons
let TWO_TRIBES_ONE_SOUL_IDS = [];

type Props = {
  navigation: any;
  userContext: DefaultUserContext;
}

type State = {
  studio?: Studio;
  lesson?: Lesson;
  availablePlaces: {
    available: Place[];
    locked: Place[];
  };
  loading: boolean;
  instructor?: {
    index: number;
    name: string;
    description: string;
    avatar: string;
  };
  requestingAvailability: Boolean;
  showHiitBudiesModal: boolean;
  showTwoTribesModal: boolean;
  showRideAndAbs: boolean;
  showSponsoredMessage: boolean;
  showDescription: boolean;
}

class LessonScreen extends Component<Props, State> {
  weekDays = 7;
  state = {
    studio: undefined,
    lesson: undefined,
    availablePlaces: {
      available: [],
      locked: [],
    },
    instructor: undefined,
    loading: false,
    requestingAvailability: false,
    showHiitBudiesModal: false,
    showTwoTribesModal: false,
    showRideAndAbs: false,
    showSponsoredMessage: false,
    showDescription: false
  }

  componentDidMount() {
    this.getStudio();
  }

  /**
   * Functio to get the studio from navigation, if the studio is not defined return to the calendar
   */
  getStudio = async () => {
    const studioSlug = this.props.navigation.getParam('studio_slug', undefined);
    if (studioSlug === undefined) {
      this.props.navigation.goBack();
    }
    const studio = await StudioService.findOne(studioSlug);
    this.setState({ studio, loading: true }, () => this.getLesson());
  }

  /**
   * Function to get the lesson from navigation, if the lesson is not defined return to the calendar
   */
  getLesson = async () => {
    const { studio } = this.state;
    const lesson_id = this.props.navigation.getParam('lesson_id', undefined);
    if (lesson_id === undefined) {
      this.props.navigation.goBack();
    }
    const lesson = await LessonService.findOne(studio, lesson_id);
    this.setState({
      lesson,
      showTwoTribesModal: false,
      showHiitBudiesModal: this.isHiitBuddies(lesson.name),
      showRideAndAbs: this.isRideAndAbs(lesson.name),
      showSponsoredMessage: this.isSponsored(lesson),
      showDescription: this.isDescriptionAvailable(lesson),
    }, () => this.getInstructor(lesson));
  }

  /**
   * Get the first instructor from the instructors array in the lesson
   */
  getInstructor = (lesson: Lesson) => {
    const instructor: Instructor = lesson.instructors[0];
    const instructorData = {
      index: 0, // The default instructor
      name: instructor.name,
      description: instructor.description,
      avatar: instructor.avatar,
    }
    this.setState({ lesson, instructor: instructorData, loading: false }, () => {
      this.getAvailablesPlaces();
    });
  }

  /**
  * Return if a lesson is a Two Tribes One Soul special class
  * @param lesson_id 
  */
  isDescriptionAvailable(lesson: Lesson): boolean {
    const { description } = lesson;
    return description !== undefined && description !== null && description.trim() !== "";
  }

  /**
   * Return if a lesson is a Two Tribes One Soul special class
   * @param lesson_id 
   */
  isTwoTribesOneSoul = (lesson: Lesson) => {
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
  isHiitBuddies = (lesson_name: String) => {
    let result = -1;
    if (lesson_name) {
      result = lesson_name.toLowerCase().search(/hiit buddies/);
    }
    return result !== -1;
  }

  /**
   * Return if a lesson is a hiit buddies special class
   * @param lesson_name 
   */
  isRideAndAbs = (lesson_name: String) => {
    let result = -1;
    if (lesson_name) {
      result = lesson_name.toLowerCase().search(/ride \+ abs/);
    }
    return result !== -1;
  }

  /**
   * Return if a lesson is a hiit buddies special class
   * @param lesson_name 
   */
  isSponsored = (lesson: Lesson) => {
    const lesson_date = moment(lesson.starts_at).tz('America/Merida');
    return lesson_date.date() === 17 && lesson_date.month() === 2 && lesson_date.year() === 2020; // 17 for March 18th and 2 is for 2 = March in moment
  }

  /**
   * Function to change the current instructor information to the next instructor
   */
  handleInstructorSwitch = () => {
    const lesson = this.state.lesson as Lesson | undefined;
    const currentInstructor = this.state.instructor as any;
    if (currentInstructor && lesson) {
      let index = 0;
      if (currentInstructor.index < lesson.instructors.length - 1) {
        index = currentInstructor.index + 1;
      } else if (currentInstructor.index === lesson.instructors.length - 1) {
        index = 0;
      }
      const nextInstructor = lesson.instructors[index];
      let instructor: any = {
        index: index,
        name: nextInstructor.name,
        description: nextInstructor.description,
        avatar: nextInstructor.avatar,
      };
      this.setState({ instructor });
    }
  }

  /**
   * Get the availables places
   */
  getAvailablesPlaces = async () => {
    const { lesson, studio } = this.state;
    this.setState({ requestingAvailability: true });
    const availablePlaces = await LessonService.getAvailable(studio, Number(lesson.id));
    if (availablePlaces !== undefined) {
      this.setState({ availablePlaces, requestingAvailability: false });
    }
  }

  /**
   * Return the lesson start date like a label
   */
  getLessonDateLabel = () => {
    const { lesson } = this.state;
    const date = moment(lesson.starts_at).tz('America/Merida');
    return `${date.format('D [de]')} ${this.capitalize(date.format('MMMM'))} \n ${date.format('h:m a')}`;
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
   * Back action for lesson date
   */
  goBack = () => {
    this.props.navigation.goBack();
  }

  /**
   * Handle the reserve action
   */
  handleReserve = (place: Place) => {
    const { userContext } = this.props;
    if (userContext && userContext.user) {
      this.validateUserProfileCompleted(place);
    } else {
      this.props.navigation.navigate('Login');
    }
  }

  /**
   * 
   */
  requestCredits = async (place: Place) => {
    const lesson: Lesson | undefined = this.state.lesson;
    let me: Me | undefined = await AuthService.me();

    try {
      me = await AuthService.me();
    } catch (error) {
      me = undefined;
    }

    if (me && lesson) {
      if (me.credits.available === 0 && !lesson!.community) {
        confirmAlert(
          '¡Espera!',
          'No cuentas con clases disponibles',
          [{
            text: 'Comprar',
            onPress: () => this.props.navigation.navigate('Plans')
          }]
        );
      } else {
        confirmAlert(
          '¡Ya casi!',
          `Estás a punto de anotarte en el lugar ${place.location.replace('A', '').replace('B', '')}, ¿Confirmas tu reserva?`,
          [{
            text: 'Confirmar',
            style: 'default',
            onPress: () => this.reserveLesson(place)
          }]
        );
      }
    } else {
      simpleAlert(
        '¡Ups!',
        `No pudimos consultar tus clases actuales, por favor intenta de nuevo.`
      );
    }
  }

  /**
   * Validate the user profile information completed
   */
  validateUserProfileCompleted = (place: Place) => {
    const { userContext } = this.props;
    const profile: Profile = userContext.profile!;
    if (!profile.birthdate || !profile.emergency_contact || !profile.phone) {
      confirmAlert(
        '¡Espera!',
        'Hemos notado que aún no completas toda la información de tu perfil, para darte un buen servicio es necesario que la completes antes de poder reservar.',
        [{
          text: 'Completar',
          onPress: () => this.props.navigation.navigate('EditProfile')
        }]
      );
    } else {
      this.requestCredits(place);
    }
  }

  /**
   * Do the reservation for the lesson
   */
  reserveLesson = async (place: Place) => {
    const lesson: Lesson | undefined = this.state.lesson;
    if (lesson) {
      try {
        this.changeLoadingState();
        const reserve: Reservation | string = await ReservationService.create(lesson!.id, place.id);
        this.changeLoadingState();
        simpleAlert('LISTO', '¡Se ha realizado tu reserva exitosamente!');
        this.getAvailablesPlaces();
      } catch (err) {
        simpleAlert('Ups', err.message);
        this.changeLoadingState();
      }
    }
  }

  /**
   * Go to Instructor view
   */
  handleClick = () => {
    const { instructor } = this.state;
    this.props.navigation.navigate('Instructor', { instructor: instructor })
  }

  /**
   * 
   */
  changeLoadingState = () => {
    const { loading } = this.state;
    this.setState({ loading: !loading });
  }

  /**
   * Function that show/hide the hiit budies modal
   */
  handleShowHiitBudiesModal = () => {
    const { showHiitBudiesModal } = this.state;
    this.setState({ showHiitBudiesModal: !showHiitBudiesModal });
  }

  /**
   * Function that show/hide the hiit budies modal
   */
  handleShowTwoTribesModal = () => {
    const { showTwoTribesModal } = this.state;
    this.setState({ showTwoTribesModal: !showTwoTribesModal });
  }

  /**
   * Function that show/hide the Ride and Abs modal
   */
  handleShowRideAndAbs = () => {
    const { showRideAndAbs } = this.state;
    this.setState({ showRideAndAbs: !showRideAndAbs });
  }

  /**
   * Function that show/hide the Ride and Abs modal
   */
  handleShowSponsoredMessage = () => {
    const { showSponsoredMessage } = this.state;
    this.setState({ showSponsoredMessage: !showSponsoredMessage });
  }

  /**
   * Function that show/hide the Ride and Abs modal
   */
  handleShowDescription = () => {
    const { showDescription } = this.state;
    this.setState({ showDescription: !showDescription });
  }

  render() {
    const {
      loading,
      lesson,
      studio,
      availablePlaces,
      instructor,
      requestingAvailability,
      showHiitBudiesModal,
      showTwoTribesModal,
      showRideAndAbs,
      showSponsoredMessage,
      showDescription,
    } = this.state;
    const b = (selector) => bem(selector, this.props, styles);
    const lessonHeightContainer = Dimensions.get('window').height - (Dimensions.get('window').height * .2);
    const openDescriptionModal = () => {
      if (lesson && this.isTwoTribesOneSoul(lesson)) {
        this.setState({ showTwoTribesModal: true });
      } else {
        this.setState({ showDescription: true });
      }
    }
    const studioProps = {
      places: availablePlaces,
      name: instructor ? instructor!.name : '',
      description: instructor ? instructor!.description : '',
      onClick: this.handleReserve,
    }

    return (
      <ScrollView style={b('lesson')}>
        <StatusBar barStyle='light-content' />
        {
          lesson && instructor && !loading && !requestingAvailability ? <Grid style={b('lesson__main_container')}>
            <Row style={{ height: 80 }}>
              <Col>
                <WeekSelection
                  size='normal'
                  backAction={this.goBack}
                  rightAction={lesson.instructors.length > 1 ? this.handleInstructorSwitch : undefined}
                  firstDate={this.getLessonDateLabel()}
                />
                <Divider />
              </Col>
            </Row>
            <Row>
              <Grid>
                {
                  lesson &&
                  ((lesson!.description !== null &&
                    lesson!.description !== undefined &&
                    lesson!.description.trim() !== '') || this.isTwoTribesOneSoul(lesson)) &&
                  < Row >
                    <Col>
                      <Text
                        style={b('lesson__see_description')}
                        onPress={openDescriptionModal}>
                        Ver detalle de la clase
                        </Text>
                    </Col>
                  </Row>
                }
                <Row style={{ height: 200 }}>
                  <Col>
                    <TouchableOpacity onPress={this.handleClick}>
                      <InstructorAvatar instructor={instructor} />
                    </TouchableOpacity>
                  </Col>
                </Row>
                <Row>
                  <Col>
                    <ReactNativeZoomableView
                      maxZoom={1.5}
                      minZoom={1}
                      zoomStep={0.5}
                      initialZoom={1}
                      bindToBorders={true}
                    >
                      {studio.slug === 'we-hiit' ? <WeHiit {...studioProps} /> : <WeRide {...studioProps} />}
                    </ReactNativeZoomableView>
                  </Col>
                </Row>
              </Grid>
            </Row>
            {
              showHiitBudiesModal && !showSponsoredMessage && <SpecialMessageModal
                title={'HIIT BUDDIES'}
                subtitle={'¿Cómo funciona?'}
                visible={showHiitBudiesModal}
                onClose={this.handleShowHiitBudiesModal}
                steps={[
                  '1.- Verás en el mapa del estudio 1 lugar bloqueado de cada estación, el cual separamos para tu Hiit Buddy.',
                  '2.- Solo tienes que reservar el lugar de tu preferencia e invitar a un amig@ a entrenar contigo.',
                ]}
              />
            }

            {
              showTwoTribesModal && !showSponsoredMessage && <SpecialMessageModal
                title={'Two Tribes, One Soul'}
                subtitle={'¡50 minutos de Cardio Intenso!'}
                thirdTitle={'25 minutos Weride + 25minutos Wehiit'}
                visible={showTwoTribesModal}
                onClose={this.handleShowTwoTribesModal}
                steps={[
                  '1.- Reserva tu lugar en Wehiit o Weride',
                  '2.- Si reservas primero en Wehiit. Elige tu bici una vez que llegues al estudio y firmes para tu clase de Wehiit. Te entregaremos tus zapatos de bici en ese momento.',
                  `3.- Tu clase inicia a las ${lesson ? moment(lesson!.starts_at).tz('America/Merida').format('h:m A') : ''} en el estudio que reservaste.`
                ]}
              />
            }

            {
              showRideAndAbs && !showSponsoredMessage && <SpecialMessageModal
                title={'RIDE + ABS'}
                subtitle={'¡45 minutos de indoor cycling + 15 minutos de ejercicios de abdomen en el estudio de WeHiit!'}
                visible={showRideAndAbs}
                onClose={this.handleShowRideAndAbs}
                steps={[]}
              />
            }

            {
              showSponsoredMessage && <SpecialMessageModal
                title={'Clase patrocinada por Frappecito'}
                subtitle={'Al reservar en esta clase tendrás un Frappecito gratis en la nueva sucursal de San Ramón Norte. Válido el 18 de Marzo de 6-9PM.'}
                visible={showSponsoredMessage}
                onClose={this.handleShowSponsoredMessage}
                steps={[]}
              />
            }

            {
              showDescription &&
              !showTwoTribesModal &&
              !showSponsoredMessage &&
              !showRideAndAbs &&
              !showHiitBudiesModal &&
              <SpecialMessageModal
                visible={showDescription}
                onClose={this.handleShowDescription}
                title={lesson && (lesson!.name || 'Acerca de la clase')}
                subtitle={lesson && lesson!.description}
                steps={[]}
              />
            }

          </Grid> : <View style={{ height: lessonHeightContainer }}>
            <Loader />
          </View>
        }
      </ScrollView>
    );
  }
}

export default hoistNonReactStatics(withUserContext(LessonScreen), LessonScreen);