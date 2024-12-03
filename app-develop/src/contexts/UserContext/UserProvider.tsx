import React, { Component } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import UserContext, { DefaultUserContext } from './UserContext';
import { User, Profile } from '../../services/Auth/Auth';
import AuthService from '../../services/Auth/Auth';
import { Client } from 'bugsnag-react-native';
import moment from 'moment-timezone';

type Props = {
  bugsnagClient?: Client;
}

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
  remember_me: true,
}

class UserProvider extends Component<Props, State> {

  state = defaultState;

  async componentDidMount() {
    const userContext = await AsyncStorage.getItem('user_context');
    if (userContext !== null) {
      let data: DefaultUserContext = JSON.parse(userContext);
      if (this.props.bugsnagClient && data.user) {
        const { user } = data;
        this.props.bugsnagClient.setUser(user.id.toString(), `${user.name} ${user.last_name}`, user.email);
      }
      if (data.remember_me) {
        if (moment(data.token!.expires) <= moment()) {
          const user = await AuthService.refreshToken(data.refresh_token!.token);
          data = { ...data, ...user };
        }
        this.setState(data);
      }
    }
  }

  async componentDidUpdate() {
    let state = this.state;
    if (moment(state.token!.expires) <= moment()) {
      const user = await AuthService.refreshToken(state.refresh_token!.token);
      state = { ...state, ...user };
    }
    await AsyncStorage.setItem('user_context', JSON.stringify(state));
  }

  _setState = (state = {}, callback = () => true) => {
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
          profile: this.state.profile,
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

export default UserProvider;
