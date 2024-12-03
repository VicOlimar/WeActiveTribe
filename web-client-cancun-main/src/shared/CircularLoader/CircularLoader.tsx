import React from 'react';
import './CircularLoader.scss';

const CircularLoader = ({ message }: { message?: string }) => {
  return (
    <div className='circular-loader__container'>
      <div className="circular-loader">
        <svg viewBox="0 0 100 100" id='circle-middle'><circle fill='#EDEDED' cx='50' cy='50' r="6" /></svg>
        <svg viewBox="0 0 100 100"><circle fill='#58318b' cx='50' cy='50' r="4.5" /></svg>
        <svg viewBox="0 0 100 100"><circle fill='#58318b' cx='50' cy='50' r="4.5" /></svg>
        <svg viewBox="0 0 100 100"><circle fill='#58318b' cx='50' cy='50' r="4.5" /></svg>
        <svg viewBox="0 0 100 100"><circle fill='#58318b' cx='50' cy='50' r="4.5" /></svg>
        <svg viewBox="0 0 100 100"><circle fill='#58318b' cx='50' cy='50' r="4.5" /></svg>
        <svg viewBox="0 0 100 100"><circle fill='#58318b' cx='50' cy='50' r="4.5" /></svg>
        <svg viewBox="0 0 100 100"><circle fill='#58318b' cx='50' cy='50' r="4.5" /></svg>
        <svg viewBox="0 0 100 100"><circle fill='#58318b' cx='50' cy='50' r="4.5" /></svg>
        <svg viewBox="0 0 100 100"><circle fill='#58318b' cx='50' cy='50' r="4.5" /></svg>
        <svg viewBox="0 0 100 100"><circle fill='#58318b' cx='50' cy='50' r="4.5" /></svg>
        <svg viewBox="0 0 100 100"><circle fill='#58318b' cx='50' cy='50' r="4.5" /></svg>
        <svg viewBox="0 0 100 100"><circle fill='#58318b' cx='50' cy='50' r="4.5" /></svg>
      </div>
      {message && <p className='circular-loader__message'>{message}</p>}
    </div>
  )
}

export default CircularLoader;