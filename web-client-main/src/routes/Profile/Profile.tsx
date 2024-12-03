import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  withRouter,
  RouteComponentProps,
} from "react-router-dom";
import AppHeader from "./../../shared/AppHeader";
import SectionHeader from "./components/SectionHeader";

import "./Profile.scss";
import { withUserContext } from "../../contexts/UserContext";
import { DefaultUserContext } from "../../contexts/UserContext/UserContext";
import LessonsInfo from "./components/LessonsInfo";
import Footer from "../../shared/Footer";
import Reservations from "./routes/Reservations";
import Cards from "./routes/Cards";
import { Me } from "../../api/Auth/Auth";
import AuthService from "./../../api/Auth/Auth";
import { isUndefined } from "util";
import Purchase from "./routes/Purchases";
import User from "./routes/User";
import WaitingList from "./routes/WaitingList";
import CreditDetailsModal from "./components/CreditDetailsModal";

export enum EProfileSections {
  DATA = "data",
  RESERVATIONS = "reservations",
  WAITING_LIST = "waiting-list",
  PAYMENT_METHODS = "payment_methods",
  PURCHASES = "purchases",
  PAYMENT = "payment",
}

export enum ECreditType {
  ONLINE = "online",
  CLASSIC = "classic",
}

type Props = RouteComponentProps<any> & {
  userContext?: DefaultUserContext;
};

type State = {
  width: number;
  activeSection: EProfileSections;
  me?: Me;
  showCreditsModal: boolean;
  showOnlineCreditsModal: boolean;
};

class Profile extends Component<Props, State> {
  state: Readonly<State> = {
    width: window.innerWidth,
    activeSection: EProfileSections.DATA,
    me: undefined,
    showCreditsModal: false,
    showOnlineCreditsModal: false,
  };

  componentDidMount() {
    this.addEventListener();
    this.getMeData();
  }

  componentWillUnmount() {
    // We need to remove the event before component unmount for avoid missings calls
    window.removeEventListener("resize", this.updateWindowWidth, false);
  }

  addEventListener = () => {
    // Add listener for refresh the width var in state
    window.addEventListener("resize", this.updateWindowWidth);
    if (window.location.href.includes("/cards")) {
      this.setState({ activeSection: EProfileSections.PAYMENT_METHODS });
    } else if (window.location.href.includes("/reservations")) {
      this.setState({ activeSection: EProfileSections.RESERVATIONS });
    } else if (window.location.href.includes("/purchases")) {
      this.setState({ activeSection: EProfileSections.PURCHASES });
    } else if (window.location.href.includes("/waiting-list")) {
      this.setState({ activeSection: EProfileSections.WAITING_LIST });
    }

    window.scrollTo(0, 0);
  };

  /**
   * Request the "Me" data, the data is info about the current user, is used for know credits available and to expire
   */
  getMeData = async () => {
    const me = await AuthService.me();
    if (!isUndefined(me)) {
      this.setState({ me });
    }
  };

  /**
   * Callback function for listen the window width event
   */
  updateWindowWidth = () => {
    this.setState({ width: window.innerWidth });
  };

  /**
   * Handle the section header click
   */
  handleSectionClick = (sectionClicked: EProfileSections) => {
    this.setState({ activeSection: sectionClicked });
  };

  /**
   * Send the user to studios for reserve a class
   */
  goToStudios = () => {
    this.props.history.push("/");
  };

  /**
   * Show credit details modal
   */
  showCreditsDetail = (showCreditsModal: boolean = true) => {
    this.setState({ showCreditsModal });
  };

  /**
   * Show credit details modal
   */
  showOnlineCreditsDetail = (showOnlineCreditsModal: boolean = true) => {
    this.setState({ showOnlineCreditsModal });
  };

  /**
   * Set the current state var to show the selected credit type
   * @param type Credit type details to show
   */
  handleShowCreditDetail = (type: ECreditType) => {
    if (type === ECreditType.ONLINE) {
      this.showOnlineCreditsDetail();
    } else {
      this.showCreditsDetail();
    }
  };

  render() {
    const { user } = this.props.userContext!;
    const {
      width,
      activeSection,
      me,
      showCreditsModal,
      showOnlineCreditsModal,
    } = this.state;
    const mdBreakpoint = 992;

    const closeCreditsDetail = () => this.showCreditsDetail(false);
    const closeOnlineCreditsDetail = () => this.showOnlineCreditsDetail(false);

    return (
      <div>
        <Router>
          <AppHeader
            leftComponent={
              <SectionHeader
                user={user}
                active={activeSection}
                verticalLines={width > mdBreakpoint}
                onClick={this.handleSectionClick}
              />
            }
          />
          <LessonsInfo
            credits={me ? me!.credits.available : 0}
            onlineCredits={me ? me!.credits.available_online : 0}
            expiration={me ? me!.credits.to_expire : 0}
            nextLessons={
              me ? (me!.reserves ? me!.reserves.next_reserves : 0) : 0
            }
            onClick={this.goToStudios}
            onSeeMoreClick={this.handleShowCreditDetail}
          />
          <Switch>
            <Route path="/profile">
              <Route
                path="/profile"
                exact
                render={(props: any) => <User {...props} />}
              />
              <Route
                path="/profile/reservations"
                exact
                render={(props: any) => (
                  <Reservations {...props} onCancelReserve={this.getMeData} />
                )}
              />
              <Route
                path="/profile/waiting-list"
                exact
                render={(props: any) => (
                  <WaitingList {...props} onCancelReserve={this.getMeData} />
                )}
              />
              <Route
                path="/profile/cards"
                exact
                render={(props: any) => <Cards {...props} />}
              />
              <Route
                path="/profile/purchases"
                exact
                render={(props: any) => <Purchase {...props} />}
              />
            </Route>
          </Switch>
          <Footer forcedFooterRedirect={true} />
          <CreditDetailsModal
            title="Total de clases presenciales"
            credits={me ? me.credits.available_data : []}
            show={showCreditsModal}
            onClick={closeCreditsDetail}
          />
          <CreditDetailsModal
            title="Total de clases online"
            credits={me ? me.credits.available_online_data : []}
            show={showOnlineCreditsModal}
            onClick={closeOnlineCreditsDetail}
          />
        </Router>
      </div>
    );
  }
}

export default withUserContext(withRouter(Profile));
