import React, { Component, Fragment } from 'react';
import StudioService, { Studio } from '../../../../api/Studio/Studio';
import LessonService, { Lesson } from '../../../../api/Lesson/Lesson';
import './LessonPage.scss';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { withUserContext } from '../../../../contexts/UserContext';
import WeRide from './components/WeRide';
import AppMeta from '../../../../shared/AppMeta';
import AppHeader from '../../../../shared/AppHeader';
import LessonHeader from './components/LessonHeader';
import BackgroundRide from './assets/background-ride.jpg';
import BackgroundHiit from './assets/background-hiit.jpg';
import Footer from '../../../../shared/Footer';
import moment from 'moment-timezone';
import { Instructor } from '../../../../api/Instructor/Instructor';
import AuthService, { Me, Profile } from '../../../../api/Auth/Auth';
import CreditSelection from '../../../../shared/CreditSelection';
import PlanService, { Plan } from '../../../../api/Plan/Plan';
import CreditCardModal from '../../../../shared/CreditCardModal';
import CardsService, { Card } from '../../../../api/Cards/CardsService';
import { isUndefined } from 'util';
import { DefaultUserContext } from '../../../../contexts/UserContext/UserContext';
import MessageBackDrop from '../../../../shared/MessageBackDrop';
import ReservationService, { Reservation } from '../../../../api/Reservation/ReservationService';
import { Place } from '../../../../api/Place/Place';
import Loader from '../../../../shared/Loader';
import WeHiit from './components/WeHiit';
import ReactGA from 'react-ga';
import SpecialMessage from './components/SpecialMessage';
import SimpleAlert from '../../../../shared/SimpleAlert';
import { handlePlanPurchase, PlanPurchaseResult } from '../../../../services/PlanPurchaseService';

let TWO_TRIBES_ONE_SOUL_IDS = process.env.REACT_APP_SPECIAL_LESSONS ? process.env.REACT_APP_SPECIAL_LESSONS.split(',') : [];

type FormValues = {
  card: string,
  name: string,
  card_one: string,
  card_two: string,
  card_three: string,
  card_four: string
  month: string,
  year: string,
  cvc: string,
  isDefault: boolean,
}

type Props = RouteComponentProps<any> & {
  userContext: DefaultUserContext,
}

type State = {
  studio?: Studio,
  lesson?: Lesson,
  availablePlaces: { available: Place[], locked: Place[], visible: Place[] },
  showBuyCredits: boolean,
  showCreditCard: boolean,
  showConfirmModal: boolean,
  placeSelected?: Place,
  userData?: Me,
  plans: Plan[],
  plan?: Plan,
  cards: Card[],
  loading: boolean,
  loadingCards: boolean,
  requestingReserve: boolean,
  requestingAvailability: boolean,
  errorMessage?: string,
  showInstructorModal: boolean,
  today: Date,
  goBackPressed: boolean,
  showProfileAlert: boolean,
  instructor?: {
    index: number,
    name: string,
    description: any,
    avatar: string,
  },
  showSpecialMessage: boolean,
  showHiitBuddiesMessage: boolean,
  showRideAndAbsMessage: boolean,
  showSponsoredMessage: boolean,
  showDescription: boolean,
  message: string,
  showMessage: boolean,
}

class LessonPage extends Component<Props, State> {
  DATE_FORMAT = 'D [de] MMMM [-] h:mm A';

  state = {
    lesson: undefined,
    studio: undefined,
    availablePlaces: {
      available: [],
      locked: [],
      visible: [],
    },
    instructor: undefined,
    placeSelected: undefined,
    userData: undefined,
    plans: [],
    cards: [],
    showBuyCredits: false,
    showCreditCard: false,
    showConfirmModal: false,
    plan: undefined,
    loading: false,
    loadingCards: false,
    requestingReserve: false,
    requestingAvailability: true,
    errorMessage: undefined,
    showInstructorModal: false,
    today: new Date(),
    goBackPressed: false,
    showProfileAlert: false,
    showSpecialMessage: false,
    showHiitBuddiesMessage: false,
    showRideAndAbsMessage: false,
    showSponsoredMessage: false,
    showDescription: false,
    message: '',
    showMessage: false,
  }

