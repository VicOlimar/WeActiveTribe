import React, { Component } from 'react';
import { Row, Col } from 'react-bootstrap';
import './Header.scss';
import * as Utils from './../../../../utils/money';
import { Plan } from '../../../../api/Plan/Plan';

type Props = {
  plan?: Plan | null,
  onCancel?: Function,
  headerText?: string,
}

class Header extends Component<Props> {

  createHeaderText() {
    const { plan, headerText } = this.props;
    if (headerText) {
      return headerText;
    } else {
      return plan ? `Pagar: ${plan.credits} ${plan.credits > 0 ? 'clases' : 'clase'} | ${Utils.getMoneyFormat(plan.price, 100, 'MX', '$0,0.00')} | Vigencia ${plan.expires_numbers} ${this.getUnitsFromExpireUnit(plan.expires_unit)}` : 'Sin plan seleccionado';
    }
  }

  getUnitsFromExpireUnit(expire_unit: string) {
    switch (expire_unit) {
      case 'days':
        return 'días';
      case 'months':
        return 'meses';
      case 'years':
        return 'años';
      default:
        return 'días';
    }
  }

  handleCancel = () => {
    if (this.props.onCancel) {
      this.props.onCancel();
    }
  }

  render() {
    return (
      <div className='modal_header'>
        <Row>
          <Col xs={12} lg={10}>
            {this.createHeaderText()}
          </Col>
          <Col xs={12} lg={2}>
            <button className='modal_header__cancel' onClick={this.handleCancel}>Cancelar</button>
          </Col>
        </Row>
      </div>
    )
  }
}

export default Header;