import React, { Component } from 'react';
import PlanService, { Plan } from '../../api/Plan/Plan';
import Overlay from '../../shared/ovelay/index';
import Loader from '../../shared/Loader/index';
import Alert from '../../shared/alert/index';
import { Button, Table, OverlayTrigger, Tooltip } from 'react-bootstrap';
import Pagination from '../../shared/AppPagination';
import Modal from './CreatePlanModal/index';
import './Plans.scss';
import HorizontalLine from '../../shared/HorizontalLine/HorizontalLine';
import StatusModal from './StatusModal/index';
import EditPlanModal from './EditPlanModal/index';
import { PlansArrayResponse } from '../../api/Plan/Plan';
import Icon from '@mdi/react';
import { mdiTableEdit, mdiCellphone, mdiWeb, mdiTrashCanOutline } from '@mdi/js';
import { withRouterContext } from '../../contexts/RouteContext';
import { DefaultRouteContext } from "../../contexts/RouteContext/RouteContext";
import { RouteComponentProps } from "react-router";
import LessonTypeService from '../../api/LessonType';
import { LessonType } from '../../api/LessonType/LessonType';
import StudioService, { Studio } from '../../api/Studio/Studio';


type Props = RouteComponentProps & {
  routeContext?: DefaultRouteContext;
}

type State = {
  plans: Plan[] | null;
  studios: Studio[];
  error: boolean;
  message: string;
  alertVariant: string;
  loading: boolean;
  showModal: boolean;
  activePage: number;
  perPage: number;
  pages: number;
  targetPlan: Plan | undefined;
  showRemoveModal: boolean;
  showEditModal: boolean;
  showPagination: boolean;
  statusSelectedPlan: boolean | undefined;
  remove: boolean;
  statusType?: 'active' | 'active_mobile';
  lessonTypes: LessonType[];
}

