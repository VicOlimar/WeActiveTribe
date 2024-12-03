import React from 'react';
import './Loader.scss';

const Loader = ({ show = true }: { show: boolean }) => {
  return (
    show ? <div className="loader">
      <div className="duo duo1">
        <div className="dot dot-a"></div>
        <div className="dot dot-b"></div>
      </div>
      <div className="duo duo2">
        <div className="dot dot-a"></div>
        <div className="dot dot-b"></div>
      </div>
    </div> : <div></div>
  )
}

export default Loader;