import React, { Component, Fragment } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import ProfileInfo from '../../components/ProfileInfo';
import moment from 'moment';
import './WaitingList.scss';
import WE_HIIT from './../../assets/we-hiit.png';
import WE_RIDE from './../../assets/we-ride.png';
import WE_ONLINE from './../../assets/we-online.png';

import Edit from './../../assets/edit.png';
import ReservationsImage from './../../assets/reservations.png';
import { withRouter, RouteComponentProps } from 'react-router';
import CANCELATION from './../../assets/cancelation.png'
import WaitingService from '../../../../api/Waiting';
import { Waiting } from '../../../../api/Waiting/Waiting';
import ReactGA from 'react-ga';
import { isNullOrUndefined } from 'util';
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
  waitingList: Waiting[],
  waitingListData: Array<{ label: string, value: any }>,
  pagination?: {
    pages: number,
    active: number,
    onClick: Function,
  },
  isEditing: boolean,
  loading: boolean,
  message: string,
  showMessage: boolean,
};

class WaitingList extends Component<Props, State> {
  DATE_FORMAT = 'D [de] MMMM [-] h:mm A';
  PAGE_SIZE = 10;
  state = {
    waitingList: [],
    waitingListData: [],
    pagination: undefined,
    isEditing: false,
    loading: false,
    message: '',
    showMessage: false,
  }

  componentDidMount() {
    this.setState({
      pagination: {
        pages: 1,
        active: 1,
        onClick: this.onPageClick,
      },
    }, () => this.getWaitingList());
  }

  /**
   * Callback function when user clicks in determinate page
   */
  onPageClick = (page: number) => {
    this.getWaitingList(page);
  }

  /**
   * Get User waiting list from server
   */
  getWaitingList = async (page: number = 1) => {
    let pagination = this.state.pagination! as Pagination;
    const waitingList = await WaitingService.find(page, this.PAGE_SIZE);

    if (typeof waitingList === 'string') {
      this.setState({ loading: false, message: waitingList, showMessage: true });
    } else {
      pagination = {
        pages: Number(waitingList.count) / this.PAGE_SIZE,
        active: page,
        onClick: this.onPageClick
      }
      this.mapWaitingData(waitingList.data);
      this.setState({ pagination });
    }
  }

  /**
   * Map the waiting response to component structure
   */
  mapWaitingData = (waitingList: Waiting[]) => {
    waitingList = waitingList.filter((waiting: Waiting) => !isNullOrUndefined(waiting.lesson));
    const mappedWaiting = waitingList.map(waiting => {
      return {
        label: waiting!.lesson ? moment(waiting!.lesson.starts_at).utc().utcOffset('-05:00').format(this.DATE_FORMAT) : 'No disponible',
        value: this.createWaitingValue(waiting),
      }
    });

    this.setState({ waitingListData: mappedWaiting, waitingList });
  }

  /**
   * Function to create the waiting label (Is for add editing behavior)
   */
  createWaitingValue = (waiting: Waiting) => {
    const { isEditing } = this.state;
    let instructorsNames: Array<string> = [];
    instructorsNames = waiting.lesson.instructors.map(instructor => instructor.name);
    if (isEditing) {
      return <span>
        <OverlayTrigger
          placement="left"
          overlay={
            <Tooltip id={`waiting-${waiting.id}`}>
              Cancelar solicitud.
            </Tooltip>
          }
        >
          <img className='waitings__image-tertiary' src={CANCELATION} alt='card brand' onClick={() => this.handleCancelation(waiting)} />
        </OverlayTrigger>
        <span className={`waitings__studio waitings__studio-${waiting.lesson.studio.slug}`}>
          <img src={waiting.lesson.studio.slug === 'we-hiit' ? WE_HIIT : waiting.lesson.studio.slug === 'online' ? WE_ONLINE : WE_RIDE} alt='studio logo' />
        </span>
        <span className={`waitings__instructor`}><span>{instructorsNames.length > 1 ? 'Instructores' : 'Instructor'} : {instructorsNames.length > 1 ? instructorsNames.join(' + ') : instructorsNames[0]}</span></span>
      </span>
    } else {
      return waiting.lesson ? <Fragment>
        <span className={`waitings__studio waitings__studio-${waiting.lesson.studio.slug}`}>
          <img src={waiting.lesson.studio.slug === 'we-hiit' ? WE_HIIT : waiting.lesson.studio.slug === 'online' ? WE_ONLINE : WE_RIDE} alt='studio logo' />
        </span>
        <span className={`waitings__instructor`}><span>{instructorsNames.length > 1 ? 'Instructores' : 'Instructor'} : {instructorsNames.length > 1 ? instructorsNames.join(' + ') : instructorsNames[0]}</span></span>
      </Fragment> : ''
    }
  }

  handleCancelation = async (waiting: Waiting) => {
    this.setState({ loading: true });
    const response = await WaitingService.delete(waiting);
    if (typeof response === 'string') {
      this.setState({ message: response, showMessage: true });
    } else {
      this.getWaitingList();
      this.setEditing();
      ReactGA.event({
        category: 'User',
        action: `Cancelación de la solicitud de lista de espera para la clase ${waiting.lesson.studio.name}`
      });
      this.setState({ message: "Tu solicitud ha sido cancelada con éxito.", showMessage: true });
      if (this.props.onCancelReserve) {
        this.props.onCancelReserve();
      }
    }
    this.setState({ loading: false });
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
    const { isEditing, waitingList } = this.state;
    this.setState({ isEditing: !isEditing }, () => this.mapWaitingData(waitingList));
  }

  render() {
    const { waitingListData, loading, pagination, message, showMessage } = this.state;

    return (
      <div className='waitings'>
        <ProfileInfo
          image={ReservationsImage}
          buttonText='Cancelar una solicitud'
          buttonIcon={Edit}
          buttonAction={this.setEditing}
          rowsData={waitingListData}
          pagination={pagination}
          emptyText='Parece que aún no estás en alguna lista de espera'
          secondaryAction={this.goToStudios}
          secondaryButtonText={'¡Reservar una clase!'}
          secondaryTextCenter={true}
          loading={loading}
        />
        <SimpleAlert title='' text={message} show={showMessage} onConfirm={() => this.setState({ message: '', showMessage: false })} />
      </div>
    )
  }
}

export default withRouter(WaitingList);