class Plans extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      plans: [],
      studios: [],
      error: false,
      message: '',
      alertVariant: '',
      loading: false,
      showModal: false,
      pages: 0,
      activePage: 1,
      perPage: 6,
      targetPlan: undefined,
      showRemoveModal: false,
      showEditModal: false,
      showPagination: false,
      statusSelectedPlan: undefined,
      remove: false,
      statusType: undefined,
      lessonTypes: [],
    }
  }

  componentDidMount = async () => {
    this.getPlans(this.state.perPage, this.state.activePage);
    this.getLessonTypes();
    this.getStudios();
  }

  onPaginationClick = (page: number) => {
    this.setState({ activePage: page }, () => { this.getPlans(this.state.perPage, this.state.activePage) });
  }

  getStudios = async () => {
    try {
      const response = await StudioService.find();
      if (response) {
        this.setState({ studios: response });
      }
    } catch (error) {
      this.setState({ error: true, message: 'Error al cargal los planes', alertVariant: 'error', loading: false });
    }
  }

  getLessonTypes = async () => {
    try {
      const response = await LessonTypeService.list();
      this.setState({ lessonTypes: response });
    } catch (error) {
      this.setState({ error: true, message: 'Error al cargal los planes', alertVariant: 'error', loading: false });
    }
  }

  getPlans = async (perPage: number, page: number = 1) => {
    try {
      this.setState({ loading: true, plans: [] });
      const plansData:
        | PlansArrayResponse
        | String = await PlanService.find(perPage, page);
      if (typeof plansData !== 'string') {
        const { plans, count } = plansData as PlansArrayResponse;
        const pages = Math.ceil(count / this.state.perPage);
        if (pages > 1) this.setState({ showPagination: true });
        this.setState({ plans: plans, pages: pages });
      } else {
        this.setState({ error: true, message: plansData, alertVariant: 'warning', loading: false });
      }
      this.setState({ loading: false });
    } catch (error) {
      this.setState({ error: true, message: 'Error al cargal los planes', alertVariant: 'error', loading: false });
    }
  }

  closeAlert = () => {
    this.setState({ error: false });
  }

  closeModal = () => {
    this.setState({ showModal: false });
  }

  editAction = (e: any) => {
    const id = e.currentTarget.value;
    if (this.state.plans) {
      const planSelected: Plan | undefined = this.state.plans.find(plan => {
        return plan.id === parseInt(id);
      });
      this.setState({ targetPlan: planSelected }, () => { this.setState({ showEditModal: true }) });
    }
  }

  changeActive = (e: any, statusType: 'active' | 'active_mobile') => {
    const id = e.currentTarget.value;
    if (this.state.plans) {
      const planSelected: Plan | undefined = this.state.plans.find(plan => {
        return plan.id === parseInt(id);
      });
      this.setState({ targetPlan: planSelected }, () => { this.setState({ showRemoveModal: true, statusType }) });
    }
  }

  handleCloseRemove = () => {
    this.getPlans(this.state.perPage, this.state.activePage);
    this.setState({ showRemoveModal: false, remove: false });
    this.resetTargetPlan();
  }

  resetTargetPlan = () => {
    this.setState({ targetPlan: undefined });
  }

  showAlert = () => {
    this.setState({ error: true });
  }

  handleAlert = (error: boolean, message: string, alertVariant: string) => {
    this.setState({ error, message, alertVariant });
  }

  handleCloseEdit = () => {
    this.setState({ showEditModal: false });
    this.resetTargetPlan();
  }

  handleLoadPlans = () => {
    this.getPlans(this.state.perPage, this.state.activePage);
  }

  removeAction = (e: any) => {
    const id = e.currentTarget.value;
    if (this.state.plans) {
      const planSelected: Plan | undefined = this.state.plans.find(plan => {
        return plan.id === parseInt(id);
      });
      this.setState({ targetPlan: planSelected, remove: true }, () => { this.setState({ showRemoveModal: true }) });
    }
  }

  renderPlans = () => {
    if (this.state.plans)
      return this.state.plans.map(plan => {
        const { id, name, price, credits, expires_numbers, expires_unit, special, active, active_mobile, credit_type } = plan;
        return (
          <tr>
            <td>{name}</td>
            <td>{price} MXN</td>
            <td>{credit_type === 'classic' ? 'Presencial' : 'Online'}</td>
            <td>{credits}</td>
            <td>{expires_numbers} {expires_unit === 'days' ? 'días' : expires_unit === 'months' ? 'meses' : expires_unit === 'years' ? 'años' : ''}</td>
            <td>{special ? 'Si' : 'No'}</td>
            <td>
              <div className='plans__table__buttons'>
                <OverlayTrigger
                  key={`plan-trigger-${id}`}
                  placement={'top'}
                  overlay={
                    <Tooltip id={`plan-tooltip-${id}`}>
                      Editar plan
                                        </Tooltip>
                  }
                >
                  <button value={id} onClick={this.editAction}>
                    <Icon
                      path={mdiTableEdit}
                      size={1}
                      color={'#10a500'}
                    /></button>
                </OverlayTrigger>
                <OverlayTrigger
                  key={`activate-plan-trigger-${id}`}
                  placement={'top'}
                  overlay={
                    <Tooltip id={`activate-plan-tooltip-${id}`}>
                      {active ? 'Desactivar plan en web' : 'Activar plan en web'}
                    </Tooltip>
                  }
                >
                  <button value={id} onClick={(e: any) => this.changeActive(e, 'active')}>
                    {active ?
                      <Icon
                        path={mdiWeb}
                        size={1}
                        color={'#a50000'} /> :
                      <Icon
                        path={mdiWeb}
                        size={1}
                        color={'#10a500'} />
                    }
                  </button>
                </OverlayTrigger>
                <OverlayTrigger
                  key={`activate-plan-trigger-${id}`}
                  placement={'top'}
                  overlay={
                    <Tooltip id={`activate-plan-tooltip-${id}`}>
                      {active_mobile ? 'Desactivar plan en app' : 'Activar plan en app'}
                    </Tooltip>
                  }
                >
                  <button value={id} onClick={(e: any) => this.changeActive(e, 'active_mobile')}>
                    {active_mobile ?
                      <Icon
                        path={mdiCellphone}
                        size={1}
                        color={'#a50000'} /> :
                      <Icon
                        path={mdiCellphone}
                        size={1}
                        color={'#10a500'} />
                    }
                  </button>
                </OverlayTrigger>
                <OverlayTrigger
                  key={`remove-trigger-${id}`}
                  placement={'top'}
                  overlay={
                    <Tooltip id={`remove-tooltip-${id}`}>
                      Borrar plan
                                        </Tooltip>
                  }
                >
                  <button value={id} onClick={this.removeAction}>
                    <Icon
                      path={mdiTrashCanOutline}
                      size={1}
                      color={'#ff0000'}
                    /></button>
                </OverlayTrigger>
              </div>
            </td>
          </tr>
        );
      });
  }

  changePaginationAmountItems = (items: number) => {
    this.setState({ perPage: items }, () => this.getPlans(this.state.perPage, 0));
  }

  render() {
    const { lessonTypes, studios } = this.state;
    return (
      <React.Fragment>
        {this.state.loading && (
          <Overlay>
            <Loader></Loader>
          </Overlay>
        )}
        {this.state.error && (
          <Alert
            message={this.state.message}
            variant={this.state.alertVariant}
            parentHandleClose={this.closeAlert}
          ></Alert>
        )}
        <div className="plans">
          <div className="plans__header-row">
            <h1 className="header-title">PLANES</h1>
          </div>
          <div className='plans__search-grid'>
            <Button className='plans__search-grid__new-plan' onClick={() => this.setState({ showModal: true })}>
              Nuevo
                        </Button>
          </div>
          <Table className="plans__table" bordered hover>
            <thead>
              <tr>
                <th className="plans__table__th">Nombre</th>
                <th className="plans__table__th">Precio</th>
                <th className="plans__table__th">Tipo de créditos</th>
                <th className="plans__table__th">Créditos</th>
                <th className="plans__table__th">Expiración</th>
                <th className="plans__table__th">Especial</th>
                <th className="plans__table__th">Acciones</th>
              </tr>
            </thead>
            <tbody>{this.renderPlans()}</tbody>
          </Table>
          <HorizontalLine></HorizontalLine>

          <div className="plans__pagination">
            {
              <Pagination
                itemsAmount={this.changePaginationAmountItems}
                pages={this.state.pages}
                active={this.state.activePage}
                onClick={this.onPaginationClick}
              ></Pagination>
            }
          </div>

          <Modal
            studios={studios}
            lessonTypes={lessonTypes}
            show={this.state.showModal}
            parentHandleClose={this.closeModal}
            parentHandleAlert={this.handleAlert}
            parentHandleLoad={this.handleLoadPlans}
          ></Modal>
        </div>
        {this.state.targetPlan &&
          <StatusModal
            show={this.state.showRemoveModal}
            type={this.state.statusType}
            status={this.state.targetPlan.active}
            statusMobile={this.state.targetPlan.active_mobile}
            id={this.state.targetPlan!.id as number}
            name={this.state.targetPlan!.name}
            remove={this.state.remove}
            parentLeveClose={this.handleCloseRemove}
            parentLevelAlert={this.handleAlert}
          ></StatusModal>
        }
        {this.state.targetPlan &&
          <EditPlanModal
            studios={studios}
            lessonTypes={lessonTypes}
            show={this.state.showEditModal}
            plan={this.state.targetPlan}
            parentHandleAlert={this.handleAlert}
            parentHandleClose={this.handleCloseEdit}
            parentHandleLoad={this.handleLoadPlans}
          ></EditPlanModal>
        }
      </React.Fragment>
    )
  }
}

export default withRouterContext(Plans);