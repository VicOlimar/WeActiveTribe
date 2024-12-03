import React, { Component } from "react";
import { RouteComponentProps } from "react-router";
import { withRouter } from "react-router";
import imageBack from './images/background.jpg';

import "./background.scss";

type Props = RouteComponentProps<any>;

type State = {
  show: boolean;
};

class Background extends Component<Props, State> {
  state = {
    show: false
  };

  componentDidMount() {
    const { history } = this.props;
    history.listen(this.verifyShowBackground);
    this.verifyShowBackground(history.location);
  }

  verifyShowBackground = (location: any) => {
    const { pathname } = location;
    this.setState({ show: pathname.includes("/login") });
  };

  render() {
    if (this.state.show) return (
      <React.Fragment>
        <img className='image-back' src={ imageBack } alt='background' ></img>
        <div className="dark-background image-back"></div>
      </React.Fragment>
    );
    else return null;
  }
}

export default withRouter(Background);
