import React, { Component } from 'react';
import { Profile, User } from '../../api/Users/Users';
import UserContext, { DefaultUserContext } from './UserContext';
import { RouteComponentProps, withRouter } from 'react-router';

type Props = RouteComponentProps & {};

type State = {
  token?: {
    token: string,
    expires: number,
    expires_in: number,
  },
  refresh_token?: {
    token: string,
    expires: number,
    expires_in: number,
  },
  user?: User,
  profile?: Profile,
  remember_me?: boolean,
}

const defaultState = {
  token: undefined,
  refresh_token: undefined,
  user: undefined,
  profile: undefined,
  remember_me: undefined
}

class UserProvider extends Component<Props, State> {
  state = defaultState;

  componentWillMount() {
    const userContext = window.localStorage.getItem('user_context');
    if(userContext) {
      const data: DefaultUserContext = JSON.parse(userContext);
      if(data) {
        this.setState(data);
      }
    } else {
      this.props.history.push('login');
    }
  }

  componentDidUpdate() {
    window.localStorage.setItem('user_context', JSON.stringify(this.state));
  }

  _setState = (state = {}, callback = () => true ) => {
    const {
      token,
      refresh_token,
      user,
      profile,
      remember_me,
    } = { ...this.state, ...state };
    
    return this.setState({
      token,
      refresh_token,
      user,
      profile,
      remember_me,
    }, callback);
  }

  _resetState = (callback = () => true) => {
    this.setState(defaultState, callback);
  }

  render() {
    return (
      <UserContext.Provider
        value={{
          token: this.state.token,
          refresh_token: this.state.refresh_token,
          user: this.state.user,
          profile: this.state.user,
          remember_me: this.state.remember_me,
          setState: this._setState,
          resetState: this._resetState,
        }}
      >
        {this.props.children}
      </UserContext.Provider>
    );
  }
}

export default withRouter(UserProvider);