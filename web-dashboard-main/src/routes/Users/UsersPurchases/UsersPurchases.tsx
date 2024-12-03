import React, { Component } from "react";
import { Purchase } from "../../../api/Purchases/Purchases";
import PurchaseService from "../../../api/Purchases/index";
import { Table, Button, OverlayTrigger, Tooltip, Form, Badge } from "react-bootstrap";
import Pagination from "../../../shared/AppPagination";
import "./Purchases.scss";
import Overlay from "../../../shared/ovelay/index";
import Alert from "../../../shared/alert/index";
import Icon from "@mdi/react";
import { mdiBookInformationVariant } from "@mdi/js";
import HorizontalLine from '../../../shared/HorizontalLine/HorizontalLine';
import '../../../utils/custom.scss';
import { match, RouteComponentProps } from "react-router-dom";
import InfoModal from './InfoModal/index';
import Return from '../../../shared/ReturnBtn';
import Loader from "../../../shared/Loader";
import { DefaultRouteContext } from '../../../contexts/RouteContext/RouteContext'
import withRouteContext from "../../../contexts/RouteContext/withRouterContext";

type Props = RouteComponentProps<any> & {
    match: match<string>;
    routeContext?: DefaultRouteContext;
    location?: any;
};

interface status {
    name: string,
    value: string
}

const opFilter: status[] = [{ name: 'Todos', value: '' }, { name: 'Pagado', value: 'paid' }, { name: 'Cancelado', value: 'canceled' }, { name: 'Declinado', value: 'declined' }];

type State = {
    purchases: Purchase[] | undefined;
    loading: boolean;
    error: boolean;
    message: string;
    alertVariant: string;
    pages: number;
    perPage: number;
    activePage: number;
    id: number | null;
    showPurchaseInfo: boolean;
    targetPurchaseId: number | undefined;
    userId: number | undefined;
    userName: string | undefined;
    showPagination: boolean;
    filterBy: string;
    orderBy: string;
};

