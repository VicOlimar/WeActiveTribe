import React, { Component } from 'react';
import UserService from '../../api/Users';
import { User } from '../../api/Users/Users';
import {
  Table,
  Button,
  Row,
  Col,
  Form,
  InputGroup,
  OverlayTrigger,
  Tooltip,
} from 'react-bootstrap';
import Pagination from '../../shared/AppPagination';
import Alert from '../../shared/alert';
import Overlay from '../../shared/ovelay';
import Loader from '../../shared/Loader';
import './Users.scss';
import '../../utils/custom.scss';
import Icon from '@mdi/react';
import {
  mdiAccountRemove,
  mdiAccountPlus,
  mdiCreditCardOutline,
  mdiCashRegister,
  mdiTeach,
  mdiNumeric1BoxMultipleOutline,
  mdiPause,
  mdiPlay,
} from '@mdi/js';
import { RouteComponentProps } from 'react-router';
import HorizontalLine from '../../shared/HorizontalLine/HorizontalLine';
import ChargeModal from './ChargeModal/index';
import moment from 'moment';
import { withRouterContext } from '../../contexts/RouteContext';
import { DefaultRouteContext } from '../../contexts/RouteContext/RouteContext';
import ReduceCreditModal from './ReduceCreditModal';
import DatePicker from 'react-datepicker';

type Props = RouteComponentProps & {
  routeContext?: DefaultRouteContext;
  location?: any;
};
type State = {
  users: User[] | undefined;
  allUsers: User[] | undefined;
  loading: boolean;
  error: boolean;
  message: string;
  alertVariant: string;
  pages: number | undefined;
  perPage: number;
  activePage: number;
  userId: number | undefined;
  showPagination: boolean;
  showChargeModal: boolean;
  searchEmail: string;
  showLessonsModal: boolean;
  showQuitCreditModal: boolean;
  startDate?: Date;
  endDate?: Date;
};

