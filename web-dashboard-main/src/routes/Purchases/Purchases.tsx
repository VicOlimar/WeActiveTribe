import React, { Component } from "react";
import { Purchase } from "../../api/Purchases/Purchases";
import PurchaseService from "../../api/Purchases/index";
import { Table, Badge, Modal, Button, Form, InputGroup, OverlayTrigger, Tooltip, Row, Col } from "react-bootstrap";
import Pagination from "../../shared/AppPagination";
import "./Purchases.scss";
import Overlay from "../../shared/ovelay/index";
import Loader from "../../shared/Loader/index";
import Alert from "../../shared/alert/index";
import InfoModal from "./InfoModal/index";
import { mdiBookInformationVariant, mdiDeleteForeverOutline, mdiPrinter } from "@mdi/js";
import HorizontalLine from '../../shared/HorizontalLine/HorizontalLine';
import '../../utils/custom.scss';
import moment from 'moment-timezone';
import { withRouterContext } from '../../contexts/RouteContext';
import { DefaultRouteContext } from "../../contexts/RouteContext/RouteContext";
import { RouteComponentProps } from "react-router";
import Icon from "@mdi/react";
import { mdiSortAscending, mdiSortDescending } from '@mdi/js';
import PlanService, { Plan, PlansArrayResponse } from '../../api/Plan/Plan';
import DatePicker from 'react-datepicker';
import '../../../node_modules/react-datepicker/dist/react-datepicker.min.css';
import '../../../node_modules/react-datepicker/dist/react-datepicker-cssmodules.min.css';

const DATE_FORMAT = 'D [de] MMMM [-] [de] YYYY h:mm A';

interface status {
  name: string,
  value: string
}

const opFilter: status[] = [{ name: 'Todos', value: '' }, { name: 'Pagado', value: 'paid' }, { name: 'Cancelado', value: 'canceled' }, { name: 'Declinado', value: 'declined' }];

type Props = RouteComponentProps & {
  routeContext?: DefaultRouteContext;
  location?: any;
};
type State = {
  purchases: Purchase[] | undefined;
  loading: boolean;
  error: boolean;
  message: string;
  alertVariant: string;
  pages: number;
  perPage: number;
  activePage: number;
  showPurchaseInfo: boolean;
  targetPurchaseId: number | undefined;
  showPagination: boolean;
  selectedChargeId: number | undefined;
  showCancel: boolean;
  searchEmail: string;
  filterBy: string;
  orderBy: string;
  plans: Plan[];
  filterByPlan: string;
  startDate?: Date;
  endDate?: Date;
};

