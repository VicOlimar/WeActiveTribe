import React from "react";
import { Link, RouteComponentProps, withRouter } from "react-router-dom";
import { scroller } from "react-scroll";
import { withUserContext } from "../../contexts/UserContext";
import { DefaultUserContext } from "../../contexts/UserContext/UserContext";
import AppMeta from "../../shared/AppMeta";
import "./Locations.scss";

//Assets
import LeftBlack from "../Studios/assets/left-black.jpg";
import Left from "./assets/FondoIzq.jpg";
import Right from "./assets/FondoDer.jpg";
import CancunOut from "./assets/cancunOut.png";
import CancunIn from "./assets/cancunIn.png";
import MeridaOut from "./assets/Mérida-Outline.png";
import MeridaIn from "./assets/MeridaIn.png";

type State = {
  isMobile: boolean;
};

type Props = RouteComponentProps<any> & {
  userContext: DefaultUserContext;
};

class Locations extends React.Component<Props, State> {
  MD_BREAKPOINT = 992;

  state = {
    isMobile: false,
  };

  componentDidMount() {
    window.addEventListener("resize", this.handleWindowResize);
    this.handleWindowResize();
    this.verifyIfNeedScroll();
  }

  verifyIfNeedScroll = () => {
    if (this.props.location.search.includes("?plans=")) {
      setTimeout(() => {
        scroller.scrollTo("plans", {
          duration: 500,
          delay: 100,
          smooth: true,
        });
      }, 1000);
    } else {
      window.scrollTo(0, 0);
    }
  };

  componentWillUnmount() {
    window.removeEventListener("resize", this.handleWindowResize);
  }

  handleWindowResize = () => {
    this.setState({ isMobile: window.innerWidth <= this.MD_BREAKPOINT });
  };

  displayLocations() {
    const { isMobile } = this.state;
    const normalBackground = LeftBlack;
    return (
      <>
        <Link
          className={`studios__side ${isMobile ? "studios__side__mobile" : ""}`}
          to={`/merida`}
        >
          <div>
            <img className="studios__side__image" src={Left} alt="studio" />
            <div
              className="studios__side__image-hover"
              style={{ backgroundImage: `url(${Left})` }}
            ></div>
            <div
              className={`studios__side__logo ${
                isMobile ? "studios__side__mobile__logo" : ""
              }`}
            >
              <img src={MeridaOut} alt={"Mérida"} className="hide" />
              <img src={MeridaIn} alt={"Mérida"} className="visible" />
            </div>
          </div>
        </Link>
        <a
          className={`studios__side ${isMobile ? "studios__side__mobile" : ""}`}
          href="https://cancun.weactive.mx/"
        >
          <div>
            <img className="studios__side__image" src={Right} alt="studio" />
            <div
              className="studios__side__image-hover"
              style={{ backgroundImage: `url(${Right})` }}
            ></div>
            <div
              className={`studios__side__logo ${
                isMobile ? "studios__side__mobile__logo" : ""
              }`}
            >
              <img src={CancunOut} alt="Cancún Out" className="hide" />
              <img src={CancunIn} alt="Cancun In" className="visible" />
            </div>
          </div>
        </a>
      </>
    );
  }

  render() {
    return (
      <>
        <AppMeta title={"Estudios"} />
        <div className="studios">{this.displayLocations()}</div>
      </>
    );
  }
}

export default withRouter(withUserContext(Locations));
