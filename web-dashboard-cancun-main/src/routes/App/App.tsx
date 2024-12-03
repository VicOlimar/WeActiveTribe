import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";
import { UserProvider } from "../../contexts/UserContext";
import "./App.scss";
import AppMeta from "../../shared/AppMeta";
import ErrorBoundary from "../../shared/ErrorBoundary";
import Login from "../Login/Index";
import DashboardLayout from "../DashboardLayout/index";
import Instructors from "../Instructors/index";
import Users from "../Users/index";
import PrivateRoute from "../../shared/PrivateRoute";
import { RouteComponentProps } from 'react-router-dom';
import Background from '../../shared/background';
import Purchases from '../Purchases/index';
import UsersPurchases from "../Users/UsersPurchases";
import Discounts from '../Discounts/index';
import Lessons from '../Lessons/index';
import Studio from '../Studio/index';
import Lesson from '../Lesson/index';
import Plans from '../Plans/index';
import Ticket from '../Ticket/index';
import UserReservations from '../Users/UsersReservations';
import { RouteProvider } from "../../contexts/RouteContext";
import Notifications from "../Notifications";
import LessonTypes from "../LessonTypes";
import LessonsReport from "../LessonsReport";


type Props = RouteComponentProps<any> & {};
type State = {};

const Main = () => {
  return (
    <Redirect to='/purchases'/>
  )
}

class App extends Component<Props, State> {
  render() {
    return (
      <Router>
        <UserProvider>
          <div id="notifications_area" className="notification__section"></div>
          <AppMeta title={"We Active Ride"} showPrefix={false} />
          <Background></Background>
          <Switch>
            <Route path="/login" exact component={Login} />
            <DashboardLayout>
              <RouteProvider>
                <PrivateRoute path="/trainers" exact component={Instructors} />
                <PrivateRoute path="/users" exact component={Users} />
                <PrivateRoute path="/users/:userId/purchases" exact component={UsersPurchases} />
                <PrivateRoute path="/users/:userId/lessons" exact component={UserReservations} />
                <PrivateRoute path="/purchases" exact component={Purchases} />
                <PrivateRoute path="/purchases/:id/ticket" exact component={Ticket} />
                <PrivateRoute path='/discounts' exact component={Discounts} />
                <PrivateRoute path="/studio" exact component={Studio} />
                <PrivateRoute path='/studio/:slug/lessons' exact component={Lessons} />
                <PrivateRoute path='/studio/:slug/lesson/:lesson' exact component={Lesson} />
                <PrivateRoute path='/plans' exact component={Plans} />
                <PrivateRoute path='/notifications' exact component={Notifications} />
                <PrivateRoute path='/lessons' exact component={LessonTypes} />
                <PrivateRoute path='/lessons-report' exact component={LessonsReport} />
                <PrivateRoute path='/' exact component={Main} />
                <PrivateRoute path='/index.html' exact component={Main} />
              </RouteProvider>
            </DashboardLayout>
          </Switch>
        </UserProvider>
      </Router>
    );
  }
}

export default ErrorBoundary(App);
