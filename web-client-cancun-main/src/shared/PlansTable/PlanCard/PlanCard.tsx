import React from 'react';
import './PlanCard.scss';
import { Col, Row, Container } from 'react-bootstrap';
import { Plan } from '../../../api/Plan/Plan';
import Dinero from 'dinero.js';

const CENTS = 100;

interface PlanCardProps {
  plan: Plan;
}

class PlanCard extends React.Component<PlanCardProps> {

  getMoneyFormat(amount: number) {
    return Dinero({ amount: amount * CENTS, currency: 'MXN' }).toFormat('$0,0.00');
  }

  getExpiracy(expires_numbers: number, expires_unit: 'days' | 'years' | 'months') {
    if (expires_unit === 'days') {
      if (expires_numbers === 1) {
        return `${expires_numbers} día`;
      } else {
        return `${expires_numbers} días`;
      }
    }
    if (expires_unit === 'months') {
      if (expires_numbers === 1) {
        return `${expires_numbers} mes`;
      } else {
        return `${expires_numbers} meses`;
      }
    }
    if (expires_unit === 'years') {
      if (expires_numbers === 1) {
        return `${expires_numbers} año`;
      } else {
        return `${expires_numbers} años`;
      }
    }
  }

  render() {
    return (
      <div className="plan"> 
        <div className="plan__title">
          <div className="plan__title__credits">
            {this.props.plan.credits}
          </div>
          <div className="plan__title__name">
            {this.props.plan.name}
          </div>
        </div>
        <div className="plan__content">
          <div className="plan__content__icon">
          </div>
          <div className="plan__content__price">
            {this.getMoneyFormat(this.props.plan.price)} 
          </div>
          <div className="plan__content__expires_in">
            Vigencia {this.getExpiracy(this.props.plan.expires_numbers, this.props.plan.expires_unit)}
          </div>
        </div>
      </div>
    );
  }
}

export default PlanCard;
