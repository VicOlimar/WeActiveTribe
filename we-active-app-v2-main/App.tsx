import React from 'react';

import AppContainerScreen from './src/shared/AppContainer';
import UserProvider from './src/contexts/UserContext/UserProvider';
import StudioProvider from './src/contexts/StudioContext/StudioProvider';

const App = () => {
  return (
    <StudioProvider>
      <UserProvider>
        <AppContainerScreen />
      </UserProvider>
    </StudioProvider>
  );
};

export default App;
