import React, { Fragment } from 'react';
import './PlansTable.scss';
import { Col, Row, Container } from 'react-bootstrap';
import PlanCard from './PlanCard/PlanCard';
import PlanService, { Plan } from '../../api/Plan/Plan';

interface PlansState {
  plans: Plan[];
}

interface PlansProps {
}

class PlansTable extends React.Component<PlansProps, PlansState> {

  constructor (props: Readonly<PlansProps>) {
    super(props);
    this.state = {
      plans: [],
    }
  }

  async componentDidMount () {
    
  }

  async getPlans() {
    return await PlanService.find();
  }

  displayPlans() {
    return this.state.plans.map((plan) => {
      return (
        <div className="col-xs-seventh">
          <PlanCard plan={plan} />  
        </div>
      )
    })
  }

  render() {
    return (
      <Fragment>
        <Container>
          <Row>
            <Col className="planstable__title">
              <h2>Comprar Clases</h2>
              <h5>Compra el plan que mas se acomode a tu ritmo, y ¡prepárate para no parar!</h5>
            </Col>
          </Row>
        </Container>
        <Container>
          <Row className="justify-content-center">
            {this.displayPlans()}
          </Row>
        </Container>
      </Fragment>
    );
  }
}

export default PlansTable;
