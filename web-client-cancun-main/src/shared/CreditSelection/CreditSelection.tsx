import React, { Fragment } from 'react';
import { Col, Row } from 'react-bootstrap';
import './CreditSelection.scss';
import CreditDescription from './components/CreditDescription';
import Divider from './../../shared/Divider';
import { chunkArray } from '../../utils/arrayUtils';
import { Plan } from '../../api/Plan/Plan';
import Footer from '../Footer';
import Loader from '../Loader';
import WE_RIDE_BG from './assets/we-ride-bg.jpg';
import WE_HIIT_BG from './assets/we-hiit-bg.png';
import CLOSE from './assets/close.png';

function displayPlans(plans: Array<Plan>, onClick?: Function) {
  return plans.map((plan, index) => <Col className='no-padding' lg={{ span: 2, offset: index === 0 ? 2 : 0 }} md={12} xs={12} key={index}>
    {
      plan && <CreditDescription plan={plan} onClick={onClick} />
    }
  </Col>);
}

const DividerRow = () => {
  return (
    <Row className='no-margin'>
      <Col className=''>
        <Divider noPadding={true} style={{ paddingTop: '7rem' }} />
      </Col>
    </Row>
  );
}

type Props = {
  title?: String,
  subtitle?: String,
  description?: String,
  plans: Array<Plan>,
  onClick?: Function,
  loading?: boolean,
  showFooter?: boolean,
  showClose?: boolean,
  onClose?: Function,
  isDefaultBackground?: boolean
};

const CreditSelection = ({ title, subtitle, description, plans, onClick, loading = false, showFooter = true, showClose = false, onClose = () => { }, isDefaultBackground = false }: Props) => {
  const defaultBackground = 'linear-gradient(to bottom, rgba(0, 0, 0, 0.71), rgba(0, 0, 0, 0.71)), linear-gradient(45deg, #ed1a59, #c10c90, #944e9e 49%, #4067b1)'
  // We prepare the plans
  plans = plans.sort((a: Plan, b: Plan) => {
    if (a.special && !b.special) {
      return -1;
    }
    if (!a.special && b.special) {
      return 1;
    }
    if (!a.special && !b.special && a.credits < b.credits) {
      return -1;
    }
    return 0;
  });
  const chunkPlans = chunkArray(plans, 4, true);


  const style = { backgroundImage: isDefaultBackground ? defaultBackground : `url(${window.location.href.includes('we-ride') ? WE_RIDE_BG : WE_HIIT_BG})` };
  return (
    <div className='credit-selection' style={style}>
      {
        showClose && <button onClick={() => onClose()} className='credit-selection__close'><img src={CLOSE} alt='close' /></button>
      }
      <Row>
        <Col>
          <h1 className='credit-selection__main-title'>{title}</h1>
          <h2 className='credit-selection__subtitle'>{subtitle}</h2>
          <h3 className='credit-selection__description'>{description}</h3>
        </Col>
      </Row>
      {
        !loading && plans.length === 0 && <div>
          <h4 className='credit-selection__title'>¡Ups! Parece que no tenemos planes</h4>
        </div>
      }
      {
        loading && <Loader show={loading} />
      }
      {
        chunkPlans.map((plans, index) => <Row key={index} className='credit-selection__descriptions'>
          {displayPlans(plans, onClick)}
        </Row>)
      }
      {
        showFooter && <Fragment>
          <DividerRow />
          <Footer className='credit-selection__footer' />
        </Fragment>
      }
    </div>
  )
}

export default CreditSelection;