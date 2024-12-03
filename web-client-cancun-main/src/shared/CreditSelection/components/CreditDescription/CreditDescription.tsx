import React from 'react';
import CreditHeader from './components/CreditHeader';
import CreditBody from './components/CreditBody';
import './CreditDescription.scss';
import { Plan } from '../../../../api/Plan/Plan';

type Props = { plan: Plan, onClick?: Function };
const CreditDescription = ({ plan, onClick }: Props) => {
  const className = `credit-description credit-description${plan.special ? '-special' : ''}`;
  return (
    <div className={className} onClick={onClick ? () => onClick(plan) : () => { }}>
      <CreditHeader plan={plan} />
      <CreditBody plan={plan} />
    </div>
  )
}

export default CreditDescription;