  componentDidMount() {
    this.getStudio();
    this.getPlans();
  }

  componentDidUpdate(nextProps: Props, nextState: State) {
    const lesson: Lesson | undefined = this.state.lesson;
    if (
      !isUndefined(lesson)
      && !isUndefined(nextState.lesson)
      && ((lesson!.id !== nextState.lesson!.id) || (lesson!.id === nextState.lesson!.id && this.state.goBackPressed))
    ) {
      this.getLesson();
    }
  }

  /**
   * Get the current studio
   */
  getStudio = async () => {
    const { params } = this.props.match;
    if (params.studio) {
      const studio = await StudioService.findOne(params.studio);
      if (studio) {
        this.setState({ studio }, () => this.getLesson());
      }
    } else {
      this.props.history.push('/');
    }
  }

  /**
   * Get the current lesson
   */
  getLesson = async () => {
    const { params } = this.props.match;
    const studio = this.state.studio as Studio | undefined;
    if (params.lesson && studio) {
      const lesson = await LessonService.findOne(studio!, params.lesson);
      if (lesson && lesson.instructors && lesson.instructors.length > 0) {
        const instructor: Instructor = lesson.instructors[0];
        const instructorData = {
          index: 0, // The default instructor
          name: instructor.name,
          description: instructor.description,
          avatar: instructor.avatar,
        }
        this.setState({
          lesson,
          instructor: instructorData,
          showSpecialMessage: false,
          showHiitBuddiesMessage: this.isHiitBuddies(lesson.name),
          showRideAndAbsMessage: this.isRideAndAbs(lesson.name),
          showSponsoredMessage: this.isSponsored(lesson),
          showDescription: this.isDescriptionAvailable(lesson),
          goBackPressed: false
        }, () => {
          this.getAvailables();
        });
      } else {
        this.props.history.push(`/studio/${studio!.slug}`);
      }
    } else {
      this.props.history.push('/');
    }
  }

  /**
   * Get the availables places
   */
  getAvailables = async () => {
    const lesson = this.state.lesson as Lesson | undefined;
    const studio = this.state.studio as Studio | undefined;
    this.setState({ requestingAvailability: true });
    const availablePlaces = await LessonService.getAvailable(studio!, Number(lesson!.id));
    if (!isUndefined(availablePlaces)) {
      this.setState({ availablePlaces, requestingAvailability: false });
    }
  }

  /**
   * Get the business plans
   */
  getPlans = async () => {
    const plans = await PlanService.find();
    if (plans) {
      this.setState({ plans });
    }
  }

  /**
   * Get the user Conekta cards from backend
   */
  getUserCards = async () => {
    this.setState({ loadingCards: true });
    let cards = await CardsService.find();
    if (cards) {
      this.setState({ cards });
    }
    this.setState({ loadingCards: false });
  }

  /**
   * Create the page title
   */
  getPageTitle = () => {
    const lesson: Lesson | undefined = this.state.lesson;
    const studio: Studio | undefined = this.state.studio;
    const instructor: Instructor | undefined = this.state.instructor;
    const starts_at = lesson ? moment(lesson!.starts_at).format(this.DATE_FORMAT) : '';
    return studio && lesson && instructor ? `${studio!.name} - ${instructor!.name} (${starts_at})` : 'Clase';
  }

  /**
   *
   */
  requestCredits = async (place: Place) => {
    const lesson: Lesson | undefined = this.state.lesson;
    const me: Me | undefined = await AuthService.me();
    if (me && lesson) {
      if (me.credits.available === 0 && !lesson!.community) {
        this.handleShowBuyCredits();
        this.setState({ message: 'No cuentas con clases disponibles.', showMessage: true });
      } else {
        this.setState({ showConfirmModal: true, userData: me, placeSelected: place });
      }
    } else {
      this.setState({ message: 'No pudimos consultar tus clases actuales, por favor intenta de nuevo.', showMessage: true });
    }
  }

