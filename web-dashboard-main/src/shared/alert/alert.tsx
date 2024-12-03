import React from "react";
import SweetAlert from 'react-bootstrap-sweetalert';


type Props = {
  message?: String | null;
  variant: any;
  parentHandleClose: () => void;
};

const Alert = ({ message, variant, parentHandleClose }: Props) => {
  return (
    <SweetAlert
      type={variant}
      title={message}
      onConfirm={parentHandleClose}
    ></SweetAlert>
  );
}

export default Alert;
