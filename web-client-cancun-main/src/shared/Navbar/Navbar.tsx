import React, { Component } from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { scroller } from "react-scroll";
import { withRouter } from 'react-router';
import { RouteComponentProps } from 'react-router';
import { Studio } from '../../api/Studio/Studio';
import { withUserContext } from '../../contexts/UserContext';
import LoginModal from './../LoginModal';
import CreditCard from './assets/credit-card.png';
import User from './assets/user.png';
import Logout from './assets/logout.png';
import ShoppingCart from './assets/shopping-cart.png';
import Bars from './assets/bars.png';
import WeTrain from "./assets/we-train.png";
import WeRide from './assets/we-ride.png';
import WeOnline from './assets/we-online.png';
import WeActive from './assets/weactive.png';
import WeCun from './assets/we-cun.png';

import './Navbar.scss';
import { DefaultUserContext } from '../../contexts/UserContext/UserContext';
import { isUndefined } from 'util';
import SimpleAlert from '../SimpleAlert';

type Props = RouteComponentProps<any> & {
  studios: Studio[],
  notifyError?: Function,
  userContext?: DefaultUserContext,
  bugsnagClient?: any,
}

type State = {
  showStudios: boolean;
  showModal: boolean,
  showOnlyOne?: string,
  expandedNavbar: boolean,
  showMessage: boolean,
  message: string,
}
class AppNavbar extends Component<Props, State> {

  FORMS = {
    register: 'register',
    login: 'login',
  }

  state = {
    showStudios: false,
    showModal: false,
    showOnlyOne: undefined,
    expandedNavbar: false,
    showMessage: false,
    message: '',
  }

  componentDidMount() {
    const { history } = this.props;
    history.listen(this.verifyShowStudios);
    history.listen(this.verifyShowOnlyOne);
    this.verifyShowStudios(history.location);
    this.verifyShowOnlyOne(history.location);
    this.setBugsnagData();
  }

  setBugsnagData = () => {
    if (this.props.userContext && this.props.userContext.user) {
      const { id, name, email } = this.props.userContext.user;
      this.props.bugsnagClient.user = {
        id,
        name,
        email
      }
    }
  }

  isActiveStudio = (slug: string) => {
    const { showOnlyOne } = this.state;
    return showOnlyOne === slug;
  }

  /**
   * Display the studios links
   */
  displayStudios = () => {
    const { showOnlyOne } = this.state;
    const updateStudios = this.props.studios.filter((studio: Studio) => studio.slug !== 'online');
    return updateStudios.map((studio: Studio, index: number) => {
        return <Link
          key={index}
          className={`nav-item nav-link studio-name app-nav__studio__name app-nav__studio__logo ${!isUndefined(showOnlyOne) ? `app-nav__studio__logo-${studio.slug}${this.isActiveStudio(studio.slug) ? '-active' : ''}` : ''}`}
          to={`/studio/${studio.slug}`}
          onClick={() => this.handleNavbarExpanded()}>
          {
            studio.slug === 'we-ride' ?
              <img className={`app-nav__studio__logo`} src={WeRide} alt={`${studio.name} logo`} /> :
              studio.slug === 'we-hiit' ?
                <img className={`app-nav__studio__logo`} src={WeTrain} alt={`${studio.name} logo`} /> :
                studio.slug === 'online' ? <img className={`app-nav__studio__logo`} src={WeOnline} alt={`${studio.name} logo`} /> :
                  studio.name.split(' ')[1]
          }
        </Link>
    })
  }

  /**
   * Verify if the Navbar need show the studios links
   */
  verifyShowStudios = (location: any) => {
    const { pathname } = location;
    this.setState({ showStudios: pathname !== '/' });
  }

  /**
   * Verify if the current view only need show the current studio with a switch button
   */
  verifyShowOnlyOne = (location: any) => {
    const { pathname } = location;
    if (pathname.includes('we-ride')) {
      this.setState({ showOnlyOne: 'we-ride' });
    } else if (pathname.includes('we-hiit')) {
      this.setState({ showOnlyOne: 'we-hiit' });
    } else if (pathname.includes('online')) {
      this.setState({ showOnlyOne: 'online' });
    } else {
      this.setState({ showOnlyOne: undefined });
    }
  }

