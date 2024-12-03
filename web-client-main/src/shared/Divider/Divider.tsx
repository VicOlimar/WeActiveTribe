import React from 'react';
import './Divider.scss';

type Props = { noPadding?: boolean, className?: string, style?: object };
const Divider = ({ noPadding = false, className, ...restProps }: Props) => {
  return (
    <div className={`divider-container${noPadding ? 'no-padding' : ''} ${className}`} {...restProps}>
      <div className='divider-container__normal'></div>
    </div>
  );
}

export default Divider;