class Users extends Component<Props, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      users: undefined,
      allUsers: undefined,
      loading: true,
      error: false,
      message: '',
      alertVariant: '',
      pages: undefined,
      perPage: 6,
      activePage: 0,
      userId: undefined,
      showPagination: false,
      showChargeModal: false,
      searchEmail: '',
      showLessonsModal: false,
      showQuitCreditModal: false,
    };
  }

  async componentDidMount() {
    if (this.props.location.state && this.props.location.state.searchEmail) {
      this.setState(
        { searchEmail: this.props.location.state.searchEmail },
        () => this.getUsers(this.state.perPage, this.state.activePage),
      );
    } else {
      await this.getUsers(this.state.perPage, this.state.activePage);
    }
  }

  viewCharges = (userId: any) => {
    if (this.state.users) {
      const actualUser: User | undefined = this.state.users.find((user) => {
        return user.id === userId;
      });
      if (actualUser) {
        this.props.history.push(`/users/${userId}/purchases`, {
          name: actualUser.name,
          searchEmail: this.state.searchEmail,
          userEmail: actualUser.email,
        });
      } else {
        this.setState({
          error: true,
          message: 'Error obteniendo usuario',
          alertVariant: 'error',
        });
      }
    }
  };

  viewLessons = (userId: any) => {
    if (this.state.users) {
      const actualUser: User | undefined = this.state.users.find((user) => {
        return user.id === userId;
      });
      if (actualUser) {
        this.props.history.push(`/users/${userId}/lessons`, {
          name: actualUser.name,
          searchEmail: this.state.searchEmail,
        });
      } else {
        this.setState({
          error: true,
          message: 'Error obteniendo usuario',
          alertVariant: 'error',
        });
      }
    }
  };

  activateUser = async (e: any) => {
    this.setState({ loading: true });
    const id = e.currentTarget.value;
    try {
      const update = await UserService.activate(id, true);
      if (update) {
        this.getUsers(this.state.perPage, this.state.activePage);
        this.setState({
          loading: false,
          error: true,
          message: 'Usuario activado',
          alertVariant: 'success',
        });
      } else {
        this.setState({
          loading: false,
          error: true,
          message: 'Accion no permitida',
          alertVariant: 'warning',
        });
      }
    } catch (error) {
      this.setState({
        loading: false,
        error: true,
        message: 'Error al activar usuario',
        alertVariant: 'error',
      });
    }
  };

  deactivateUser = async (e: any) => {
    this.setState({ loading: true });
    const id = e.currentTarget.value;
    try {
      const update = await UserService.activate(id, false);
      if (update) {
        this.getUsers(this.state.perPage, this.state.activePage);
        this.setState({
          loading: false,
          error: true,
          message: 'Usuario desactivado',
          alertVariant: 'success',
        });
      } else {
        this.setState({
          loading: false,
          error: true,
          message: 'Accion no permitida',
          alertVariant: 'warning',
        });
      }
    } catch (error) {
      this.setState({
        loading: false,
        error: true,
        message: 'Error al activar usuario',
        alertVariant: 'error',
      });
    }
  };

  pauseValidity = async (userId: string | number) => {
    this.setState({ loading: true });
    try {
      const update = await UserService.pauseValidity(userId);

      if (update) {
        this.getUsers(this.state.perPage, this.state.activePage);
        this.setState({
          loading: false,
          error: true,
          message: `La vigencia de ${update.name} se ha pausado con exito`,
          alertVariant: 'success',
        });
      } else {
        this.setState({
          loading: false,
          error: true,
          message: `El usurio no tiene creditos para pausar`,
          alertVariant: 'warning',
        });
      }
    } catch (error) {
      this.setState({
        loading: false,
        error: true,
        message: 'Ups algo salio mal',
        alertVariant: 'error',
      });
    }
  };

  reactivateValidity = async (userId: string | number) => {
    try {
      const update = await UserService.reactivateValidity(userId);

      if (update) {
        this.getUsers(this.state.perPage, this.state.activePage);
        this.setState({
          loading: false,
          error: true,
          message: `Se ha reactivado la vigencia de ${update.name}`,
          alertVariant: 'success',
        });
      } else {
        this.setState({
          loading: false,
          error: true,
          message: `El usuario no cuenta con creditos para reactivar.`,
          alertVariant: 'success',
        });
      }
    } catch (error) {
      this.setState({
        loading: false,
        error: true,
        message: 'Ups algo salio mal',
        alertVariant: 'error',
      });
    }
  };

  renderUsers() {
    if (this.state.users) {
      let users = this.state.users;

      return users.map((user) => {
        const {
          id,
          name,
          last_name,
          email,
          role,
          active,
          pause,
          available_credits,
          available_online_credits,
          created_at,
        } = user;

        if (!user.profile) {
          return null;
        }
        const { phone, birthdate, emergency_contact, emergency_contact_name } =
          user.profile;
        return (
          <tr key={email}>
            <td>
              {name} {last_name ? last_name : ''}
            </td>
            <td>{email}</td>
            <td>{role === 'user' ? 'Usuario' : 'Admin'}</td>
            <td>
              {birthdate
                ? moment(birthdate).format('DD/MM/YYYY')
                : 'No disponible'}
            </td>
            <td>
              {created_at
                ? moment(created_at).format('DD/MM/YYYY')
                : 'No disponible'}
            </td>
            <td>{phone ? phone : ''}</td>
            <td>{emergency_contact_name || 'No disponible'}</td>
            <td>{emergency_contact || 'No disponible'}</td>
            <td>{available_credits}</td>
            <td>{available_online_credits}</td>
            <td>
              <span className="users__table__buttons">
                <OverlayTrigger
                  key={`add-plan-trigger-${user.id}`}
                  placement={'top'}
                  overlay={
                    <Tooltip id={`add-plan-${user.id}`}>Agregar pago</Tooltip>
                  }
                >
                  <button
                    value={id}
                    onClick={() => {
                      this.setState({
                        showChargeModal: true,
                        userId: user.id as number,
                      });
                    }}
                  >
                    <Icon path={mdiCashRegister} size={1} color={'#016d00'} />
                  </button>
                </OverlayTrigger>

                <OverlayTrigger
                  key={`quit-credit-trigger-${user.id}`}
                  placement={'top'}
                  overlay={
                    <Tooltip id={`quit-credit-${user.id}`}>
                      Quitar crédito
                    </Tooltip>
                  }
                >
                  <button
                    value={id}
                    onClick={() => {
                      this.setState({
                        showQuitCreditModal: true,
                        userId: user.id as number,
                      });
                    }}
                  >
                    <Icon
                      path={mdiNumeric1BoxMultipleOutline}
                      size={1}
                      color={'#016d00'}
                    />
                  </button>
                </OverlayTrigger>

                <OverlayTrigger
                  key={`show-lessons-trigger-${user.id}`}
                  placement={'top'}
                  overlay={
                    <Tooltip id={`show-lessons-trigger-${user.id}`}>
                      Mostrar lecciones de usuario
                    </Tooltip>
                  }
                >
                  <button
                    value={id}
                    onClick={() => {
                      this.viewLessons(user.id);
                    }}
                  >
                    <Icon path={mdiTeach} size={1} color={'#016d00'} />
                  </button>
                </OverlayTrigger>

                <OverlayTrigger
                  key={`purchases-trigger-${user.id}`}
                  placement={'top'}
                  overlay={
                    <Tooltip id={`purchases-tooltip-${user.id}`}>
                      Ver compras
                    </Tooltip>
                  }
                >
                  <button value={id} onClick={() => this.viewCharges(user.id)}>
                    <Icon
                      path={mdiCreditCardOutline}
                      size={1}
                      color={'#016d00'}
                    />
                  </button>
                </OverlayTrigger>
                {!pause ? (
                  <OverlayTrigger
                    key={`pause-trigger${user.id}`}
                    placement={'top'}
                    overlay={
                      <Tooltip id={`pause-${user.id}`}>Pausar vigencia</Tooltip>
                    }
                  >
                    <button
                      value={user.id}
                      onClick={() => this.pauseValidity(user.id)}
                    >
                      <Icon path={mdiPause} size={1} color={'#016d00'} />
                    </button>
                  </OverlayTrigger>
                ) : (
                  <OverlayTrigger
                    key={`reactivate-trigger${user.id}`}
                    placement={'top'}
                    overlay={
                      <Tooltip id={`reactivate-${user.id}`}>
                        Reactivar vigencia
                      </Tooltip>
                    }
                  >
                    <button
                      value={id}
                      onClick={() => this.reactivateValidity(user.id)}
                    >
                      <Icon path={mdiPlay} size={1} color={'#016d00'} />
                    </button>
                  </OverlayTrigger>
                )}
                {active ? (
                  <OverlayTrigger
                    key={`active-trigger${user.id}`}
                    placement={'top'}
                    overlay={
                      <Tooltip id={`active-${user.id}`}>
                        Desactivar usuario
                      </Tooltip>
                    }
                  >
                    <button value={id} onClick={this.deactivateUser}>
                      <Icon
                        path={mdiAccountRemove}
                        size={1}
                        color={'#a50000'}
                      />
                    </button>
                  </OverlayTrigger>
                ) : (
                  <OverlayTrigger
                    key={user.id}
                    placement={'top'}
                    overlay={
                      <Tooltip id={`active-${user.id}`}>
                        Activar usuario
                      </Tooltip>
                    }
                  >
                    <button value={id} onClick={this.activateUser}>
                      <Icon path={mdiAccountPlus} size={1} color={'#10a500'} />
                    </button>
                  </OverlayTrigger>
                )}
              </span>
            </td>
          </tr>
        );
      });
    }
  }

  async getUsers(perPage: number, pages: number, load: boolean = true) {
    const { startDate, endDate } = this.state;
    try {
      if (load) this.setState({ loading: true });
      const usersData: any | undefined = await UserService.find(
        isNaN(pages) ? 1 : pages,
        perPage,
        this.state.searchEmail,
        startDate,
        endDate,
      );
      if (usersData) {
        let { data, count } = usersData;
        if (data.rows) {
          data = data.rows;
        }
        const pages = Math.ceil(count / this.state.perPage);
        if (pages > 1) this.setState({ showPagination: true });
        this.setState({ users: data, pages });
      }
      this.setState({ loading: false });
    } catch (error) {
      this.setState({
        error: true,
        alertVariant: 'error',
        message: (error as any).message,
        loading: false,
      });
    }
  }

  onPaginationClick = (page: number) => {
    this.setState({ activePage: page }, () =>
      this.getUsers(this.state.perPage, this.state.activePage),
    );
  };

  handleAlert = (error: boolean, message: string, alertVariant: string) => {
    this.setState({ error, message, alertVariant });
  };

  onSearchEmail = (event: any) => {
    this.setState({ searchEmail: event!.target.value });
  };

  searchUser = () => {
    this.getUsers(this.state.perPage, this.state.activePage, false);
  };

  changePaginationAmountItems = (items: number) => {
    this.setState({ perPage: items }, () =>
      this.getUsers(this.state.perPage, 0),
    );
  };

  closeChargeModal = () => {
    this.setState({ showChargeModal: false }, () =>
      this.getUsers(this.state.perPage, this.state.activePage, true),
    );
  };

  closeQuitCreditModal = () => {
    this.setState({ showQuitCreditModal: false }, () =>
      this.getUsers(this.state.perPage, this.state.activePage, true),
    );
  };

  onStartDateChange = (date: Date) => {
    // range is a moment-range object
    this.setState(
      {
        startDate: date,
      },
      () => this.getUsers(this.state.perPage, this.state.activePage, false),
    );
  };

  onEndtDateChange = (date: Date) => {
    // range is a moment-range object
    this.setState(
      {
        endDate: date,
      },
      () => this.getUsers(this.state.perPage, this.state.activePage, false),
    );
  };

  render() {
    const { endDate, startDate } = this.state;

    return (
      <div className="users">
        {this.state.error && (
          <Alert
            message={this.state.message}
            variant={this.state.alertVariant}
            parentHandleClose={() => {
              this.setState({ error: false });
            }}
          ></Alert>
        )}
        {this.state.loading && (
          <Overlay>
            <Loader></Loader>
          </Overlay>
        )}
        <div className="users__header-row">
          <h1 className="header-title">USUARIOS</h1>
        </div>
        <div className="users__search-grid">
          <Form.Group
            className="users__search-grid__email"
            style={{ padding: '0px', margin: '0px' }}
            controlId="validationFormikUsername"
          >
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
                <Button variant="primary" onClick={this.searchUser}>
                  Buscar
                </Button>
              </InputGroup.Append>
            </InputGroup>
          </Form.Group>
        </div>
        <Row>
          <Col>
            <Form.Label className="purchase__search-grid__label2">
              Fecha de inicio
            </Form.Label>
            <br />
            <DatePicker
              selected={startDate}
              onChange={this.onStartDateChange}
            />
          </Col>
          <Col>
            <Form.Group>
              <Form.Label className="purchase__search-grid__label2">
                Fecha de fin
              </Form.Label>
              <br />
              <DatePicker selected={endDate} onChange={this.onEndtDateChange} />
            </Form.Group>
          </Col>
        </Row>
        <Row>
          <Col style={{ padding: '0px' }}>
            <Table className="users__table" bordered hover responsive>
              <thead className="users__table-header">
                <tr>
                  <th>Nombre</th>
                  <th>Correo electrónico</th>
                  <th>Rol</th>
                  <th>Fecha de nacimiento</th>
                  <th>Fecha de Registro</th>
                  <th>Teléfono</th>
                  <th>Nombre del contacto de emergencia</th>
                  <th>Número de emergencia</th>
                  <th>Créditos disponibles</th>
                  <th>Créditos online disponibles</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>{this.renderUsers()}</tbody>
            </Table>
            {this.state.userId && (
              <ChargeModal
                userId={this.state.userId!}
                show={this.state.showChargeModal}
                parentLevelClose={this.closeChargeModal}
                parentLevelAlert={this.handleAlert}
              ></ChargeModal>
            )}

            {this.state.userId && (
              <ReduceCreditModal
                userId={this.state.userId}
                show={this.state.showQuitCreditModal}
                parentLevelClose={this.closeQuitCreditModal}
                parentLevelAlert={this.handleAlert}
              ></ReduceCreditModal>
            )}
            <HorizontalLine></HorizontalLine>
            <div className="users__pagination">
              {
                <Pagination
                  itemsAmount={this.changePaginationAmountItems}
                  pages={this.state.pages}
                  active={this.state.activePage}
                  onClick={this.onPaginationClick}
                ></Pagination>
              }
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

export default withRouterContext(Users);
