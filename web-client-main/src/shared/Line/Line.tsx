import React from 'react';
import './Line.scss';

type Props = {
  vertical?: boolean,
  containerClassName?: string,
  lineClassName?: string,
}

const VerticalLine = ({ vertical = true, containerClassName = '', lineClassName = '' }: Props) => {
  return (
    vertical ? <div className={`line ${containerClassName}`}><span className={`line__white ${lineClassName}`}></span></div> : <hr className='line-horizontal'></hr>
  );
}

export default VerticalLine;