import React, { Component, Fragment } from 'react';
import { OverlayTrigger, Tooltip, ButtonToolbar, ToggleButtonGroup, ToggleButton } from 'react-bootstrap';
import ProfileInfo from './../../components/ProfileInfo';
import moment from 'moment';
import './Reservations.scss';
import WE_HIIT from './../../assets/we-train.png';
import WE_RIDE from './../../assets/we-ride.png';
import WE_ONLINE from './../../assets/we-online.png';

import Edit from './../../assets/edit.png';
import ReservationsImage from './../../assets/reservations.png';
import { isUndefined, isNullOrUndefined } from 'util';
import { withRouter, RouteComponentProps } from 'react-router';
import CANCELATION from './../../assets/cancelation.png'
import ReservationService from '../../../../api/Reservation';
import { Reservation } from '../../../../api/Reservation/ReservationService';
import ReactGA from 'react-ga';
import SimpleAlert from '../../../../shared/SimpleAlert';

type Pagination = {
  pages: number,
  active: number,
  onClick: Function,
};
type Props = RouteComponentProps<any> & {
  onCancelReserve?: Function,
};
type State = {
  reservations: Reservation[],
  reservationsData: Array<{ label: string, value: any }>,
  pagination?: {
    pages: number,
    active: number,
    onClick: Function,
  },
  isEditing: boolean,
  loading: boolean,
  reservationStatus: string,
  message: string,
  showMessage: boolean,
  showCancelation: boolean,
  url: string
};

class Reservations extends Component<Props, State> {
  DATE_FORMAT = 'D [de] MMMM [-] h:mm A';
  PAGE_SIZE = 10;
  state = {
    reservations: [],
    reservationsData: [],
    pagination: undefined,
    isEditing: false,
    loading: false,
    reservationStatus: 'next',
    message: '',
    showMessage: false,
    showCancelation: false,
    url: ''
  }

  componentDidMount() {
    this.setState({
      pagination: {
        pages: 1,
        active: 1,
        onClick: this.onPageClick,
      },
    }, () => this.getReservations());
  }

  /**
   * Callback function when user clicks in determinate page
   */
  onPageClick = (page: number) => {
    this.getReservations(page);
  }

  /**
   * Get User reservations from server
   */
  getReservations = async (page: number = 1) => {
    let pagination = this.state.pagination! as Pagination;
    const reservations = await ReservationService.find(page, this.PAGE_SIZE, this.state.reservationStatus === 'past');

    if (!isUndefined(reservations)) {
      pagination = {
        pages: Number(reservations.count) / this.PAGE_SIZE,
        active: page,
        onClick: this.onPageClick
      }
      this.mapReservationsData(reservations.data);
      this.setState({ pagination });
    }
  }

  /**
   * Map the reservations response to component structure
   */
  mapReservationsData = (reservations: Reservation[]) => {
    reservations = reservations.filter((reservation: Reservation) => !isNullOrUndefined(reservation.lesson));
    const mappedReservations = reservations.map(reservation => {
      return {
        label: reservation!.lesson ? moment(reservation!.lesson.starts_at).utc().utcOffset('-05:00').format(this.DATE_FORMAT) : 'No disponible',
        value: this.createReservationValue(reservation),
      }
    });

    this.setState({ reservationsData: mappedReservations, reservations });
  }

  /**
   * Function to create the reservation label (Is for add editing behavior)
   */
  createReservationValue = (reservation: Reservation) => {
    const { isEditing } = this.state;
    let instructorsNames: Array<string> = [];
    instructorsNames = reservation.lesson.instructors.map(instructor => instructor.name);

    if (isEditing) {
      return <span>
        <OverlayTrigger
          placement="left"
          overlay={
            <Tooltip id={`reservation-${reservation.id}`}>
              Cancelar reservaci&oacute;n.
            </Tooltip>
          }
        >
          <img className='reservations__image-tertiary' src={CANCELATION} alt='card brand' onClick={() => this.handleCancelation(reservation)} />
        </OverlayTrigger>
        <span className={`reservations__studio reservations__studio-${reservation.lesson.studio.slug}`}>
          <img src={reservation.lesson.studio.slug === 'we-hiit' ? WE_HIIT : reservation.lesson.studio.slug === 'online' ? WE_ONLINE : WE_RIDE} alt='studio logo' />
        </span>
        <span className={`reservations__instructor`}><span className={`${reservation.canceled ? 'reservations__decoration' : ''}`}>(Lugar {reservation.place.location}) {instructorsNames.length > 1 ? instructorsNames.join(' + ') : instructorsNames[0]}</span> {reservation.canceled ? <span className='reservations__canceled'>Cancelada</span> : reservation.lesson.studio.slug === 'online' && reservation.lesson.meeting_url ? <span className='reservations__see_lesson' onClick={(event: any) => this.showMeeting(reservation.lesson.meeting_url)}>Ver clase</span> : ''}</span>
      </span>
    } else {
      return reservation.lesson ? <Fragment>
        <span className={`reservations__studio reservations__studio-${reservation.lesson.studio.slug}`}>
          <img src={reservation.lesson.studio.slug === 'we-hiit' ? WE_HIIT : reservation.lesson.studio.slug === 'online' ? WE_ONLINE : WE_RIDE} alt='studio logo' />
        </span>
        <span className={`reservations__instructor`}><span className={`${reservation.canceled ? 'reservations__decoration' : ''}`}>(Lugar {reservation.place.location}) {instructorsNames.length > 1 ? instructorsNames.join(' + ') : instructorsNames[0]}</span> {reservation.canceled ? <span className='reservations__canceled'>Cancelada</span> : reservation.lesson.studio.slug === 'online' && reservation.lesson.meeting_url ? <span className='reservations__see_lesson' onClick={(event: any) => this.showMeeting(reservation.lesson.meeting_url)}>Ver clase</span> : ''}</span>
      </Fragment> : ''
    }
  }

