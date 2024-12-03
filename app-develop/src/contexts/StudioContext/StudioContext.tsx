import React from 'react';
import { Studio } from '../../services/Studio/Studio';

export type DefaultStudioContext = {
  studio?: Studio,
  setState: Function,
  resetState: Function,
}

const defaultStudioContext: DefaultStudioContext = {
  studio: undefined,
  setState: () => { },
  resetState: () => { },
};
const StudioContext = React.createContext(defaultStudioContext);

export default StudioContext;