import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import StudioContext from './StudioContext';
import {Studio} from '../../services/Studio/Studio';
import {STUDIO_CONTEXT_KEY} from '../../config/const';

type Props = {
  children: React.ReactNode;
  initialStudio?: Studio;
};

const StudioProvider = ({children, initialStudio}: Props) => {
  const [studio, setStudio] = useState<Studio | undefined>(
    initialStudio || undefined,
  );

  const updateStudio = (studioObj: Studio) => {
    setStudio(studioObj);
  };

  const resetStudio = () => {
    setStudio(undefined);
  };

  const fetchStudio = async () => {
    const studioContext = await AsyncStorage.getItem(STUDIO_CONTEXT_KEY);
    if (studioContext !== undefined && studioContext !== null) {
      const studioObj: Studio = JSON.parse(studioContext);
      setStudio(studioObj);
    }
  };

  const storeStudio = async (studioObj: Studio) => {
    await AsyncStorage.setItem(STUDIO_CONTEXT_KEY, JSON.stringify(studioObj));
  };

  useEffect(() => {
    fetchStudio();
  }, []);

  useEffect(() => {
    if (studio) {
      storeStudio(studio);
    }
  }, [studio]);

  return (
    <StudioContext.Provider value={{studio, updateStudio, resetStudio}}>
      {children}
    </StudioContext.Provider>
  );
};

export default StudioProvider;