  /**
   *
   * @param placeNumber - The place number
   */
  onPlaceClick = (place: Place) => {
    let profile: Profile;

    if (this.props.userContext.user && this.props.userContext.user.profile !== undefined) {
      profile = this.props.userContext.profile!;
      if (!profile.birthdate || !profile.emergency_contact || !profile.phone) {
        this.setState({ showProfileAlert: true });
      } else {
        this.requestCredits(place);
      }
    } else {
      document.getElementById('user')!.click();
    }
  }

  /**
   * Callback function for the calender when a plan is clicked
   * @param plan - <Plan> The plan selected
   */
  handlePlanClick = (plan: Plan) => {
    this.getUserCards();
    this.setState({ showCreditCard: true, plan });
  }

  /**
   * Handle the modal accept action
   */
  handleModalAccept = async (values: FormValues, gatewayResponse: any, paypal: any, code: string, { gatewayName, isDefault }: { gatewayName: "stripe" | "conekta" | "paypal", isDefault?: boolean }) => {
    const plan: Plan = this.state.plan!;
    this.setState({ loading: true });

    const result: PlanPurchaseResult = await handlePlanPurchase(plan, values, gatewayResponse, paypal, code, { gatewayName, isDefault });
    
    if (result.success && result.message) {
      this.setState({
        message: result.message,
        showMessage: true,
        errorMessage: undefined,
        showCreditCard: false
      });
    } else {
      this.setState({ errorMessage: result.errorMessage });
    }
    
    this.setState({ loading: false });
  }

  /**
   * Callback function for handle the credit card modal open/close
   */
  handleCreditCardOpen = () => {
    const { showCreditCard } = this.state;
    this.setState({ showCreditCard: !showCreditCard });
  }

  /**
   * Function that show/hide the credit selection component
   */
  handleShowBuyCredits = () => {
    const { showBuyCredits } = this.state;
    this.setState({ showBuyCredits: !showBuyCredits });
  }

  /**
   * Function that show/hide the two tribes one soul message
   */
  handleShowSpecialMessage = () => {
    const { showSpecialMessage } = this.state;
    this.setState({ showSpecialMessage: !showSpecialMessage });
  }

  /**
   * Function that show/hide the hiit buddies message
   */
  handleShowHiitBuddiesMessage = () => {
    const { showHiitBuddiesMessage } = this.state;
    this.setState({ showHiitBuddiesMessage: !showHiitBuddiesMessage });
  }

