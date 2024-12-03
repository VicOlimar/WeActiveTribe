import React from "react";
import { Modal, Button } from "react-bootstrap";
import DiscountService from "../../../api/Discounts";
import { Cupon } from "../../../api/Discounts/Discount";
import moment from 'moment';
import './DeactivateModal.scss';

type Props = {
  show: boolean;
  cupon: Cupon | undefined;
  parentLevelClose: () => void;
  parentLevelAlert: (
    error: boolean,
    message: string,
    alertVariant: string
  ) => void;
};

const DATE_FORMAT = 'D [de] MMMM [-] h:mm A';

const DeactivateModal = ({
  show,
  cupon,
  parentLevelClose,
  parentLevelAlert
}: Props) => {

  const handleSubmit = async () => {
    try {
      if (cupon) {
        const response: any = await DiscountService.Remove(cupon.id);
        if (response) {
          parentLevelAlert(
            true,
            "El cupón se eliminó correctamente",
            "success"
          );
          parentLevelClose();
        }
      } else {
        throw new Error();
      }
    } catch (error) {
      parentLevelAlert(
        true,
        "Error eliminando el cupón",
        "error"
      );
    }
  };

  const handleStatusChange = async () => {
    try {
      if (cupon) {
        cupon.active = !cupon.active;
        const response: any = await DiscountService.update(cupon);
        if (response) {
          parentLevelAlert(
            true,
            `El cupón se ${cupon.active ? 'activó' : 'desactivó'} correctamente`,
            "success"
          );
          parentLevelClose();
        }
      } else {
        throw new Error();
      }
    } catch (error) {
      parentLevelAlert(
        true,
        "Error cambiando el estado del cupón",
        "error"
      );
    }
  };

  return (
    <div className='deactivate-cupon'>
      <Modal show={show} onHide={parentLevelClose}>
        <Modal.Header>
          <Modal.Title>{cupon ? cupon.code : ''}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h1>
            {cupon ? cupon.discount : ''} {cupon ? cupon.type === 'percentage' ? '%' : '$' : ''} de descuento
          </h1>
          <p>Límite de uso: {cupon ? cupon.total_uses : ''}</p>
          <p>Fecha de expiración: {cupon ? moment.utc(cupon.expires_after).format(DATE_FORMAT) : ''}</p>
        </Modal.Body>
        <Modal.Footer>
          <div className='deactivate-cupon__button-row' >
            <Button onClick={handleSubmit} variant='danger'>Eliminar</Button>
          </div>
          <div className='deactivate-cupon__button-row' >
            <Button onClick={handleStatusChange}>{cupon?.active ? 'Desactivar' : 'Activar'}</Button>
          </div>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default DeactivateModal;
