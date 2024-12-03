import React from 'react';
import { User, Profile } from '../../services/Auth/Auth';

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
  setState: Function,
  resetState: Function,
}

const defaultUserContext: DefaultUserContext = {
  token: undefined,
  refresh_token: undefined,
  user: undefined,
  profile: undefined,
  remember_me: true,
  setState: () => { },
  resetState: () => { },
};
const UserContext = React.createContext(defaultUserContext);

export default UserContext;