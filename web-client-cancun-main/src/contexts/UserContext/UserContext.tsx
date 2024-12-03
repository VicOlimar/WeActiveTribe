import React from 'react';
import { User, Profile } from '../../api/Auth/Auth';

export type DefaultUserContext = {
  token?: {
    token: string;
    expires: number;
    expires_in: number;
  };
  refresh_token?: {
    token: string;
    expires: number;
    expires_in: number;
  };
  user?: User;
  profile?: Profile;
  remember_me?: boolean,
  last_login?: Date,
  last_reload?: Date,
  setState: Function,
  resetState: Function,
}

const defaultUserContext: DefaultUserContext = {
  token: undefined,
  refresh_token: undefined,
  user: undefined,
  profile: undefined,
  remember_me: undefined,
  last_login: undefined,
  last_reload: undefined,
  setState: () => { },
  resetState: () => { },
};
const UserContext = React.createContext(defaultUserContext);

export default UserContext;