import React, { Component } from 'react';
import { RouteComponentProps } from 'react-router-dom';
import { Reservation } from '../../../api/Reservation/ReservationService';
import ReservationService from '../../../api/Reservation/index';
import StudioService from '../../../api/Studio/Studio';
import { StudioWithPlaces } from '../../../api/Studio/Studio';
import UserService from '../../../api/Users/index';
import { Modal, Table, OverlayTrigger, Tooltip, Button } from 'react-bootstrap';
import Overlay from '../../../shared/ovelay';
import Alert from '../../../shared/alert';
import Return from '../../../shared/ReturnBtn';
import HorizontalLine from '../../../shared/HorizontalLine/HorizontalLine';
import Pagination from '../../../shared/AppPagination';
import './UsersReservations.scss';
import moment from 'moment-timezone';
import { Place } from '../../../api/Place/Place';
import Icon from '@mdi/react';
import { mdiCancel } from '@mdi/js';
import Loader from '../../../shared/Loader';
import { DefaultRouteContext } from '../../../contexts/RouteContext/RouteContext';
import withRouteContext from '../../../contexts/RouteContext/withRouterContext';

type Props = RouteComponentProps<any> & {
    routeContext?: DefaultRouteContext;
    location?: any;
}

type State = {
    message: string;
    alertVariant: string;
    error: boolean;
    reservations: Reservation[];
    showPagination: boolean;
    pages: number;
    activePage: number;
    userName: string;
    userId: number | undefined;
    perPage: number;
    loading: boolean;
    studios: StudioWithPlaces[];
    showCancelModal: boolean;
    reservationId: number | undefined;
}

