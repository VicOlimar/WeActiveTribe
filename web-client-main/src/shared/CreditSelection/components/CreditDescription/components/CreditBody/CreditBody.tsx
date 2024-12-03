import React from 'react';
import './CreditBody.scss';
import Icon from './../../../../assets/icon.png';
import { Plan } from '../../../../../../api/Plan/Plan';
import { getMoneyFormat } from './../../../../../../utils/money';
import BuenFinImg from './../../../../assets/buen-fin.png';

const CreditBody = ({ plan }: { plan: Plan }) => {

  function isBuenFin() {
    return plan.name.toLowerCase().includes('buen fin');
  }

  function getExtraLabel(plan: Plan) {
    return (
      plan.special && plan.expires_numbers === 30 ?
        <span className='credit-body__plan-price__special'>
          <br /> {plan.id === 66 ? "1 mes de We Ride en línea" : plan.id === 50 ? "+ 1 clase de regalo" : ''} </span> : ''
    )
  }

  return (
    <div className='credit-body'>
      <div className='credit-body__image-container'>
        <img src={Icon} alt='Credit icon' />
      </div>
      <div className='credit-body__plan_info'>
        <p className='credit-body__plan-price'>
          {getMoneyFormat(plan.price)} MXN{getExtraLabel(plan)}
        </p>
        <p className='credit-body__plan-expires-numbers'>Vigencia {plan.expires_numbers} días</p>
        {
          isBuenFin() && <div className='text-center'>
            <img src={BuenFinImg} className='credit-body__buen-fin' alt='buen fin' />
          </div>
        }
         <p className='credit-body__plan-info-studio'>{plan.labelByStudio}</p>
      </div>
    </div>
  )
}

export default CreditBody;