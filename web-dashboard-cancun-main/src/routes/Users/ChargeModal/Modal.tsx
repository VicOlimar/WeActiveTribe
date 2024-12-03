import React from 'react';
import { Modal } from 'react-bootstrap';
import ChargeForm from './ChargeForm';
import 'bootstrap/dist/css/bootstrap.css';
import UserService from '../../../api/Users';

type Props = {
  userId: number;
  show: boolean;
  parentLevelClose: () => void;
  parentLevelAlert: (error: boolean, message: string, alertVariant: string) => void;
}


const ChargeModal = (props: Props) => {
  const handleSubmit = async (opMethod: string, opPlan: number | null, credits: number | null, paid: number | null, authCode: string, credit_type?: 'classic' | 'online') => {
    try {
      let response;
      if (opMethod === 'courtesy') {
        if (credits) {
          response = await UserService.addCharge(
            props.userId, opPlan, opMethod, authCode, paid, credits, credit_type);
        } else throw new Error('No se puede crear una cortesía sin asignar créditos');
      } else {
        response = await UserService.addPlan(
          props.userId!, opPlan!, opMethod!, authCode!, paid);
      }
      if (response) {
        props.parentLevelAlert(true, "Créditos agregados correctamente", "success");
        props.parentLevelClose();
      } else {
        throw new Error("Ocurrió un error al asignar los créditos, prueba de nuevo");
      }
    } catch (error) {
      props.parentLevelAlert(true, error.message, "error");
    }
  }

  return (
    <React.Fragment>
      <Modal show={props.show} onHide={props.parentLevelClose}>
        <Modal.Header>
          <Modal.Title>
            Agregar cargo
                      </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ChargeForm
            show={props.show}
            parentLevelAlert={props.parentLevelAlert}
            onSubmit={handleSubmit}
          ></ChargeForm>
        </Modal.Body>
      </Modal>
    </React.Fragment>
  )
}

export default ChargeModal;