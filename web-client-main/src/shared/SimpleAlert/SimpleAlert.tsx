import React from 'react';
import SweetAlert from 'sweetalert2-react';
import './SimpleAlert.scss';

type Props = {
  title: string;
  text: string;
  show: boolean;
  confirmText?: string;
  onConfirm?: Function;
}

const SimpleAlert = ({ title, text, show, onConfirm, confirmText = 'Entendido' }: Props) => {
  return (
    <SweetAlert
      show={show}
      title={title}
      text={text}
      confirmButtonText={confirmText}
      customClass={{ confirmButton: 'btn we-alerts__info' }}
      buttonsStyling={false}
      onConfirm={() => onConfirm ? onConfirm() : true}
    />
  )
}

export default SimpleAlert;