class Purchases extends Component<Props, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      purchases: undefined,
      loading: true,
      error: false,
      message: "",
      alertVariant: "",
      pages: 0,
      perPage: 6,
      activePage: 1,
      showPurchaseInfo: false,
      targetPurchaseId: undefined,
      showPagination: false,
      selectedChargeId: undefined,
      showCancel: false,
      searchEmail: '',
      filterBy: '',
      orderBy: '',
      plans: [],
      filterByPlan: '',
      startDate: undefined,
      endDate: undefined,
    };
  }

  async componentDidMount() {
    if (this.props.location.state && this.props.location.state.searchEmail) {
      this.setState({ searchEmail: this.props.location.state.searchEmail }, () => this.getPurchases(this.state.perPage, this.state.activePage))
    } else {
      await this.getPurchases(this.state.perPage, this.state.activePage);
    }
    try {
      const plans: PlansArrayResponse | string = await PlanService.find(100, 1);
      if (typeof plans !== 'string') {

        let arrayOfPlans: Array<any> = plans.plans.map((plan) => {
          return { id: plan.id, name: plan.name }
        })
        arrayOfPlans.unshift({ id: null, name: 'Todos' });
        this.setState({ plans: arrayOfPlans });
      }
      else {
        throw new Error(plans);
      }
    } catch (err) {
      this.setState({ error: true, message: err.message, alertVariant: 'error' });
    }
  }

  showInfo = (e: any) => {
    const id = e.currentTarget.value;
    this.setState({ showPurchaseInfo: true, targetPurchaseId: id });
  };

  cancelCharge = async () => {
    try {
      let response: any = undefined;
      this.setState({ loading: true });
      if (this.state.selectedChargeId) {
        response = await PurchaseService.cancelCharge(this.state.selectedChargeId);
      }
      if (response) {
        this.setState({ error: true, message: 'La cancelación del cargo se realizó correctamente', alertVariant: 'success' });
        this.setState({ loading: false });
        this.getPurchases(this.state.perPage, this.state.pages);
        this.closeCancelModal();
      }
      else {
        throw new Error('Error cancelando cargo');
      }
    } catch (error) {
      this.setState({ error: true, message: error.message, alertVariant: 'error' });
      this.setState({ loading: false });
    }
  };

  showCancelModal = (e: any) => {
    const id = e.currentTarget.value;
    this.setState({ selectedChargeId: id, showCancel: true });
  }

  showPrint = (e: any) => {
    const id = e.currentTarget.value;
    this.props.history.push(`/purchases/${id}/ticket`, { searchEmail: this.state.searchEmail });
  }

  statusBadger = (purchase: Purchase) => {
    var { status, error_code } = purchase
    if (error_code) {
      switch (error_code) {
        case 'card_declined':
          error_code = 'Tarjeta declinada';
          break;
        case 'insufficient_funds':
          error_code = 'Fondos insuficientes';
          break;
        case 'stolen_card':
          error_code = 'Tarjeta robada o no activada';
          break;
      }
    }
    error_code = error_code ? `(${error_code})` : '';
    switch (status) {
      case 'paid':
        return (
          <Badge variant="success">Pagado {error_code}</Badge>
        );
      case 'canceled':
        return (
          <Badge variant="danger">Cancelado {error_code}</Badge>
        );
      case 'rejected':
        return (
          <Badge variant="warning">Rechazado {error_code}</Badge>
        );
      default:
        return (
          <Badge variant="warning">Error: {error_code}</Badge>
        )
    }
  }

  renderPurchases() {
    if (this.state.purchases) {
      let purchases = this.state.purchases;

      return purchases.map(purchase => {
        const {
          id,
          plan_name,
          paid,
          card_last4,
          user,
          auth_code,
          status,
          created_at,
          expires_at,
          total_credits
        } = purchase;
        return (
          <tr>
            <td className='purchase__table__td'>{plan_name !== null ? plan_name : 'Cortesía'}</td>
            <td className='purchase__table__td'>{user ? user.name ? `${user.name} ${user.last_name !== null ? user.last_name : ''}` : '' : 'No disponible'}</td>
            <td className='purchase__table__td'>{user ? user.email ? user.email : 'No disponible' : 'No disponible'}</td>
            <td className='purchase__table__td'>$ {paid ? paid : 'No disponible'}</td>
            <td className='purchase__table__td'>{card_last4 ? card_last4 : 'No disponible'}</td>
            <td className='purchase__table__td'>{auth_code ? auth_code : 'No disponible'}</td>
            <td className='purchase__table__td'>{status ? this.statusBadger(purchase) : 'No disponible'}</td>
            <td className='purchase__table__td'>{total_credits}</td>
            <td className='purchase__table__td'>{created_at ? moment(created_at).utcOffset("-06:00").format(DATE_FORMAT) : ''}</td>
            <td className='purchase__table__td'>{expires_at ? moment(expires_at).utcOffset("-06:00").format(DATE_FORMAT) : ''}</td>
            <td className='purchase__table__td'>
              <span className='purchase__table__buttons'>
                <OverlayTrigger
                  key={`purchase-info-trigger-${id}`}
                  placement={'top'}
                  overlay={
                    <Tooltip id={`purchase-info-tooltip-${id}`}>
                      Información de pago
                  </Tooltip>
                  }
                >
                  <button value={id} onClick={this.showInfo}>
                    <Icon
                      path={mdiBookInformationVariant}
                      size={1}
                      color="#141010"
                    />
                  </button>
                </OverlayTrigger>
                <OverlayTrigger
                  key={`purchase-print-trigger-${id}`}
                  placement={'top'}
                  overlay={
                    <Tooltip id={`purchase-print-tooltip-${id}`}>
                      Imprimir ticket
                  </Tooltip>
                  }
                >
                  <button value={id} onClick={this.showPrint}>
                    <Icon
                      path={mdiPrinter}
                      size={1}
                      color="#016d00"
                    />
                  </button>
                </OverlayTrigger>
                <OverlayTrigger
                  key={`purchase-cancel-trigger-${id}`}
                  placement={'top'}
                  overlay={
                    <Tooltip id={`purchase-cancel-tooltip-${id}`}>
                      Cancelar pago
                  </Tooltip>
                  }
                >
                  <button value={id} onClick={this.showCancelModal}>
                    <Icon
                      path={mdiDeleteForeverOutline}
                      size={1}
                      color="#ff0000"
                    />
                  </button>
                </OverlayTrigger>
              </span>
            </td>
          </tr>
        );
      });
    }
  }

  async getPurchases(perPage: number, pages: number, load: boolean = true) {
    const { startDate, endDate } = this.state;
    try {
      if (load) this.setState({ loading: true });
      const response = await PurchaseService.find(
        isNaN(pages) ? 1 : pages,
        perPage,
        this.state.searchEmail,
        this.state.filterBy,
        this.state.filterByPlan,
        this.state.orderBy,
        startDate,
        endDate
      );

      if (response) {
        const { data, count } = response;
        const pages = Math.ceil(count / this.state.perPage);
        if (pages > 1) this.setState({ showPagination: true });
        else this.setState({ showPagination: false });
        this.setState({ purchases: data, pages: pages });
      }
      this.setState({ loading: false });
    } catch (error) {
      this.setState({
        error: true,
        alertVariant: "error",
        message: error.message,
        loading: false
      });
    }
  }

  onPaginationClick = (page: number) => {
    this.setState({ activePage: page }, () => this.getPurchases(this.state.perPage, page));
  }

  showAlert = (error: boolean, message: string, alertVariant: string) => {
    this.setState({
      error: error,
      message: message,
      alertVariant: alertVariant
    });
  }

  closeAlert = () => {
    this.setState({ error: false });
  }

  handleInfoAlert = (error: boolean, message: string, alertVariant: string) => {
    this.setState({ error, message, alertVariant });
  };

  handleInfoClose = () => {
    this.setState({ showPurchaseInfo: false });
  };

  closeCancelModal = () => {
    this.setState({ showCancel: false });
  }

  onSearchEmail = (event: any) => {
    this.setState({ searchEmail: event!.target.value });
  }

  searchCharges = () => {
    this.getPurchases(this.state.perPage, this.state.pages, false);
  }

  changePaginationAmountItems = (items: number) => {
    this.setState({ perPage: items }, () => this.getPurchases(this.state.perPage, 0));
  }
  printReport = async () => {
    const { startDate, endDate } = this.state;
    try {
      const response = await PurchaseService.printCsvReport(
        this.state.searchEmail,
        this.state.orderBy,
        this.state.filterBy,
        this.state.filterByPlan,
        startDate,
        endDate
      );
      if (typeof response === 'number') {
        if (response === 200) {
          this.setState({ error: true, message: 'Descargando...', alertVariant: 'success' });
        }
      } else {
        this.setState({ error: true, message: 'Algo salió mal', alertVariant: 'warning' });
      }
    } catch (error) {
      this.setState({ error: true, message: 'Error descargando el archivo', alertVariant: 'error' });
    }
  }

  renderOptionsFilterBy = () => {
    return (
      opFilter.map(status => {
        return <option value={status.value}>{status.name}</option>
      })
    )
  }

  renderPlanOptionsFilterBy = () => {
    return (
      this.state.plans.map(plan => {
        return <option value={plan.name}>{plan.name}</option>
      })
    )
  }

  setFilter = (e: any) => {
    this.setState({ filterBy: e.currentTarget.value, orderBy: '', pages: 0 }, () =>
      this.getPurchases(this.state.perPage, this.state.pages, true))
  }

  setFilterByPlan = (e: any) => {
    if (e.currentTarget.value === "Todos") {
      e.currentTarget.value = null
    }
    this.setState({ filterByPlan: e.currentTarget.value, pages: 0 }, () =>
      this.getPurchases(this.state.perPage, this.state.pages, true))
  }

  setOrder = (e: any, type: string) => {
    var order: string[] = [];
    if (this.state.orderBy.includes(type)) {
      order = this.state.orderBy.split(',');
      if (order[1] === 'DESC') order[1] = 'ASC';
      else order[1] = 'DESC';
      type = order.toString();
    } else {
      type = `${type},DESC`;
    }
    this.setState({ orderBy: type, pages: 0 }, () =>
      this.getPurchases(this.state.perPage, this.state.pages, true))
  }

  setOrderIcon = () => {
    const order = this.state.orderBy.split(',')[1];
    if (order === 'ASC') {
      return <Icon
        path={mdiSortAscending}
        size={1}
        color="gray" />
    } else {
      return <Icon
        path={mdiSortDescending}
        size={1}
        color="gray" />
    }
  }

  getOrderType = (actualType: string) => {
    const type: string = this.state.orderBy.split(',')[0];
    if (actualType === type) return this.setOrderIcon();
  }

  onStartDateChange = (date: Date) => {
    // range is a moment-range object
    this.setState({
      startDate: date,
    }, () => this.getPurchases(this.state.perPage, this.state.activePage, false));
  }

  onEndtDateChange = (date: Date) => {
    // range is a moment-range object
    this.setState({
      endDate: date,
    }, () => this.getPurchases(this.state.perPage, this.state.activePage, false));
  }

  render() {
    const { endDate, startDate } = this.state;

    return (
      <React.Fragment>
        {this.state.error && (
          <Alert
            message={this.state.message}
            variant={this.state.alertVariant}
            parentHandleClose={this.closeAlert}
          ></Alert>
        )}
        {
          this.state.loading && (
            <Overlay>
              <Loader></Loader>
            </Overlay>
          )}
        <div className="purchase">
          <div className="purchase__header-row">
            <h1 className="header-title">PAGOS</h1>
          </div>
          <Row>
            <Col xs={12}>
              <Form.Group className='purchase__search-grid__email' style={{ padding: '0px', margin: '0px' }} controlId="validationFormikUsername">
                <InputGroup>
                  <Form.Control
                    type="email"
                    placeholder="Escriba un email o nombre"
                    aria-describedby="Búsqueda por correo"
                    name="search_email"
                    value={this.state.searchEmail}
                    onChange={this.onSearchEmail}
                  />
                  <InputGroup.Append>
                    <Button variant="primary" onClick={this.searchCharges}>Buscar</Button>
                  </InputGroup.Append>
                </InputGroup>
              </Form.Group>
            </Col>
            <Col>
              <Form.Label className="purchase__search-grid__label">Filtrar por estatus</Form.Label>
              <Form.Control className='purchase__search-grid__filter' as="select" value={this.state.filterBy as string} onChange={this.setFilter}>
                {this.renderOptionsFilterBy()}
              </Form.Control>

            </Col>
            <Col>
              <Form.Label className="purchase__search-grid__label2">Filtrar por plan</Form.Label>
              <Form.Control className='purchase__search-grid__filter2' as="select" value={this.state.filterByPlan as string} onChange={this.setFilterByPlan}>
                {this.renderPlanOptionsFilterBy()}
              </Form.Control>
            </Col>
            <Col>
              <Form.Label className="purchase__search-grid__label2">Fecha de inicio</Form.Label>
              <br/>
              <DatePicker selected={startDate} onChange={this.onStartDateChange} />
            </Col>
            <Col>
              <Form.Group>
                <Form.Label className="purchase__search-grid__label2">Fecha de fin</Form.Label>
                <br/>
                <DatePicker selected={endDate} onChange={this.onEndtDateChange} />
              </Form.Group>
            </Col>
          </Row>
          <Row>
            <Col className='text-left'>
              <Button className='purchase__search-grid__print-report' style={{ height: '40px' }} onClick={() => this.printReport()}>Imprimir reporte</Button>
            </Col>
          </Row>
          <Table bordered hover responsive style={{ marginTop: 20 }}>
            <thead>
              <tr>
                <th style={{ cursor: 'pointer' }} onClick={(e: any) => this.setOrder(e, 'plan')} className="purchase__table__th"><span className='purchase__table__th__row'>Plan    {this.getOrderType('plan')}</span></th>
                <th style={{ cursor: 'pointer' }} onClick={(e: any) => this.setOrder(e, 'name')} className="purchase__table__th"><span className='purchase__table__th__row'>Nombre  {this.getOrderType('name')}</span></th>
                <th style={{ cursor: 'pointer' }} onClick={(e: any) => this.setOrder(e, 'email')} className="purchase__table__th"><span className='purchase__table__th__row'>Correo {this.getOrderType('email')}</span></th>
                <th style={{ cursor: 'pointer' }} onClick={(e: any) => this.setOrder(e, 'paid')} className="purchase__table__th"><span className='purchase__table__th__row'>Monto   {this.getOrderType('paid')}</span></th>
                <th className="purchase__table__th">Terminación de tarjeta</th>
                <th className="purchase__table__th">Código de autorización</th>
                <th className="purchase__table__th">Estatus</th>
                <th style={{ cursor: 'pointer' }} onClick={(e: any) => this.setOrder(e, 'total_credits')} className="purchase__table__th"><span className='purchase__table__th__row'>Créditos         {this.getOrderType('total_credits')}</span></th>
                <th style={{ cursor: 'pointer' }} onClick={(e: any) => this.setOrder(e, 'processed_at')} className="purchase__table__th"><span className='purchase__table__th__row'>Fecha de pago     {this.getOrderType('processed_at')}</span></th>
                <th style={{ cursor: 'pointer' }} onClick={(e: any) => this.setOrder(e, 'expires_at')} className="purchase__table__th"><span className='purchase__table__th__row'>Fecha de expiración {this.getOrderType('expires_at')}</span></th>
                <th className="purchase__table__th">Acciones</th>
              </tr>
            </thead>
            <tbody>{this.renderPurchases()}</tbody>
          </Table>
          <HorizontalLine></HorizontalLine>
          <div className="purchase__pagination">
            {
              <Pagination
                itemsAmount={this.changePaginationAmountItems}
                pages={this.state.pages}
                active={this.state.activePage}
                onClick={this.onPaginationClick}
              ></Pagination>
            }
          </div>
        </div>
        <InfoModal
          id={this.state.targetPurchaseId}
          parentHandleClose={this.handleInfoClose}
          parentHandleAlert={this.handleInfoAlert}
          show={this.state.showPurchaseInfo}
        ></InfoModal>

        <Modal show={this.state.showCancel} onHide={this.closeCancelModal}>
          <Modal.Header>
            <Modal.Title>Cancelar pago</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            ¿Desea cancelar el pago?
            <div className='purchase__modal__button-row'>
              <Button variant='secondary' onClick={this.closeCancelModal}>Cerrar</Button>
              <Button variant='primary' onClick={this.cancelCharge}>Aceptar</Button>
            </div>
          </Modal.Body>
        </Modal>

      </React.Fragment>
    );
  }
}

export default withRouterContext(Purchases);
