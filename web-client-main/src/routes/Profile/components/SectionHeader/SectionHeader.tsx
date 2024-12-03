import React from 'react';
import './SectionHeader.scss';
import { User } from '../../../../api/Auth/Auth';
import Line from '../../../../shared/Line';
import { Link } from 'react-router-dom';

type Props = {
  user?: User,
  active?: 'data' | 'reservations' | 'waiting-list' | 'purchases' | 'payment' | 'payment_methods',
  verticalLines?: boolean,
  onClick?: Function,
}

function isActive(active: string, type: string) {
  return active === type ? '-active' : '';
}

const SectionHeader = ({ user, active = 'data', verticalLines = true, onClick = () => { } }: Props) => {
  return (
    <div className={'section_header'}>
      <span className={`section_header__name`}>{user ? user.name : ''}</span>
      <Line vertical={verticalLines} />
      <Link to='/profile' className={`section_header__item${isActive(active, 'data')}`} onClick={() => onClick('data')}>Mis Datos</Link>
      <Line vertical={verticalLines} />
      <Link to='/profile/reservations' className={`section_header__item${isActive(active, 'reservations')}`} onClick={() => onClick('reservations')} >Mis Clases Reservadas</Link>
      <Line vertical={verticalLines} />
      <Link to='/profile/waiting-list' className={`section_header__item${isActive(active, 'waiting-list')}`} onClick={() => onClick('waiting-list')} >Mi Lista de Espera</Link>
      <Line vertical={verticalLines} />
      <Link to='/profile/cards' className={`section_header__item${isActive(active, 'payment_methods')}`} onClick={() => onClick('payment_methods')}>M&eacute;todos de Pago</Link>
      <Line vertical={verticalLines} />
      <Link to='/profile/purchases' className={`section_header__item${isActive(active, 'purchases')}`} onClick={() => onClick('purchases')}>Historial de Compras</Link>
    </div>
  );
}

export default SectionHeader;