import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { withUserContext } from '../../contexts/UserContext';
import { DefaultUserContext } from '../../contexts/UserContext/UserContext';

type Props = {
  component: any,
  userContext?: DefaultUserContext,
}
const PrivateRoute = ({ component: Component, userContext, ...rest }: Props) => {
  return (<Route {...rest} render={(props) => (
    userContext !== undefined ? userContext.user ?
      <Component {...props} /> : <Redirect to='/' /> : <Component {...props} />
  )} />);
}

export default withUserContext(PrivateRoute);