class UsersPurchases extends Component<Props, State> {
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
            activePage: 0,
            id: null,
            showPurchaseInfo: false,
            targetPurchaseId: undefined,
            userId: undefined,
            userName: undefined,
            showPagination: false,
            filterBy: '',
            orderBy: ''
        };
        this.showAlert = this.showAlert.bind(this);
        this.closeAlert = this.closeAlert.bind(this);
        this.onPaginationClick = this.onPaginationClick.bind(this);
    }

    async componentDidMount() {
        try {
            this.setState({ loading: true });
            const { userId } = this.props.match.params;
            const { name } = this.props.location.state;
            if (name) {
                this.setState({ userName: name.toUpperCase() });
                this.setState({ userId }, async () => { await this.getPurchases(this.state.perPage, this.state.activePage) });
            }
            this.setState({ loading: false });
        } catch (error) {
            this.setState({ error: true, message: 'Error cargando las compras del usuario', alertVariant: 'error', loading: false })
        }

    }

    showInfo = (e: any) => {
        const id = e.currentTarget.value;
        this.setState({ showPurchaseInfo: true, targetPurchaseId: id });
    };

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
        if (this.state.purchases)
            return this.state.purchases.map(purchase => {
                const {
                    id,
                    plan_name,
                    paid,
                    card_last4,
                    user,
                    currency,
                    auth_code,
                    status
                } = purchase;
                return (
                    <React.Fragment>
                        {purchase && plan_name &&
                            <tr>
                                <td>{plan_name}</td>
                                <td>{user.name} {user.last_name !== null ? user.last_name : ''}</td>
                                <td>
                                    {paid} {currency}
                                </td>
                                <td>{card_last4}</td>
                                <td>{auth_code}</td>
                                <td className='purchase__table__td'>{status ? this.statusBadger(purchase) : 'No disponible'}</td>
                                <td>
                                    <OverlayTrigger
                                        key={`user-purchase-info-trigger-${id}`}
                                        placement={'top'}
                                        overlay={
                                            <Tooltip id={`user-purchase-info-${id}`}>
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
                                </td>
                            </tr>}
                    </React.Fragment>
                );
            });
    }

    async getPurchases(perPage: number, pages: number) {
        try {
            if (this.state.userId) {
                this.setState({ loading: true });
                const response = await PurchaseService.findByUsrId(pages, perPage, this.state.userId, this.state.filterBy, this.state.orderBy);
                if (response) {
                    const { data, count } = response;
                    const pages = Math.ceil(count / this.state.perPage);
                    if (pages > 1) this.setState({ showPagination: true });
                    this.setState({ purchases: data, pages: pages });
                }
                this.setState({ loading: false });
            }
        } catch (error) {
            this.setState({ error: true, message: 'Error obteniendo las compras de usuario', alertVariant: 'error' });
            this.setState({ loading: false });
        }
    }

    onPaginationClick(page: number) {
        this.setState({ activePage: page });
        this.getPurchases(this.state.perPage, page);
    }

    showAlert(error: boolean, message: string, alertVariant: string) {
        this.setState({
            error: error,
            message: message,
            alertVariant: alertVariant
        });
    }

    closeAlert() {
        this.setState({ error: false });
    }

    handleInfoAler = (error: boolean, message: string, alertVariant: string) => {
        this.setState({ error, message, alertVariant });
    };

    handleInfoClose = () => {
        this.setState({ showPurchaseInfo: false });
    };

    changePaginationAmountItems = (items: number) => {
        this.setState({ perPage: items }, () => this.getPurchases(this.state.perPage, 0));
    }

    renderOptionsFilterBy = () => {
        return (
            opFilter.map(status => {
                return <option value={status.value}>{status.name}</option>
            })
        )
    }

    setFilter = (e: any) => {
        this.setState({ filterBy: e.currentTarget.value, orderBy: '' }, () =>
            this.getPurchases(this.state.perPage, this.state.pages))
    }

    printReport = async () => {
        try {
            const response = await PurchaseService.printCsvReport(this.props.location.state.userEmail, this.state.orderBy, this.state.filterBy);
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

    render() {
        return (
            <React.Fragment>
                {this.state.error && (
                    <Alert
                        message={this.state.message}
                        variant={this.state.alertVariant}
                        parentHandleClose={this.closeAlert}
                    ></Alert>
                )}
                {this.state.loading && (
                    <Overlay>
                        <Loader></Loader>
                    </Overlay>
                )}
                <div className="purchase">
                    <span className="purchase__header-row">
                        <h1 className="header-title">PAGOS DE {this.state.userName}</h1>
                    </span>
                    <div className='purchase__search-grid'>
                        <div className='purchase__search-grid__return'>
                            <Return goBackCallBack={this.props.routeContext!.returnPrevRoute}></Return>
                        </div>
                        <Form.Label className='purchase__search-grid__label'>Filtrar por</Form.Label>
                        <Form.Control className='purchase__search-grid__filter' as="select" value={this.state.filterBy} onChange={this.setFilter}>
                            {this.renderOptionsFilterBy()}
                        </Form.Control>
                        <Button className='purchase__search-grid__button' style={{ height: '40px'}} onClick={() => this.printReport()}>Imprimir reporte</Button>
                    </div>
                    <Table bordered hover>
                        <thead>
                            <tr>
                                <th className="purchase__table__th">Plan</th>
                                <th className="purchase__table__th">Nombre</th>
                                <th className="purchase__table__th">Costo</th>
                                <th className="purchase__table__th">Terminación de tarjeta</th>
                                <th className="purchase__table__th">Código de autorización</th>
                                <th className="purchase__table__th">Estatus</th>
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
                    <InfoModal show={this.state.showPurchaseInfo} id={this.state.targetPurchaseId} parentHandleClose={this.handleInfoClose} parentHandleAlert={this.handleInfoAler}></InfoModal>
                </div>
            </React.Fragment>
        );
    }
}

export default withRouteContext(UsersPurchases);