  /**
   * Open/Close the modal based in the current status
   */
  handleModalOpen = () => {
    const { showModal } = this.state;
    this.setState({ showModal: !showModal });
  }

  /**
   * Callback function when user logged in or signed up
   */
  onAuth = (response: DefaultUserContext, rememberUser: boolean) => {
    response.remember_me = rememberUser;
    response.last_login = new Date();
    this.props.userContext!.setState(response, () => {
      this.setBugsnagData();
      this.handleModalOpen();
    });
  }

  /**
   * Send the user to profile section
   */
  goToProfile = (force = false) => {
    if (this.props.history.location.pathname === '/' || force) {
      this.props.history.push('/profile');
    }
  }

  /**
   * Send the user to cards section
   */
  goToCards = () => {
    if (this.props.history.location.pathname.includes('/profile')) {
      window.location.href = '/profile/cards';
    } else {
      this.props.history.push('/profile/cards');
    }
  }

  goToPlans = () => {
    if (this.props.history.location.pathname !== '/') {
      window.location.href = '/?plans=true';
    } else {
      scroller.scrollTo('plans', {
        duration: 500,
        delay: 100,
        smooth: true,
      });
    }
  }

  goToAbout = () => {
    this.props.history.push('/about');
  }

  /**
   * Function to logout the current user
   */
  doLogout = () => {
    this.props.userContext!.resetState(() => this.props.history.push('/'));
  }

  handleNavbarExpanded = () => {
    this.setState({ expandedNavbar: !this.state.expandedNavbar });
  }

  render() {
    const { showStudios, showModal, showMessage, message } = this.state;
    const { user } = this.props.userContext!;
    return (
      <div>
        <LoginModal show={showModal} onClose={this.handleModalOpen} onOk={this.onAuth} notifyError={(error: any) => this.setState({ message: error, showMessage: true })} />
        <Navbar expand="lg" className='app-nav' expanded={this.state.expandedNavbar} onToggle={() => this.handleNavbarExpanded()}>
          <Navbar.Brand>
            <a className="navbar-brand" href="https://www.weactive.mx/"><img className='app-nav__logo' src={WeCun} alt='App logo' /></a>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" children={<img className='app-nav__option' src={Bars} alt='bars' />} onClick={() => { this.handleNavbarExpanded() }} />
          <Navbar.Collapse className="text-center" id="basic-navbar-nav">
            <Nav>
              {showStudios && this.displayStudios()}
            </Nav>
            <Nav className="ml-auto">
              <Nav.Item className='app-nav__item' onClick={this.goToAbout}>
                <img className='app-nav__option' src={WeActive} alt='we active' /> Nosotros
              </Nav.Item>
              <Nav.Item className='app-nav__item' onClick={this.goToPlans}>
                <img className='app-nav__option' src={ShoppingCart} alt='user' /> Planes
              </Nav.Item>
              {user && <Nav.Item className='app-nav__item' onClick={this.goToCards}>
                <img className='app-nav__option' src={CreditCard} alt='credit-card' /> Mi Pago
              </Nav.Item>}
              <Nav.Item className='app-nav__item' onClick={user ? () => this.goToProfile(true) : this.handleModalOpen}>
                <img className='app-nav__option' src={User} alt='user' id='user' /> Perfil
              </Nav.Item>
              {user && <Nav.Item className='app-nav__item' onClick={this.doLogout}>
                <img className='app-nav__option' src={Logout} alt='credit-card' /> Cerrar sesión
              </Nav.Item>}
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <SimpleAlert title='' text={message} show={showMessage} onConfirm={() => this.setState({ message: '', showMessage: false })} />
      </div>
    )
  }

}

export default withRouter(withUserContext(AppNavbar));