  /**
   * Function that show/hide the Ride and Abs modal
   */
  handleShowRideAndAbsMessage = () => {
    const { showRideAndAbsMessage } = this.state;
    this.setState({ showRideAndAbsMessage: !showRideAndAbsMessage });
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

  /**
   * Get the payment gateway error message and set to state
   */
  handlePaymentGatewayError = (error: string) => {
    this.setState({ errorMessage: error });
  }

  /**
   * Do the reservation for the lesson
   */
  onReserveLesson = async () => {
    const placeSelected: Place | undefined = this.state.placeSelected;
    const studio: Studio | undefined = this.state.studio;

    const lesson: Lesson | undefined = this.state.lesson;
    if (!isUndefined(lesson) && !isUndefined(placeSelected)) {
      this.setState({ requestingReserve: true });
      const reserve: Reservation | string = await ReservationService.create(lesson!.id, placeSelected!.id);

      if (typeof reserve === 'string') {
        this.setState({ loading: false, message: reserve, showMessage: true });
      } else {
        this.setState({ message: '¡Se ha realizado tu reserva exitosamente!', showMessage: true });
        ReactGA.event({
          category: 'User',
          action: `Nueva reserva en el estudio ${studio!.name}`
        });
        this.getAvailables();
      }
      this.setState({ showConfirmModal: false, requestingReserve: false });
    }
  }

  /**
   * Function for show/hide the confirmation modal
   */
  handleReserveModalOpen = () => {
    const { showConfirmModal } = this.state;
    this.setState({ showConfirmModal: !showConfirmModal });
  }

  /**
   * Function for get the difference in minutes between two dates
   * @param first_date The first date
   * @param second_date The second date
   */
  getDuration(first_date: Date, second_date: Date) {
    return moment(second_date).diff(moment(first_date), 'minutes');
  }

  /**
   * Function used for handle when the user click on the instructor avatar
   */
  handleInstructorClick = () => {
    window.scrollTo(0, 0);
    const { showInstructorModal } = this.state;
    this.setState({ showInstructorModal: !showInstructorModal });
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
   * Handle the next lesson click
   */
  handleNextLesson = async () => {
    const studio: Studio | undefined = this.state.studio;
    const lesson: Lesson | undefined = this.state.lesson;

    if (!isUndefined(studio) && !isUndefined(lesson)) {
      const starts_at = moment(lesson!.starts_at).add(1, 'day').toDate();
      const nextLesson = await LessonService.findNext(studio, starts_at);
      if (isUndefined(nextLesson)) {
        this.setState({ message: 'No se tienen clases para el día siguiente', showMessage: true });
      } else {
        this.setState({ lesson: nextLesson });
        this.props.history.push(`/studio/${studio!.slug}/lesson/${nextLesson!.id}`);
      }
    }
  }

  /**
   * Function used for know if the user can use the next lesson day shorcut
   */
  canSeeNextOption = () => {
    const lesson: Lesson | undefined = this.state.lesson;
    const today = moment(this.state.today);

    if (!isUndefined(lesson)) {
      const lesson_starts = moment(lesson!.starts_at).utc().utcOffset('-05:00');
      return lesson_starts.diff(today, 'days') < 5; // The five is because we not count the current day, so the user can switch 5 days after today
    } else {
      return false;
    }
  }

  /**
   * Handle the go back button clicked
   */
  goBack = () => {
    const studio: Studio | undefined = this.state.studio;
    if (studio) {
      this.props.history.push(`/studio/${studio!.slug}`);
      this.setState({ goBackPressed: true });
    }
  }

  /**
 * Return if a lesson is a Two Tribes One Soul special class
 * @param lesson_id
 */
  isDescriptionAvailable(lesson: Lesson): boolean {
    return lesson.description !== undefined && lesson.description !== null && lesson.description !== "";
  }

  /**
 * Return if a lesson is a Two Tribes One Soul special class
 * @param lesson_id
 */
  isTwoTribesOneSoul(lesson: Lesson) {
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
  isHiitBuddies(lesson_name: String) {
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
    return false;
  }

  /**
   * Return if a lesson is a hiit buddies special class
   * @param lesson_name
   */
  isSponsored = (lesson: Lesson) => {
    const lesson_date = moment(lesson.starts_at).utcOffset('-05:00');
    return lesson_date.date() === 17 && lesson_date.month() === 2; // 17 for March 18th and 2 is for 2 = March in moment
  }

  render() {
    const {
      showBuyCredits,
      showCreditCard,
      showConfirmModal,
      availablePlaces,
      plans,
      plan,
      cards,
      loading,
      loadingCards,
      errorMessage,
      requestingReserve,
      requestingAvailability,
      showInstructorModal,
      showSpecialMessage,
      showHiitBuddiesMessage,
      showRideAndAbsMessage,
      showSponsoredMessage,
      showDescription,
      message,
      showMessage,
    } = this.state;
    const userData: Me | undefined = this.state.userData;
    const lesson: Lesson | undefined = this.state.lesson;
    const studio: Studio | undefined = this.state.studio;
    const instructor: Instructor | undefined = this.state.instructor;
    const placeSelected: Place | undefined = this.state.placeSelected;

    const openDescription = () => {
      const { lesson } = this.state
      if (lesson && this.isTwoTribesOneSoul(lesson!)) {
        this.setState({ showSpecialMessage: true })
      } else {
        this.setState({ showDescription: true });
      }
    }

    let duration = 0;
    if (!isUndefined(lesson)) {
      duration = this.getDuration(lesson!.starts_at, lesson!.ends_at);
    }

    let background = BackgroundRide;

    if (!isUndefined(studio)) {
      background = studio!.slug === 'we-ride' ? BackgroundRide : BackgroundHiit;
    }

    let confirmReserveMessage = '';

    if (lesson && userData) {
      confirmReserveMessage = !lesson!.community ? `Por favor confirma tu reserva, tu nuevo número de clases será de ${userData ? userData!.credits.available - 1 : 'N/A'}` :
        'Está clase es una community class especial, ¡Lo que significa que no requires créditos para reservar!'
    }

    return (
      <div className='lesson_section' style={{ backgroundImage: `url(${background})` }}>
        <AppMeta showSufix={false} title={this.getPageTitle()} />
        <AppHeader
          slug={studio !== undefined ? studio!.slug : ''}
          leftComponent={
            <LessonHeader
              backLink={this.goBack}
              leftText={lesson ? moment(lesson!.starts_at).utc().utcOffset('-05:00').format(this.DATE_FORMAT) : ''}
              nextLink={this.canSeeNextOption() ? this.handleNextLesson : undefined}
            />}
        />
        <div className='inline-flex lesson_section__indications'>
          {
            lesson && ((lesson!.description && !showDescription) || this.isTwoTribesOneSoul(lesson)) && <div className='lesson_section__description'>
              <span className='lesson_section__description-link' onClick={openDescription}>Ver detalle de la clase</span>
            </div>
          }
          <div className='lesson_section__indications__first'>
            <div className={`lesson_section__indications__first__icon lesson_section__indications__first__icon-${studio ? studio!.slug : ''}`}></div>
            <span>Reservado</span>
          </div>
          <div className='lesson_section__indications__second'>
            <div className='lesson_section__indications__second__icon'></div>
            <span>Disponible</span>
          </div>
        </div>
        {
          showBuyCredits && !showSpecialMessage && !showHiitBuddiesMessage && !showRideAndAbsMessage ? <Fragment>
            <CreditCardModal
              onCloseMessage={() => this.setState({ errorMessage: undefined })}
              errorMessage={errorMessage}
              cards={cards}
              show={showCreditCard}
              onClose={this.handleCreditCardOpen}
              onAccept={this.handleModalAccept}
              onPaymentGatewayError={this.handlePaymentGatewayError}
              plan={plan}
              showCardSelector={true}
              confirmButtonText='Comprar clases'
              loadingMessage={loadingCards ? 'Obteniendo tus tarjetas registradas...' : undefined}
              loading={loading || loadingCards}
              showDiscount={true}
            />
            <CreditSelection
              onClose={this.handleShowBuyCredits}
              showClose={true}
              onClick={this.handlePlanClick}
              plans={plans}
              showFooter={false}
              subtitle='¡Ups! Parece que no cuentas con clases disponibles'
              description='Compra el plan que más se acomode a tu ritmo y ¡Prepárate!'
            />
          </Fragment> : showSpecialMessage && !showSponsoredMessage ? <SpecialMessage
            onClose={this.handleShowSpecialMessage}
            showClose={true}
            title='Two Tribes, One Soul'
            subtitle={<p>¡50 minutos de Cardio Intenso!<br />
              25 minutos Weride + 25minutos Wehiit</p>}
            steps={[
              'Reserva tu lugar en Wehiit o Weride',
              'Si reservas primero en Wehiit. Elige tu bici una vez que llegues al estudio y firmes para tu clase de Wehiit. Te entregaremos tus zapatos de bici en ese momento.',
              `Tu clase inicia a las ${lesson ? moment(lesson!.starts_at).utcOffset('-05:00').format('h:m A') : ''} en el estudio que reservaste.`
            ]}
          /> : showHiitBuddiesMessage && !showSponsoredMessage ? <SpecialMessage
            onClose={this.handleShowHiitBuddiesMessage}
            showClose={true}
            title='HIIT BUDDIES'
            subtitle={<p>¿Cómo funciona?</p>}
            steps={[
              'Verás en el mapa del estudio 1 lugar bloqueado de cada estación, el cual separamos para tu Hiit Buddy.',
              'Solo tienes que reservar el lugar de tu preferencia e invitar a un amig@ a entrenar contigo.',
            ]}
          /> : showSponsoredMessage && false ? <SpecialMessage
            onClose={this.handleShowSponsoredMessage}
            showClose={true}
            title='Clase patrocinada por Frappecito'
            subtitle={<p>
              Al reservar en esta clase tendrás un Frappecito gratis en la nueva sucursal de San Ramón Norte. Válido el 18 de Marzo de 6-9PM.
            </p>}
            steps={[]}
          /> : showRideAndAbsMessage && !showSponsoredMessage ? <SpecialMessage
            onClose={this.handleShowRideAndAbsMessage}
            showClose={true}
            title='RIDES + ABS'
            subtitle={<p>¡45 minutos de indoor cycling + 15 minutos de ejercicios de abdomen en el estudio de WeHiit!</p>}
            steps={[]}
          /> : showDescription &&
            !showSpecialMessage &&
            !showSponsoredMessage &&
            !showRideAndAbsMessage &&
            !showHiitBuddiesMessage ? <SpecialMessage
            onClose={this.handleShowDescription}
            showClose={true}
            title={lesson && (lesson!.name || 'Acerca de la clase')}
            subtitle={<p>{lesson && lesson!.description}</p>}
            steps={[]}
          /> :
            <div className='lesson_section__content'>
              <MessageBackDrop
                show={showConfirmModal}
                title={`¡Estás a punto de anotarte en el lugar ${placeSelected ? placeSelected!.location.replace('A', '').replace('B', '') : ''}!`}
                message={confirmReserveMessage}
                buttonText='Confirmar mi reserva'
                buttonAction={this.onReserveLesson}
                loading={requestingReserve}
                onClose={this.handleReserveModalOpen}
              />
              <Loader show={requestingAvailability} />
              {
                !requestingAvailability && <Fragment>
                  {
                    studio && studio!.slug === 'we-ride' && <WeRide
                      places={availablePlaces}
                      name={instructor ? instructor!.name : ''}
                      description={instructor ? instructor!.description : ''}
                      avatar={instructor ? instructor!.avatar : undefined}
                      duration={duration}
                      onClick={this.onPlaceClick}
                      onInstructorClick={this.handleInstructorClick}
                      onSwitchInstructor={lesson !== undefined && lesson!.instructors && lesson!.instructors.length > 1 ? this.handleInstructorSwitch : undefined}
                      showInstructor={showInstructorModal}
                    />
                  }
                  {
                    studio && studio!.slug === 'we-hiit' && <WeHiit
                      places={availablePlaces}
                      name={instructor ? instructor!.name : ''}
                      description={instructor ? instructor!.description : ''}
                      avatar={instructor ? instructor!.avatar : undefined}
                      duration={duration}
                      onClick={this.onPlaceClick}
                      onInstructorClick={this.handleInstructorClick}
                      onSwitchInstructor={lesson !== undefined && lesson!.instructors && lesson!.instructors.length > 1 ? this.handleInstructorSwitch : undefined}
                      showInstructor={showInstructorModal}
                    />
                  }
                </Fragment>
              }
            </div>
        }
        <MessageBackDrop
          show={this.state.showProfileAlert}
          title='¡Espera!'
          message='Hemos notado que aún no completas toda la información de tu perfil, para darte un buen servicio es necesario que la completes antes de poder reservar.'
          buttonText='Completar información'
          buttonAction={() => this.props.history.push('/profile')}
          onClose={() => this.setState({ showProfileAlert: false })}
        />
        <Footer />
        <SimpleAlert title='' text={message} show={showMessage} onConfirm={() => this.setState({ errorMessage: '', showMessage: false })} />
      </div>
    );
  }
}

export default withRouter(withUserContext(LessonPage));
