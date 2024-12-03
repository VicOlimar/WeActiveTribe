import React, { Fragment } from 'react';
import './Studio.scss';
import { Plan, default as PlanService, PlanPurcharseResponse } from '../../api/Plan/Plan';
import { Studio as StudioClass, default as StudioService } from './../../api/Studio/Studio';
import Calendar from '../../shared/Calendar';
import { Lesson, default as LessonService } from '../../api/Lesson/Lesson';
import AppMeta from './../../shared/AppMeta';
import CreditCardModal from './../../shared/CreditCardModal';
import { match, withRouter, RouteComponentProps } from 'react-router-dom';
import MessageBackDrop from '../../shared/MessageBackDrop';
import WaitingService from '../../api/Waiting';
import { Waiting } from '../../api/Waiting/Waiting';
import { withUserContext } from '../../contexts/UserContext';
import { DefaultUserContext } from '../../contexts/UserContext/UserContext';
import { isUndefined, isNull } from 'util';
import CardsService from '../../api/Cards';
import { Card } from '../../api/Cards/CardsService';
import { Instructor } from '../../api/Instructor/Instructor';
import InstructorService from '../../api/Instructor';
import ReactGA from 'react-ga';
import SimpleAlert from '../../shared/SimpleAlert';
import { Place } from '../../api/Place/Place';
import AuthService, { Me } from '../../api/Auth/Auth';
import ReservationService, { Reservation } from '../../api/Reservation/ReservationService';

type UrlParams = {
  studio: string,
}


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

type State = {
  studio?: StudioClass,
  lessons: Lesson[],
  plans: Plan[],
  plan: Plan | null,
  showCreditCard: boolean,
  showBackDrop: boolean,
  showReserveBackDrop: boolean,
  showBuyCredits: boolean,
  loadingLessons: boolean,
  loadingPlans: boolean,
  loadingCards: boolean,
  requestingReserve: boolean,
  selectedLesson?: Lesson,
  selectedInstructor?: Instructor,
  requestingWaitingList: boolean,
  loading: boolean,
  errorMessage?: string,
  cards: Card[],
  instructors: Instructor[],
  previewNextWeek: boolean,
  message: string,
  showMessage: boolean,
  showConfirmModal: boolean,
  placeSelected?: Place,
  userData?: Me
}

type Props = RouteComponentProps<any> & {
  match: match<UrlParams>,
  userContext: DefaultUserContext,
  studios?: StudioClass[],
}
class Studio extends React.Component<Props, State> {

  state = {
    studio: undefined,
    lessons: [],
    plans: [],
    plan: null,
    cards: [],
    showCreditCard: false,
    showBackDrop: false,
    showReserveBackDrop: false,
    showBuyCredits: false,
    loadingLessons: true,
    loadingPlans: true,
    loadingCards: false,
    requestingReserve: false,
    selectedLesson: undefined,
    selectedInstructor: undefined,
    requestingWaitingList: false,
    loading: false,
    errorMessage: undefined,
    instructors: [],
    previewNextWeek: false,
    message: '',
    showMessage: false,
    showConfirmModal: false,
    placeSelected: undefined,
    userData: undefined
  }

  componentDidMount() {
    const { studio } = this.props.match.params;
    this.findStudio(studio);
    this.findPlans();
    this.findInstructors();
    window.scrollTo(0, 0);
  }

  componentDidUpdate(prevProps: Props) {
    const { studio: currentStudio } = this.props.match.params;
    const { studio: prevStudio } = prevProps.match.params;
    if (currentStudio !== prevStudio) {
      this.setState({ selectedInstructor: undefined, lessons: [] });
      this.findStudio(currentStudio);
    }
  }

