import React, { useEffect } from 'react';
import { Route, Redirect, withRouter, RouteComponentProps } from 'react-router-dom';
import { withUserContext } from '../../contexts/UserContext';
import { DefaultUserContext } from '../../contexts/UserContext/UserContext';

type Props = RouteComponentProps & {
  component: any,
  userContext?: DefaultUserContext,
}
const PrivateRoute = ({ component: Component, userContext, history, ...rest }: Props) => {

  useEffect(() => {
    if (!(userContext && userContext.user && userContext.user.role === 'admin'))
      history.push('login');

  })

  return (<Route {...rest} render={(props) => (
    userContext !== undefined ? userContext.user ? userContext.user.role !== 'admin' ?
      null : <Component {...props} /> : <Redirect to='/login' /> : <Redirect to='/login' />
  )} />);
}

export default withUserContext(withRouter(PrivateRoute));