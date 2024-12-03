import React from 'react';
import RouteContext from './RouteContext';

const withRouteContext = (Component: any) => (
    (props: any) => (
        <RouteContext.Consumer>
            {context => <Component routeContext={context} {...props} />}
        </RouteContext.Consumer>
    )
);

export default withRouteContext;