  /**
   * Find studio by slug
   * @param slug - <String> Studio slug
   */
  findStudio = async (slug: string) => {
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
  findLessons = async (studio: StudioClass) => {
    const { previewNextWeek } = this.state;
    this.setState({ loadingLessons: true });
    const lessons = await LessonService.find(studio, previewNextWeek);
    if (lessons !== null) {
      this.setState({ lessons });
    } else {
      this.handleError('Ocurrió un problema al obtener las clases del estudio solicitado');
    }
    this.setState({ loadingLessons: false });
  }

  /**
   * Get all instructors
   */
  findInstructors = async () => {
    const instructors = await InstructorService.find();
    if (instructors) {
      this.setState({ instructors });
    }
  }

  /**
   * Find all plans
   */
  findPlans = async () => {
    this.setState({ loadingPlans: true });
    const plans = await PlanService.find();
    if (plans !== null) {
      this.setState({ plans });
    } else {
      this.handleError('Ocurrió un problema al obtener nuestros planes')
    }
    this.setState({ loadingPlans: false });
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
   * Notify an error
   * @param message - <String> Message to notify
   */
  handleError = (message: string) => {
    this.setState({ message, showMessage: true });
  }

  /**
   * Build the section title basing in the Studio name
   * @param studio - <Studio> The Studio object
   * @returns - <String> The section title
   */
  getSectionTitle = (studio?: StudioClass) => {
    if (studio) {
      let firstTwoWords = studio!.name.split(' ').slice(0, 2);
      firstTwoWords = firstTwoWords.map(word => `${word.charAt(0).toUpperCase()}${word.slice(1)}`);
      return firstTwoWords.join(' ');
    } else {
      return 'Cargando...';
    }
  }

  /**
   * Callback function for the calender when a plan is clicked
   * @param plan - <Plan> The plan selected
   */
  handlePlanClick = (plan: Plan) => {
    if (this.props.userContext.user) {
      this.getUserCards();
      this.setState({ showCreditCard: true, plan });
    } else {
      document.getElementById('user')!.click();
    }
  }

  /**
   * Callback function for the calender when a plan is clicked
   * @param plan - <Plan> The plan selected
   */
  handleLessonClick = (lesson: Lesson) => {
    const { previewNextWeek } = this.state;
    const studio: StudioClass | undefined = this.state.studio;
    this.setState({ selectedLesson: lesson });
    if (lesson.available === 0) {
      this.handleBackDropOpen();
    } else if (studio) {
      if (!previewNextWeek) {
        if (studio!.slug === 'online') {
          if (this.props.userContext.user && this.props.userContext.user.profile !== undefined) {
            if (lesson.available_places.length > 0) {
              this.requestCredits(lesson.available_places[0], lesson);
            } else {
              this.setState({ message: 'La clase no cuenta con lugares disponibles.', showMessage: true });
            }
          } else {
            document.getElementById('user')!.click();
          }
        } else {
          this.props.history.push(`/studio/${studio!.slug}/lesson/${lesson.id}`);
        }
      } else {
        this.setState({ message: 'Estás visualizando las clases de la siguiente semana, aún no es posible crear una reservación.', showMessage: true });
      }

    } else {
      this.props.history.push(`/`);
    }
  }

  /**
   * Callback function for handle the credit card modal open/close
   */
  handleCreditCardOpen = () => {
    const { showCreditCard } = this.state;
    this.setState({ showCreditCard: !showCreditCard });
  }

  /**
   * Callback for handle the back drop showing
   */
  handleBackDropOpen = () => {
    const { showBackDrop } = this.state;
    if (showBackDrop) {
      this.setState({ selectedLesson: undefined });
    }
    this.setState({ showBackDrop: !showBackDrop });
  }

  /**
   * Do the reservation for the lesson
   */
  onReserveLesson = async () => {
    const selectedLesson: Lesson | undefined = this.state.selectedLesson;
    if (selectedLesson) {
      if (this.props.userContext.profile) {
        this.setState({ requestingWaitingList: true });
        const waiting: Waiting | undefined = await WaitingService.create(selectedLesson!.id);
        if (waiting) {
          this.setState({
            selectedLesson: undefined,
            requestingWaitingList: false,
            showReserveBackDrop: false,
            message: 'Se te ha añadido a la lista de espera exitosamente. ¡Recuerda estar pendiente de esta reservación!',
            showMessage: true
          });
        } else {
          this.setState({
            selectedLesson: undefined,
            requestingWaitingList: false,
            showReserveBackDrop: false,
            message: 'Ocurrió un error al añadirte a la lista, por favor intenta de nuevo',
            showMessage: true
          });
        }
      } else {
        document.getElementById('user')!.click();
        this.setState({ message: 'Debes iniciar sesión antes de anotarte en la lista de espera.', showMessage: true });
        this.handleBackDropOpen();
      }

    }
  }

  /**
   * Do the reservation for the lesson
   */
  createOnlineReserve = async () => {
    const placeSelected: Place | undefined = this.state.placeSelected;
    const studio: StudioClass | undefined = this.state.studio;

    const lesson: Lesson | undefined = this.state.selectedLesson;
    if (!isUndefined(lesson) && !isUndefined(placeSelected)) {
      this.setState({ requestingReserve: true });
      const reserve: Reservation | string = await ReservationService.create(lesson!.id, placeSelected!.id);

      if (typeof reserve === 'string') {
        this.setState({ loading: false, message: reserve, showMessage: true });
      } else {
        this.setState({ message: '¡Se ha realizado tu reserva exitosamente!', showMessage: true });
        this.findLessons(studio!);
        ReactGA.event({
          category: 'User',
          action: `Nueva reserva en el estudio ${studio!.name}`
        });
      }
      this.setState({ showConfirmModal: false, requestingReserve: false });
    }
  }

  /**
   * Handle the modal accept action
   */
  handleModalAccept = async (values: FormValues, conektaResponse: any, paypal: any, code: string) => {
    const plan: Plan = this.state.plan!;
    this.setState({ loading: true });
    if (!isNull(values)) {
      if (values.card !== '' && !isUndefined(plan)) {
        const response: PlanPurcharseResponse | string = await PlanService.purchase(Number(plan.id), values.card, false, code);
        this.validatePlanPurcharseResponse(plan, response);
      }
    } else if (!isNull(conektaResponse)) {
      const card: Card | undefined = await CardsService.create(conektaResponse.id);
      if (card) {
        const response: PlanPurcharseResponse | string = await PlanService.purchase(Number(plan.id), conektaResponse.id, true, code);
        this.validatePlanPurcharseResponse(plan, response);
      } else {
        this.setState({ errorMessage: 'Ocurrió un error al realizar tu pago, por favor intenta de nuevo, no se ha hecho ningún cargo a tu cuenta.' });
      }
    } else if (!isNull(paypal)) {
      const response = await PlanService.paypalPurchase(paypal.orderID, plan);
      this.validatePlanPurcharseResponse(plan, response);
    }
    this.setState({ loading: false });
  }

  validatePlanPurcharseResponse = (plan: Plan, response: PlanPurcharseResponse | string) => {
    if (typeof response === 'string') {
      this.setState({ errorMessage: response });
    } else {
      ReactGA.event({
        category: 'User',
        action: `Compra del plan ${plan.name} por un precio de ${plan.price}`
      });
      this.setState({
        message: `Se han agregado ${plan.credits} ${plan.credits > 1 ? 'clases' : 'clase'} a tu cuenta`,
        showMessage: true,
        errorMessage: undefined,
        showCreditCard: false
      });
    }
  }

  /**
   * Get the Conekta error message and set to state
   */
  handleConektaError = (error: string) => {
    this.setState({ errorMessage: error });
  }

  /**
   * Function for filter the calendar view
   */
  filterCalendar = (instructor: Instructor) => {
    const selectedInstructor: Instructor | undefined = this.state.selectedInstructor;
    if (instructor === null) {
      this.setState({ selectedInstructor: undefined });
    } else if (!isUndefined(selectedInstructor) && selectedInstructor!.id === instructor.id) {
      this.setState({ selectedInstructor: undefined });
    } else {
      this.setState({ selectedInstructor: instructor });
    }
  }

  /**
   * Load the current week
   */
  loadCurrentWeek = () => {
    const { studio } = this.state;
    this.setState({ previewNextWeek: false }, () => this.findLessons(studio!));
  }

  /**
   * Load next week preview
   */
  loadNextWeekPreview = () => {
    const { studio } = this.state;
    this.setState({ previewNextWeek: true }, () => this.findLessons(studio!));
  }

  /**
  * 
  */
  requestCredits = async (place: Place, lesson: Lesson) => {
    const me: Me | undefined = await AuthService.me();
    if (me && lesson) {
      if (me.credits.available_online === 0 && !lesson!.community) {
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
   * Function that show/hide the credit selection component
   */
  handleShowBuyCredits = () => {
    const { showBuyCredits } = this.state;
    this.setState({ showBuyCredits: !showBuyCredits });
  }

  /**
   * Function for show/hide the confirmation modal
   */
  handleReserveModalOpen = () => {
    const { showConfirmModal } = this.state;
    this.setState({ showConfirmModal: !showConfirmModal });
  }

  render() {
    const {
      lessons,
      plans,
      showCreditCard,
      plan,
      showBackDrop,
      loadingLessons,
      loadingPlans,
      loadingCards,
      requestingWaitingList,
      cards,
      loading,
      errorMessage,
      instructors,
      selectedInstructor,
      message,
      showMessage,
      showConfirmModal,
      showBuyCredits,
      requestingReserve
    } = this.state;
    const { studios = [] } = this.props;
    const studio: StudioClass | undefined = this.state.studio;
    const placeSelected: Place | undefined = this.state.placeSelected;
    const userData: Me | undefined = this.state.userData;
    const selectedLesson: Lesson | undefined = this.state.selectedLesson;
    let confirmReserveMessage = '';

    if (selectedLesson && userData) {
      confirmReserveMessage = !selectedLesson!.community ? `Por favor confirma tu reserva, tu nuevo número de clases será de ${userData ? userData!.credits.available_online - 1 : 'N/A'}` :
        'Está clase es una community class especial, ¡Lo que significa que no requires créditos para reservar!'
    }

    return (
      <Fragment>
        <MessageBackDrop
          show={showBackDrop}
          title='¡Ups! Todos los espacios se encuentran reservados para esta clase'
          message='No te preocupes, aún puedes agregarte en la lista de espera y reservar un sitio en caso de cancelación'
          buttonText='Agregarme en la lista de espera'
          buttonAction={this.onReserveLesson}
          loading={requestingWaitingList}
          onClose={this.handleBackDropOpen}
        />
        <AppMeta showSufix={false} title={this.getSectionTitle(studio)} />
        <Calendar
          studio={studio}
          studios={studios}
          lessons={lessons}
          plans={plans}
          onClick={this.handleLessonClick}
          onPlanClick={this.handlePlanClick}
          loading={loadingLessons}
          loadingPlans={loadingPlans}
          instructors={instructors}
          onInstructorClick={this.filterCalendar}
          selectedInstructor={selectedInstructor}
          previousWeekClick={this.loadCurrentWeek}
          nextWeekClick={this.loadNextWeekPreview}
          previewNextWeek={this.state.previewNextWeek}
        />
        { showCreditCard &&
          <CreditCardModal
            onCloseMessage={() => this.setState({ errorMessage: undefined })}
             errorMessage={errorMessage}
              cards={cards}
              show={showCreditCard}
              onClose={this.handleCreditCardOpen}
              onAccept={this.handleModalAccept}
              onConektaError={this.handleConektaError}
              plan={plan}
              showCardSelector={true}
              confirmButtonText='Comprar clases'
              loadingMessage={loadingCards ? 'Obteniendo tus tarjetas registradas...' : undefined}
              loading={loading || loadingCards}
              showDiscount={true}
          />   
        }
        <SimpleAlert title='' text={message} show={showMessage} onConfirm={() => this.setState({ errorMessage: '', showMessage: false })} />
        <MessageBackDrop
          show={showConfirmModal}
          title={`¡Estás a punto de anotarte en el lugar ${placeSelected ? placeSelected!.location.replace('A', '').replace('B', '') : ''}!`}
          message={confirmReserveMessage}
          buttonText='Confirmar mi reserva'
          buttonAction={this.createOnlineReserve}
          loading={requestingReserve}
          onClose={this.handleReserveModalOpen}
        />
        <SimpleAlert title='' text={'No cuentas con créditos disponibles para clases en línea, compra un plan que te proporcione nuevas clases de modalidad online.'} show={showBuyCredits} onConfirm={() => this.setState({ errorMessage: '', showBuyCredits: false })} />
      </Fragment>
    );
  }
}

export default withRouter(withUserContext(Studio));