class UserReservations extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = {
            userId: undefined,
            userName: '',
            message: '',
            alertVariant: '',
            error: false,
            reservations: [],
            showPagination: false,
            pages: 0,
            activePage: 0,
            perPage: 6,
            loading: true,
            studios: [],
            showCancelModal: false,
            reservationId: undefined
        }
    }


    async componentDidMount() {
        try {
            const { userId } = this.props.match.params;
            const { name } = this.props.location.state;
            if (name) {
                this.setState({ userName: name.toUpperCase() });
                this.setState({ userId }, async () => { await this.getReservations(this.state.perPage, this.state.activePage) });
            }
            this.setState({ loading: false });
        } catch (error) {
            this.setState({ error: true, message: 'Error al cargar las reservaciones del usuario', alertVariant: 'error', loading: false });
        }
    }

    async getReservations(perPage: number, pages: number) {
        try {
            if (this.state.userId) {
                this.setState({ loading: true });
                let studios: StudioWithPlaces[] = [];

                const studiosHiit = await StudioService.findOne('we-hiit');

                if (!studiosHiit) throw new Error('Error cargando estudios');
                else studios.push(studiosHiit);

                const studiosRide = await StudioService.findOne('we-ride');

                if (!studiosRide) throw new Error('Error cargando estudios');
                else studios.push(studiosRide);

                this.setState({ studios })

                const response = await UserService.reservations(this.state.userId, pages, perPage);

                if (response) {
                    const { data, count } = response;
                    const pages = Math.ceil(count / this.state.perPage);
                    if (pages > 1) this.setState({ showPagination: true });

                    this.setState({ reservations: data, pages: pages });
                }
                this.setState({ loading: false });
            }
        } catch (error) {
            this.setState({
                error: true,
                alertVariant: "error",
                message: error.message ? error.message : 'Error',
                loading: false
            });
        }
    }

    closeAlert = () => {
        this.setState({ error: false });
    }

    onPaginationClick = (page: number) => {
        this.setState({ activePage: page }, () => { this.getReservations(this.state.perPage, this.state.activePage) });

    }

    showAlert(error: boolean, message: string, alertVariant: string) {
        this.setState({
            error: error,
            message: message,
            alertVariant: alertVariant
        });
    }

    getStudioName = (studioId: number) => {
        const studio = this.state.studios.find(studio => {
            if (studio.id === studioId) return studio;
            else return null;
        })
        if (studio) return studio.name;
        else return '';
    }

    getLocation = (studioId: number, placeId: number) => {
        const studio = this.state.studios.find(studio => {
            if (studio.id === studioId) return studio;
            else return null;
        });
        if (studio) {
            const place: Place | undefined = studio.places.find(place => {
                return place.id === placeId;
            });
            if (place) return place.location;
            else return '';
        } else return '';
    }

    cancelReservation = async () => {
        try {
            this.setState({ loading: true });
            const reservation: Reservation | undefined = this.state.reservations.find(reservation => {
                return reservation.id === this.state.reservationId;
            })
            if (reservation) {
                const response = await ReservationService.delete(reservation);
                if (response) {
                    this.setState({ loading: false });
                    this.setState({ error: true, message: 'Reservación cancelada con éxito', alertVariant: 'success' }, () => { this.getReservations(this.state.perPage, this.state.activePage) });
                    this.closeModal();
                } else {
                    throw new Error('Error cancelando la reservación');
                }
            } else {
                throw new Error('No se encontró la reservación');
            }
        } catch (error) {
            this.setState({ error: true, message: error.message, alertVariant: 'error' });
            this.setState({ loading: false });
        }
    }

    closeModal = () => {
        this.setState({ reservationId: undefined, showCancelModal: false });
    }

    cancelButtonEnable = (canceled: boolean, id: number) => {
        if (canceled) { }
        else {
            this.setState({ showCancelModal: true, reservationId: id });
        }
    }

    renderReservations = () => {
        if (this.state.reservations) {
            return this.state.reservations.map(reservation => {
                const { lesson, place_id, id, canceled } = reservation;
                return (
                    lesson ? <tr>
                        <td>{this.getStudioName(lesson.studio_id)}</td>
                        <td>{lesson.name ? lesson.name : ''}</td>
                        <td>{lesson.starts_at ? moment(lesson.starts_at).utcOffset("-06:00").format('DD [de] MMMM [del] YYYY') : ''}</td>
                        <td>{lesson.starts_at ? moment(lesson.starts_at).utcOffset("-06:00").format('hh:mm a') : ''}</td>
                        <td>{this.getLocation(lesson.studio_id, place_id)}</td>
                        <td>{canceled ? 'Cancelada' : 'Vigente'}</td>
                        <td>
                            <span className='users__table__buttons'>
                                <OverlayTrigger
                                    key={`cancel-reservation-trigger-${id}`}
                                    placement={'top'}
                                    overlay={
                                        <Tooltip id={`cancel-reservation-${id}`}>
                                            {canceled ? 'Reservación cancelada' : 'Cancelar reservación'}
                                        </Tooltip>
                                    }
                                >
                                    <button value={id} onClick={() => { this.cancelButtonEnable(canceled, +id) }}>
                                        <Icon
                                            path={mdiCancel}
                                            title={"Purchases"}
                                            size={1}
                                            color={canceled ? '#a8a8a8' : '#ff0000'}
                                        />
                                    </button>
                                </OverlayTrigger>
                            </span>
                        </td>
                    </tr> : null
                )
            })
        }
    }

    changePaginationAmountItems = (items: number) => {
        this.setState({ perPage: items }, () => this.getReservations(this.state.perPage, 0));
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
                <div className="users_reservations">
                    <span className="users_reservations__header-row">
                        <h1 className="header-title">RESERVAS DE {this.state.userName}</h1>
                    </span>
                    <Return goBackCallBack={this.props.routeContext!.returnPrevRoute}></Return>
                    <Table bordered hover>
                        <thead>
                            <tr>
                                <th className="users_reservations__table__th">Estudio</th>
                                <th className="users_reservations__table__th">Clase</th>
                                <th className="users_reservations__table__th">Fecha</th>
                                <th className="users_reservations__table__th">Hora</th>
                                <th className="users_reservations__table__th">Lugar</th>
                                <th className="users_reservations__table__th">Estado</th>
                                <th className="users_reservations__table__th">Acciones</th>

                            </tr>
                        </thead>
                        <tbody>{this.renderReservations()}</tbody>
                    </Table>
                    <Modal show={this.state.showCancelModal} onHide={() => { this.setState({ showCancelModal: false }) }}>
                        <Modal.Header>
                            <h2 style={{ color: '#000000' }}>Cancelar reservación</h2>
                        </Modal.Header>
                        <Modal.Body>
                            <div>
                                <p>Desea cancelar la reservación?</p>
                            </div>
                            <div className='users_reservations__modal__button-row'>
                                <Button variant={"secondary"} onClick={this.closeModal}>Cerrar</Button>
                                {!this.state.loading ?
                                    <Button onClick={this.cancelReservation}>Aceptar</Button>
                                    : <Button disabled onClick={this.cancelReservation}>Cancelando...</Button>
                                }
                            </div>
                        </Modal.Body>
                    </Modal>
                    <HorizontalLine></HorizontalLine>
                    <div className="users_reservations__pagination">
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
            </React.Fragment>
        )
    }
}

export default withRouteContext(UserReservations);