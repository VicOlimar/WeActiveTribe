import React from 'react';
import {AuthState} from './types';

export type UserContextType = {
  authState: AuthState;
  saveAuthState: (authState: AuthState) => void;
  resetAuthState: () => void;
};

const defaultUserContext = {
  authState: {
    token: undefined,
    refresh_token: undefined,
    user: undefined,
    profile: undefined,
    remember_me: true,
  },
  saveAuthState: (_authState: AuthState) => {},
  resetAuthState: () => {},
};

const UserContext = React.createContext<UserContextType>(defaultUserContext);

export default UserContext;
