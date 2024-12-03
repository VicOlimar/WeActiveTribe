import React from 'react';
import { Modal } from 'react-bootstrap';
import PlanForm from './PlanForm';
import 'bootstrap/dist/css/bootstrap.css';
import PlanService, { ECreditType, EPlanExpiresUnit, Plan } from '../../../api/Plan/Plan';
import { LessonType } from '../../../api/LessonType/LessonType';
import { Studio } from '../../../api/Studio/Studio';

type Props = {
  studios: Studio[];
  lessonTypes: LessonType[];
  show: boolean;
  plan: Plan;
  parentHandleClose: () => void;
  parentHandleAlert: (error: boolean, message: string, alertVariant: string) => void;
  parentHandleLoad: () => void;
}



const EditPlanModal = (props: Props) => {
  const {
    parentHandleAlert,
    parentHandleClose,
    parentHandleLoad,
    show,
    studios,
    lessonTypes,
    plan
  } = props;

  const onSubmit = async (
    id: number,
    name: string,
    credits: number,
    price: number,
    expires_numbers: number,
    expires_unit: EPlanExpiresUnit,
    special: boolean,
    credit_type: ECreditType,
    lesson_type: number | undefined,
    studio: number | undefined,
  ) => {
    try {
      const response = await PlanService.update(
        id,
        name,
        price,
        credits,
        expires_numbers,
        expires_unit,
        special,
        credit_type,
        lesson_type,
        studio
      );
      if (response) {
        parentHandleAlert(true, 'Plan actualizado correctamente', 'success');
        parentHandleLoad();
        parentHandleClose();
      } else {
        throw new Error();
      }
    } catch (error) {
      parentHandleAlert(true, 'Error actualizando plan', 'error');
    }
  }
  return (
    <Modal show={show} onHide={parentHandleClose}>
      <Modal.Header>
        <h1 className='header-title'>Actualizar</h1>
      </Modal.Header>
      <Modal.Body>
        <PlanForm
          studios={studios}
          lessonTypes={lessonTypes}
          plan={plan}
          onSubmit={onSubmit}
        ></PlanForm>
      </Modal.Body>
    </Modal>
  );

}


export default EditPlanModal;