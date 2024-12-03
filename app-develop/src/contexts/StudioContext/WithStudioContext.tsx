import React from 'react';
import StudioContext from './StudioContext';

const WithStudioContext = (Component: any) => (
  (props: any) => (
    <StudioContext.Consumer>
      {context => <Component studioContext={context} {...props} />}
    </StudioContext.Consumer>
  )
);

export default WithStudioContext;