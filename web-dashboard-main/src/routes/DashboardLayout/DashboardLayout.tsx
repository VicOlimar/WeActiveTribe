import React, { Component } from "react";
import Navbar from "../../shared/Navbar/index";
import Sidebar from "../../shared/Sidebar/index";
import "./DashboardLayout.scss";
import Overlay from '../../shared/ovelay';

type Props = {};
type State = {
  showSidebar: boolean;
};

class DashboardLayout extends Component<Props, State> {
  constructor(props: Props){
    super(props);
    this.state = {
      showSidebar: false,
    }
  }

  toggleSidebar = () => {
    this.setState({showSidebar: !this.state.showSidebar});
  }

  hideSidebar = () => {
    this.setState({showSidebar: false});
  }

  render() {
    return (
      <React.Fragment>
        <Navbar toggleSidebar={this.toggleSidebar}></Navbar>
        <Sidebar showWhenMobile={this.state.showSidebar}></Sidebar>
        { this.state.showSidebar &&
          <Overlay clickEvent={this.hideSidebar}></Overlay>
        }
        <div className="router-view">{this.props.children}</div>
      </React.Fragment>
    );
  }
}

export default DashboardLayout;
