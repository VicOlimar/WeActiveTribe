import React, { Fragment } from 'react';
import { Link, RouteComponentProps, withRouter } from 'react-router-dom';
import { scroller } from "react-scroll";
import './Studios.scss';
import StudioService, { Studio } from '../../api/Studio/Studio';
import PlanService, { Plan } from './../../api/Plan/Plan';
import CreditSelection from '../../shared/CreditSelection';
import CreditCardModal from './../../shared/CreditCardModal';
import AppMeta from './../../shared/AppMeta';

// Assets
import HiitColor from './assets/rigth-black-new.jpeg';
import LeftBlack from './assets/left-black.jpg';
import RideColor from './assets/left-color-new.jpg';
import OnlineColor from './assets/online-color.jpg';
import OnlineColorMobile from './assets/online-color-mobile.jpg';
import WeHiit from './assets/we-train.png';
import WeRide from './assets/we-ride.png';
import WeOnline from './assets/we-online.png';
import { withUserContext } from '../../contexts/UserContext';
import { DefaultUserContext } from '../../contexts/UserContext/UserContext';
import CardsService, { Card } from '../../api/Cards/CardsService';
import SimpleAlert from '../../shared/SimpleAlert';
import Button from '../../shared/Button';
import { handlePlanPurchase, PlanPurchaseResult } from '../../services/PlanPurchaseService';

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
  code: string,
}

type State = {
  studios: Studio[],
  plans: Plan[],
  plan: Plan | null,
  showCreditCard: boolean,
  errorMessage?: string,
  loading: boolean,
  loadingCards: boolean,
  cards: Card[],
  isMobile: boolean,
  message: string,
  showMessage: boolean,
};
type Props = RouteComponentProps<any> & {
  userContext: DefaultUserContext,
};

class StudiosComponent extends React.Component<Props, State> {
  MD_BREAKPOINT = 992;

  state = {
    studios: [],
    plans: [],
    plan: null,
    showCreditCard: false,
    errorMessage: undefined,
    loading: false,
    loadingCards: false,
    cards: [],
    isMobile: false,
    message: '',
    showMessage: false,
  }

  componentDidMount() {
    this.getStudios();
    this.getPlans();
    window.addEventListener('resize', this.handleWindowResize);
    this.handleWindowResize();
    this.verifyIfNeedScroll();
  }

  verifyIfNeedScroll = () => {
    if (this.props.location.search.includes('?plans=')) {
      setTimeout(() => {
        scroller.scrollTo('plans', {
          duration: 500,
          delay: 100,
          smooth: true,
        });
      }, 1000);
    } else {
      window.scrollTo(0, 0);
    }
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleWindowResize);
  }

  handleWindowResize = () => {
    this.setState({ isMobile: window.innerWidth <= this.MD_BREAKPOINT });
  }

  /**
   * Get all Studios
   */
  getStudios = async () => {
    const studios = await StudioService.find();
    if (studios !== null) {
      this.setState({ studios });
    } else {
      this.setState({ message: 'Ha ocurrido un error al obtener nuestros estudios', showMessage: true });
    }
  }

  /**
   * Get all plans
   */
  getPlans = async () => {
    const plans = await PlanService.find();
    if (plans !== null) {
      this.setState({ plans });
    } else {
      this.setState({ message: 'Ha ocurrido un error al obtener nuestros planes', showMessage: true });
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
   * Get the Payment Gateway error message and set to state
   */
  handlePaymentGatewayError = (error: string) => {
    this.setState({ errorMessage: error });
  }

  /**
   * Display the Studios side layout with hover event
   * @returns - React Component Studios
   */
  displayStudios() {
    const { isMobile, studios } = this.state;
    const updateStudios = studios.filter((studio: Studio) => studio.slug !== 'online');
    return updateStudios.map((studio: Studio, index: number) => {
      const normalBackground = LeftBlack;
      const hoverBackground = this.getColorImage(studio);
        return (
          <Link key={studio.slug}
            className={`studios__side ${isMobile ? 'studios__side__mobile' : ''}`}
            to={`/studio/${studio.slug}`}
          >
            <div>
              <img className="studios__side__image" src={isMobile ? hoverBackground : normalBackground} alt='studio' />
              <div className="studios__side__image-hover" style={{ backgroundImage: `url(${hoverBackground})` }} ></div>
              <div className={`studios__side__logo ${isMobile ? 'studios__side__mobile__logo' : ''}`}>
                <img src={this.getStudioLogo(studio)} alt={studio.slug} />
              </div>
              <div className="studios__side__label">
                <Button type='submit' className='login__form__register' text='Reservar clases'/>
              </div>
            </div>
          </Link>
        )
    })
  }

  getColorImage = (studio: Studio) => {
    const { isMobile } = this.state;

    switch (studio.slug) {
      case 'we-hiit':
        return HiitColor;
      case 'we-ride':
        return RideColor;
      case 'online':
        return isMobile ? OnlineColorMobile : OnlineColor;
      default:
        return HiitColor;
    }
  }

  getStudioLogo = (studio: Studio) => {
    switch (studio.slug) {
      case 'we-hiit':
        return WeHiit;
      case 'we-ride':
        return WeRide;
      default:
        return WeOnline;
    }
  }

  render() {
    const { plans, showCreditCard, plan, loading, loadingCards, cards, errorMessage, message, showMessage } = this.state;
    const classicPlans = plans.filter((plan: Plan) => plan.credit_type === 'classic');
    return (
      <Fragment>
        <AppMeta title={'Estudios'} />
        <div className="studios">
          {this.displayStudios()}
        </div>
        <div id={'plans'}>
          {
            classicPlans.length > 0 && <CreditSelection
              title={'Comprar clases'}
              description={'Compra el plan que más se acomode a tu ritmo, y ¡Prepárate para no parar!'}
              plans={classicPlans}
              onClick={this.handlePlanClick}
              isDefaultBackground={true}
              showFooter={true}
            />
          }
        </div>
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
        <SimpleAlert title='' text={message} show={showMessage} onConfirm={() => this.setState({ message: '', showMessage: false })} />
      </Fragment >
    );
  }
}

export default withRouter(withUserContext(StudiosComponent));
