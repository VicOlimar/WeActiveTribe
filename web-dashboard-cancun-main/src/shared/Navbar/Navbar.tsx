import React, { Component } from 'react';
import { Navbar, Dropdown, DropdownButton } from 'react-bootstrap';
import { withRouter } from 'react-router';
import { RouteComponentProps } from 'react-router';
import { Icon } from '@mdi/react';
import { mdiAccountCircleOutline, mdiMenu } from '@mdi/js';
import { withUserContext } from '../../contexts/UserContext';
import { DefaultUserContext } from '../../contexts/UserContext/UserContext';
import weRide from './images/we-ride.png';
import weHiit from './images/we-hiit.png';

import './Navbar.scss';

type Props = RouteComponentProps<any> & {
  userContext?: DefaultUserContext;
  toggleSidebar?: () => {};
};

type State = {
  showNavbar: boolean;
  showWeHiit: boolean;
  showWeRide: boolean;
  showWeOnline: boolean;
  userName: string;
};
class AppNavbar extends Component<Props, State> {
  state = {
    showNavbar: false,
    userName: 'Usuario',
    showWeHiit: true,
    showWeRide: true,
    showWeOnline: true,
  };

  componentDidMount() {
    const { history } = this.props;
    history.listen(this.verifyShowNavbar);
    this.verifyShowNavbar(history.location);
  }

  componentDidUpdate(prevProps: Props) {
    if (this.props.location !== prevProps.location) {
      if (this.props.location.pathname.includes('we-hiit')) {
        this.setState({ showWeHiit: true });
        this.setState({ showWeRide: false });
        this.setState({ showWeOnline: false });
      } else if (this.props.location.pathname.includes('we-ride')) {
        this.setState({ showWeRide: true });
        this.setState({ showWeHiit: false });
        this.setState({ showWeOnline: false });
      } else if (this.props.location.pathname.includes('online')) {
        this.setState({ showWeRide: false });
        this.setState({ showWeHiit: false });
        this.setState({ showWeOnline: true });
      } else {
        this.setState({ showWeHiit: true, showWeRide: true });
      }
    }
  }

  verifyShowNavbar = (location: any) => {
    const { pathname } = location;
    this.setState({ showNavbar: pathname.includes('/panel') });
  };

  logout = async () => {
    if (this.props.userContext) await this.props.userContext.resetState();
    this.props.history.push('/login');
  };

  render() {
    return (
      <div>
        <Navbar fixed="top" expand="lg" className="app-nav">
          <div className="app-nav__sidebar-button">
            <button
              className="app-nav__sidebar-button-invisible"
              onClick={
                this.props.toggleSidebar ? this.props.toggleSidebar : () => {}
              }
            >
              <Icon path={mdiMenu} size={1} color={'white'}></Icon>
            </button>
          </div>
          <div className='app-nav__img-row'>
            {this.state.showWeRide && <img className='app-nav__img-row__image' alt='ride' src={weRide}></img>}
            {this.state.showWeHiit && <img className='app-nav__img-row__image' alt='hiit' src={weHiit}></img>}
          </div>
          <DropdownButton
            drop="left"
            variant="outline-dark"
            title={
              <Icon
                path={mdiAccountCircleOutline}
                size={1}
                color="#ffffff"
              ></Icon>
            }
            id={`dropdown`}
          >
            <Dropdown.Item eventKey="2" onClick={this.logout}>
              Cerrar sesión
            </Dropdown.Item>
          </DropdownButton>
        </Navbar>
      </div>
    );
  }
}

export default withUserContext(withRouter(AppNavbar));
