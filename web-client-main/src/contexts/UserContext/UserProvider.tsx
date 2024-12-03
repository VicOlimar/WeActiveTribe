import React, { Component } from 'react';
import UserContext, { DefaultUserContext } from './UserContext';
import { User, Profile } from '../../api/Auth/Auth';
import AuthService from '../../api/Auth/Auth';
import moment from 'moment-timezone';

type Props = {}

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
  last_login?: Date,
  last_reload?: Date,
}

const defaultState = {
  token: undefined,
  refresh_token: undefined,
  user: undefined,
  profile: undefined,
  remember_me: undefined,
  last_login: undefined,
  last_reload: undefined,
}

class UserProvider extends Component<Props, State> {
  state = defaultState;

  async componentWillMount() {
    const userContext = window.localStorage.getItem('user_context');
    if (userContext) {
      let data: DefaultUserContext = JSON.parse(userContext);
      this.setState({ last_reload: new Date() });

      if (data.remember_me && data.last_login) {
        if (moment(data.token!.expires) <= moment()) {
          const user = await AuthService.refreshToken(data.refresh_token!.token);
          data = { ...data, ...user };
        }
        this.setState(data);
      }
    }
  }

  componentDidUpdate() {
    window.localStorage.setItem('user_context', JSON.stringify(this.state));
  }

  _setState = (state = {}, callback = () => true) => {
    const {
      token,
      refresh_token,
      user,
      profile,
      remember_me,
      last_login,
      last_reload,
    } = { ...this.state, ...state };
    return this.setState({
      token,
      refresh_token,
      user,
      profile,
      remember_me,
      last_login,
      last_reload,
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
          profile: this.state.profile,
          remember_me: this.state.remember_me,
          last_login: this.state.last_login,
          last_reload: this.state.last_reload,
          setState: this._setState,
          resetState: this._resetState,
        }}
      >
        {this.props.children}
      </UserContext.Provider>
    );
  }
}

export default UserProvider;
