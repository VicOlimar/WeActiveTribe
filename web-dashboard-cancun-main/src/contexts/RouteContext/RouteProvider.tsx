import React, { Component } from 'react';
import RouteContext from './RouteContext';
import { RouteComponentProps, withRouter } from 'react-router';

type Props = RouteComponentProps & {};

type State = {
    routes: string[];
    isReturning: boolean;
}

const defaultState = {
    routes: [],
    isReturning: false,
}

class RouteProvider extends Component<Props, State> {
    state = defaultState;

    componentDidUpdate = (prevProps: Props) => {
        if(this.props.location !== prevProps.location){
            if(!this.state.isReturning){
                let routes: string[] = [...this.state.routes];
                    if(this.props.location.pathname !== routes[routes.length - 1] ){
                        routes.push(this.props.location.pathname);
                    } 
                this.setState({ routes: routes });
            } 
            this.setState({isReturning: false});
        } 
    }

    _setState = (state = {}, callBack = () => true) => {
        const { routes } = { ...this.state, ...state };

        return this.setState({
            routes
        }, callBack);
    }

    _resetState = (callBack = () => true) => {
        this.setState(defaultState, callBack);
    }

    returnPrevRoute = (data: any) => {
        if(this.state.routes.length > 0){
            this.setState({isReturning: true});
            let routes: string[] = [...this.state.routes];
            if(this.state.routes.length > 1){
                routes.pop();
            }
            this.props.history.push(routes[routes.length - 1 ], data);
            this.setState({routes: routes});
        } else {
            this.setState({isReturning: false});
        }
    }

    render() {
        return (
            <RouteContext.Provider
                value={{
                    routes: this.state.routes,
                    setState: this._setState,
                    resetState: this._resetState,
                    returnPrevRoute: (data: any) => this.returnPrevRoute(data)
                }}
            >
                {this.props.children}
            </RouteContext.Provider>
        )
    }
}

export default withRouter(RouteProvider);