import React from 'react';
import Button from './../Button';
import './Footer.scss';

type Props = {
  onClick: Function,
  text?: string,
}
const Footer = ({ onClick, text = 'Cerrar' }: Props) => {
  return (
    <div className="footer">
      <Button className="footer__button" onClick={onClick} text={text}/>
    </div>
  )
}

export default Footer;