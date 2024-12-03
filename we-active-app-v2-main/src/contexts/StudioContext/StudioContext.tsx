import {createContext} from 'react';
import {Studio} from '../../services/Studio/Studio';

export type DefaultStudioContext = {
  studio?: Studio;
  updateStudio: (studio: Studio) => void;
  resetStudio: () => void;
};

const defaultStudioContext: DefaultStudioContext = {
  studio: undefined,
  updateStudio: (_studio: Studio) => {},
  resetStudio: () => {},
};

const StudioContext = createContext(defaultStudioContext);

export default StudioContext;
