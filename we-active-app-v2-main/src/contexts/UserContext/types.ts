import {Profile, User} from '../../services/Auth/Auth';

export interface AuthState {
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
  remember_me?: boolean;
}