  handleCancelation = async (reservation: Reservation) => {
    this.setState({ loading: true });
    const response = await ReservationService.delete(reservation);
    if (typeof response === 'string') {
      this.setState({ message: response, showCancelation: true, loading: false });
    } else {
      this.getReservations();
      this.setEditing();
      ReactGA.event({
        category: 'User',
        action: `Cancelación de la reserva en el estudio ${reservation.place.studio.name}`
      });
      this.setState({ message: "Tu reserva ha sido cancelada con éxito.", showCancelation: true, loading: false });
      if (this.props.onCancelReserve) {
        this.props.onCancelReserve();
      }
    }
  }

  /**
   * Send to the home page
   */
  goToStudios = () => {
    window.location.href = '/'; // I had a issue with React Router with the nested routes in the parent component, this is temporaly
  }

  /**
   * Function to change the editing value
   */
  setEditing = () => {
    const { isEditing, reservations } = this.state;
    this.setState({ isEditing: !isEditing }, () => this.mapReservationsData(reservations));
  }

  /**
   * Function to change the current reservations status and reload list
   */
  handleStatusChange = (status: string) => {
    this.setState({ reservationStatus: status }, () => this.getReservations());
  }

  showMeeting = (meeting_url: string) => {
    this.setState({
      message: `El enlace de tu clase es ${meeting_url}`,
      showMessage: true,
      url: meeting_url
    })
  }

  copyToClipboard = () => {
    /* Get the text field */
    let copyText: any = document.getElementById('url');

    /* Select the text field */
    copyText.select();
    copyText.setSelectionRange(0, 99999); /*For mobile devices*/

    /* Copy the text inside the text field */
    document.execCommand('copy');
    return false;
  }

  render() {
    const { reservationsData, loading, pagination, message, showMessage, showCancelation, url } = this.state;

    return (
      <div className='reservations'>
        <input id='url' style={{ opacity: 0 }} value={url} onChange={() => true} />
        <ProfileInfo
          image={ReservationsImage}
          buttonText='Cancelar una reservación'
          buttonIcon={Edit}
          buttonAction={this.setEditing}
          rowsData={reservationsData}
          pagination={pagination}
          emptyText='Parece que aún no reservas una clase'
          secondaryAction={this.goToStudios}
          secondaryButtonText={'¡Reserva una clase!'}
          secondaryTextCenter={true}
          loading={loading}
        >
          <ButtonToolbar className='reservations__tabs'>
            <ToggleButtonGroup type="radio" name="options" defaultValue={'next'} value={this.state.reservationStatus}>
              <ToggleButton value={'next'} onClick={() => this.handleStatusChange('next')}>Próximas</ToggleButton>
              <ToggleButton value={'past'} onClick={() => this.handleStatusChange('past')}>Pasadas</ToggleButton>
            </ToggleButtonGroup>
          </ButtonToolbar>
        </ProfileInfo>
        <SimpleAlert title='' confirmText='Copiar enlace' text={message} show={showMessage} onConfirm={() => {
          this.setState({ message: '', showMessage: false });
          this.copyToClipboard();
          window.open(url, '_blank');
        }} />
        <SimpleAlert title='' confirmText='Aceptar' text={message} show={showCancelation} onConfirm={() => {
          this.setState({ message: '', showCancelation: false });
        }} />
      </div>
    )
  }
}

export default withRouter(Reservations);