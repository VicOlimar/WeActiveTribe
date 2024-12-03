import React from 'react';
import UserContext from './UserContext';

const withUserContext = (Component: any) => (
  (props: any) => (
    <UserContext.Consumer>
      {context => <Component userContext={context} {...props} />}
    </UserContext.Consumer>
  )
);

export default withUserContext;