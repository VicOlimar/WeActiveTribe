import React, { Component } from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import StudioContext, { DefaultStudioContext } from './StudioContext';
import { Studio } from '../../services/Studio/Studio';

type Props = {}

type State = {
  studio?: Studio
}

const defaultState = {
  studio: undefined,
}

class StudioProvider extends Component<Props, State> {

  state = defaultState;

  async componentDidMount() {
    const studioContext = await AsyncStorage.getItem('studio_context');
    if (studioContext !== null) {
      const data: DefaultStudioContext = JSON.parse(studioContext);
      this.setState(data);
    }
  }

  async componentDidUpdate() {
    await AsyncStorage.setItem('studio_context', JSON.stringify(this.state));
  }

  _setState = (state = {}, callback = () => true) => {
    const {
      studio,
    } = { ...this.state, ...state };
    return this.setState({
      studio,
    }, callback);
  }

  _resetState = (callback = () => true) => {
    this.setState(defaultState, callback);
  }

  render() {
    return (
      <StudioContext.Provider
        value={{
          studio: this.state.studio,
          setState: this._setState,
          resetState: this._resetState,
        }}
      >
        {this.props.children}
      </StudioContext.Provider>
    );
  }
}

export default StudioProvider;
