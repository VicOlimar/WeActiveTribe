import React from 'react';
import './Button.scss'

type Props = {
  onClick?: Function,
  text?: string,
  className?: string,
  loading?: boolean,
  type?: "submit"|"button"|"reset",
}
const Button = ({ onClick, text='', className, loading = false, type='button' }: Props) => {
  return (
    <button type={type} disabled={loading} className={`modal-button ${className}`} onClick={() => { if (onClick) onClick!() }}>{loading && <i className="fa fa-spinner fa-spin"></i>} {text}</button>
  )
}

export default Button;