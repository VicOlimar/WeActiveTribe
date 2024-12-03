import React from 'react';

export type DefaultRouteContext = {
    routes: string[];
    setState: () => void;
    resetState: () => void;
    returnPrevRoute: (data?: any) => void;
}

const defaultRouteContext: DefaultRouteContext = {
    routes: [],
    setState: () => {},
    resetState: () => {},
    returnPrevRoute: () => {}
}

const RouteContext = React.createContext(defaultRouteContext);

export default RouteContext

