import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import UserContext from './UserContext';
import AuthService from '../../services/Auth/Auth';
import moment from 'moment';
import {AuthState} from './types';
import Bugsnag from '@bugsnag/react-native';
import {USER_CONTEXT_KEY} from '../../config/const';

const defaultState: AuthState = {
  token: undefined,
  refresh_token: undefined,
  user: undefined,
  profile: undefined,
  remember_me: true,
};

type Props = {
  children: React.ReactNode;
  initialAuthState?: AuthState;
};

const UserProvider = ({children, initialAuthState}: Props) => {
  const [authState, setAuthState] = useState<AuthState>(
    initialAuthState || defaultState,
  );

  const saveAuthState = (newAuthState = {}) => {
    const {token, refresh_token, user, profile, remember_me} = {
      ...authState,
      ...newAuthState,
    };

    return setAuthState({
      token,
      refresh_token,
      user,
      profile,
      remember_me,
    });
  };

  const resetAuthState = () => {
    setAuthState(defaultState);
  };

  const fetchAuthState = async () => {
    const userContext = await AsyncStorage.getItem(USER_CONTEXT_KEY);
    if (userContext !== null && userContext !== undefined) {
      let authStateObj: AuthState = JSON.parse(userContext);
      if (authStateObj.user) {
        const {user} = authStateObj;
        Bugsnag.setUser(
          user.id.toString(),
          `${user.name} ${user.last_name}`,
          user.email,
        );
      }

      if (
        authStateObj.remember_me &&
        authStateObj.token &&
        moment(authStateObj.token.expires) <= moment()
      ) {
        // refreshToken();
      }

      setAuthState(authStateObj);
    }
  };

  const storeAuthState = async (currentAuthState: AuthState) => {
    let newAuthState = currentAuthState;
    if (newAuthState.token && moment(newAuthState.token.expires) <= moment()) {
      // refreshToken();
    }

    await AsyncStorage.setItem(USER_CONTEXT_KEY, JSON.stringify(newAuthState));
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const refreshToken = async () => {
    if (!authState.refresh_token) {
      return;
    }
    const user = await AuthService.refreshToken(authState.refresh_token.token);
    const newAuthState = {...authState, ...user};
    setAuthState(newAuthState);
  };

  useEffect(() => {
    fetchAuthState();
  }, []);

  useEffect(() => {
    storeAuthState(authState);
  }, [authState]);

  return (
    <UserContext.Provider
      value={{
        authState,
        saveAuthState,
        resetAuthState,
      }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
