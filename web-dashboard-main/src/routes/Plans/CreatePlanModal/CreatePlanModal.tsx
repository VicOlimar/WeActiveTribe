import React from 'react';
import { Modal } from 'react-bootstrap';
import PlanForm from './PlanForm';
import 'bootstrap/dist/css/bootstrap.css';
import PlanService, { ECreditType, EPlanExpiresUnit } from '../../../api/Plan/Plan';
import { LessonType } from '../../../api/LessonType/LessonType';
import { Studio } from '../../../api/Studio/Studio';

type Props = {
  studios: Studio[];
  lessonTypes: LessonType[];
  show: boolean;
  parentHandleClose: () => void;
  parentHandleAlert: (error: boolean, message: string, alertVariant: string) => void;
  parentHandleLoad: () => void;
}

const CreateLessonModal = (props: Props) => {
  const { lessonTypes, studios, show, parentHandleClose, parentHandleAlert, parentHandleLoad } = props;

  const onSubmit = async (
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
      const response = await PlanService.create(
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
        parentHandleAlert(true, 'Plan creado correctamente', 'success');
        parentHandleLoad();
        parentHandleClose();
      } else {
        throw new Error();
      }
    } catch (error) {
      parentHandleAlert(true, 'Error creando plan', 'error');
    }
  }
  return (
    <div className='create-plan'>
      <Modal show={show} onHide={parentHandleClose}>
        <Modal.Header>
          <h1 className='header-title'>Crear plan</h1>
        </Modal.Header>
        <Modal.Body>
          <PlanForm
            studios={studios}
            lessonTypes={lessonTypes}
            onSubmit={onSubmit}
          ></PlanForm>
        </Modal.Body>
      </Modal>
    </div>
  );

}


export default CreateLessonModal;