import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import StudioService, { Studio as StudioClass } from '../../api/Studio/Studio';
import { UserProvider } from '../../contexts/UserContext';
import './App.scss';

import Studios from '../Studios/Studios';
import Studio from '../Studio/Studio';
import Navbar from '../../shared/Navbar/Navbar';
import Login from '../Auth/Login/Login';
import Register from '../Auth/Register/Register';
import Profile from './../Profile';
import ErrorBoundary from './../../shared/ErrorBoundary';
import AppMeta from './../../shared/AppMeta';
import PrivateRoute from '../../shared/PrivateRoute/PrivateRoute';
import Lesson from '../Studio/routes/Lesson';
import Policies from '../Policies';
import Terms from '../Terms';
import About from '../About';
import RecoveryPassword from '../RecoveryPassword';
import ReactGA from 'react-ga';
import Locations from '../Locations/Locations';

ReactGA.initialize(process.env.REACT_APP_ANALYTICS_ID || '');

type Props = {
  bugsnagClient: any,
}
type State = {
  studios: StudioClass[],
}

class App extends Component<Props, State> {

  state = {
    studios: [],
  }

  getStudios = async () => {
    const studios = await StudioService.find();
    if (studios !== null) {
      this.setState({ studios });
    }
  }

  componentDidMount() {
    this.getStudios();
  }

  render() {
    const { studios } = this.state;
    return (
      <UserProvider>
          <div id='notifications_area' className='notification__section'></div>
          <AppMeta title={'We Active Tribe'} showSufix={false} />
          <Router>
            <Navbar studios={studios} bugsnagClient={this.props.bugsnagClient}></Navbar>
            <Switch>
              <Route path='/' exact component={Locations} />
              <Route path='/merida' exact component={Studios} />
              <Route path='/about' exact component={About} />
              <Route path='/recovery_password' exact component={RecoveryPassword} />
              <Route path='/policies' exact component={Policies} />
              <Route path='/terms' exact component={Terms} />
              <Route path='/auth/login' exact component={Login} />
              <Route path='/auth/register' exact component={Register} />
              <Route path='/studio/:studio/' exact component={() => <Studio studios={studios}/>}  />
              <Route path='/studio/:studio/lesson/:lesson' exact component={Lesson} />
              <PrivateRoute path='/profile' exact component={Profile} />
              <PrivateRoute path='/profile/reservations' exact component={Profile} />
              <PrivateRoute path='/profile/waiting-list' exact component={Profile} />
              <PrivateRoute path='/profile/cards' exact component={Profile} />
              <PrivateRoute path='/profile/purchases' exact component={Profile} />
              <Route render={() => <Redirect to='/' />} />
              <Route path='/index.html' exact component={Studios} />
            </Switch>
          </Router>
        </UserProvider>
    );
  }
}

export default ErrorBoundary(App);
