import React from 'react';
import { Row, Col } from 'react-bootstrap';
import { Credit } from '../../../../api/Credit/Credit';
import { OnlineCredit } from '../../../../api/OnlineCredit/OnlineCredit';
import Button from '../../../../shared/Button';
import Modal from '../../../../shared/Modal';
import './CreditDetailsModal.scss';

type Props = {
  show: boolean;
  credits: Credit[] | OnlineCredit[];
  title: string;
  onClick: () => void;
}

type CreditTypeInfo = {
  name: string;
  count: Number;
}

const CreditTypeInfo: React.FC<{ info: CreditTypeInfo }> = ({ info }) => {
  return <Row>
    <Col xs={6}>
      <p className='credit_type__text'>{info.name}</p>
    </Col>
    <Col xs={6}>
      <p className='credit_type__value'>{info.count}</p>
    </Col>
  </Row>
}

const CreditDetailsModal: React.FC<Props> = ({
  show,
  title,
  credits,
  onClick,
}) => {

  function getLessonTypeIDS(): Array<Number> {
    const lessonTypesIds: Array<Number> = [];
    credits.forEach((credit: Credit | OnlineCredit) => {
      if (!lessonTypesIds.includes(credit.lesson_type_id)) {
        lessonTypesIds.push(credit.lesson_type_id);
      }
    });
    return lessonTypesIds;
  }

  function getStudioIDS(): Array<Number> {
    const studiosIds: Array<Number> = [];
    credits.forEach((credit: Credit | OnlineCredit) => {
      if (!studiosIds.includes(credit.studio_id)) {
        studiosIds.push(credit.studio_id);
      }
    });
    return studiosIds;
  }

  function mapCreditTypeData(): Array<CreditTypeInfo> {
    const lessonTypesIds: Array<Number> = getLessonTypeIDS();
    const studiosIds: Array<Number> = getStudioIDS();
    const creditsInfo: Array<CreditTypeInfo> = [];

    lessonTypesIds.forEach((id: Number) => {
      const filteredCredits: Credit[] | OnlineCredit[] = credits.filter((credit: Credit | OnlineCredit) => credit.lesson_type_id === id && credit.lesson_type && !credit.studio_id);
      if (filteredCredits.length > 0) {
        creditsInfo.push({
          name: filteredCredits[0].lesson_type ? filteredCredits[0].lesson_type.name : 'Normales',
          count: filteredCredits.length,
        });
      }
    });

    studiosIds.forEach((id: Number) => {
      const filteredCredits: Credit[] | OnlineCredit[] = credits.filter((credit: Credit | OnlineCredit) => credit.studio_id === id && !credit.lesson_type_id);
      if (filteredCredits.length > 0) {
        creditsInfo.push({
          name: filteredCredits[0].studio ? filteredCredits[0].studio.name : 'Normales',
          count: filteredCredits.length,
        });
      }
    });
    return creditsInfo;
  }

  const creditTypesInfo: CreditTypeInfo[] = mapCreditTypeData();

  return <div className='credit_details_modals'>
    <Modal show={show} onClose={onClick}>
      <h3 className='credit_details_modals__title'>{title}</h3>
      <div className='credit_details_modals__credits'> 
        {
          creditTypesInfo.map((creditTypeInfo: CreditTypeInfo, index: number) => <CreditTypeInfo key={index} info={creditTypeInfo} />)
        }
        {
          creditTypesInfo.length === 0 && <p className='credit_details_modals__empty'>No tienes clases disponibles</p>
        }
      </div>
      <Button className='credit_details_modals__btn' text='Cerrar' onClick={onClick}></Button>
    </Modal>
  </div>
}

export default CreditDetailsModal;