import React from 'react';
import './VerticalAlign.scss';

const VerticalAlign = ({ children, paddingTop = '0px', paddingBottom = '0px' }: { children: any, paddingTop?: string, paddingBottom?: string }) => {
  return (
    <div className='vertical_align'>
      <div className='vertical_align__content' style={{ paddingTop: paddingTop, paddingBottom: paddingBottom }}>
        {children}
      </div>
    </div>
  )
}

export default VerticalAlign;