import React, { Component, Fragment } from "react";
import { View, Text, SafeAreaView, FlatList } from "react-native";
import { Grid, Row, Col } from 'react-native-easy-grid';
import { simpleAlert, confirmAlert } from "../../utils/common";
import Loader from './../../shared/Loader';

// Styles
import bem from 'react-native-bem';
import styles from './Reservations.scss';
import ReservationItem from "./components/ReservationItem";
import ReservationService, { Reservation } from "../../services/Reservation/Reservation";
import { TouchableOpacity } from "react-native-gesture-handler";

type Props = {
  navigation: any
}

type State = {
  reservations: Array<Reservation>,
  pagination?: {
    page: number,
  },
  loading: boolean,
  loadingScroll: boolean,
  maxItemLoaded: boolean,
  reservationStatus: string,
}

class Reservations extends Component<Props, State> {
  PAGE_SIZE = 10;

  state = {
    reservations: [],
    pagination: {
      page: 1,
    },
    loading: false,
    loadingScroll: false,
    maxItemLoaded: false,
    reservationStatus: 'next',
  }

  componentDidMount() {
    this.firstListLoading();
  }

  /**
   * Function called to make the first request
   */
  firstListLoading = async () => {
    this.setState({ loading: true, pagination: { page: 1 }, maxItemLoaded: false }, async () => {
      await this.loadReservations(true);
      this.setState({ loading: false, pagination: { page: 1 }, maxItemLoaded: false });
    });
  }

  /**
   * Loads the user reservations when the user scroll the FlatList
   */
  loadReservations = async (isFirstTime = false) => {
    const { loading, loadingScroll, maxItemLoaded, reservations } = this.state;
    let { page } = this.state.pagination;
    try {
      if (!isFirstTime && !loading && !loadingScroll && !maxItemLoaded) {
        this.setState({ loadingScroll: true });
        const nextPage = await ReservationService.find(page, this.PAGE_SIZE, this.state.reservationStatus === 'past');
        const newReservations = reservations.concat(nextPage.data);
        if (newReservations.length <= (nextPage.count / 2)) { // The division by 2 is for the Count bug in the core
          page = page + 1;
          this.setState({
            reservations: newReservations,
            pagination: { page },
            loadingScroll: false,
            maxItemLoaded: newReservations.length === (nextPage.count / 2)
          });
        }
      } else if (isFirstTime) {
        const reservations = await ReservationService.find(page, this.PAGE_SIZE, this.state.reservationStatus === 'past');
        this.setState({ reservations: reservations.data.filter(reservation => !this.isNullOrUndefined(reservation.lesson)), pagination: { page } });
      }

    } catch (error) {
      simpleAlert('Ups', error.message);
    }
  }

  isNullOrUndefined(object: any) {
    return object === null || object === undefined;
  }

  /**
   * Callback to show the confirm for a cancelation
   */
  confirmCancelation = (reservation: Reservation) => {
    confirmAlert(
      '¡Espera!',
      '¿Seguro que deseas cancelar tu reservación?',
      [{
        text: 'Sí, cancelar',
        style: 'default',
        onPress: () => this.cancelReservationsRequest(reservation)
      }]
    );
  }

  /**
   * Cancel a reservation
   */
  cancelReservationsRequest = async (reservation: Reservation) => {
    try {
      this.setState({ loading: true });
      const cancelation = await ReservationService.delete(reservation);
      simpleAlert('Correcto', 'Tu reservación ha sido cancelada correctamente');
      this.firstListLoading();
    } catch (error) {
      simpleAlert('Ups', error.message);
      this.setState({ loading: false });
    }
  }

  /**
   * Change the reservation type and call the first load method
   */
  changeReservationType = (type: string) => {
    this.setState({ reservationStatus: type });
    this.firstListLoading();
  }

  render() {
    const { loading, reservations, reservationStatus } = this.state;
    const b = (selector) => bem(selector, {}, styles);
    return (
      <Grid style={b('reservations-list__content')}>
        <Row style={{ height: 70 }}>
          <Col>
            <TouchableOpacity onPress={() => this.changeReservationType('past')}>
              <Text style={[
                b('reservations-list__type_text'),
                reservationStatus === 'past' ? b('reservations-list__type_text__active') : {}
              ]}>Pasadas</Text>
            </TouchableOpacity>
          </Col>
          <Col>
            <TouchableOpacity onPress={() => this.changeReservationType('next')}>
              <Text style={[
                b('reservations-list__type_text'),
                reservationStatus === 'next' ? b('reservations-list__type_text__active') : {}
              ]}>Próximas</Text>
            </TouchableOpacity>
          </Col>
        </Row>
        {
          loading ? <Loader /> : reservations.length === 0 ? <View style={b('reservations-list__empty')}>
            <Text style={b('reservations-list__text')}>Aún no tienes reservaciones.</Text>
          </View> : <Fragment>
              <Row style={{ height: 25 }}>
                <Col><Text style={b('reservations-list__text')}>Estudio</Text></Col>
                <Col><Text style={b('reservations-list__text')}>Instructor</Text></Col>
                <Col><Text style={b('reservations-list__text')}>Lugar</Text></Col>
                <Col><Text style={b('reservations-list__text')}>Horario</Text></Col>
                {
                  reservationStatus === 'next' && <Col style={{ width: 45 }}></Col>
                }
              </Row>
              <Row>
                <Col>
                  <FlatList
                    keyExtractor={(item, index) => index.toString()}
                    data={reservations}
                    renderItem={(reservation) => (
                      <ReservationItem reservation={reservation.item} onCancel={this.confirmCancelation} reservationStatus={reservationStatus} />
                    )}
                    onEndReached={() => this.loadReservations(false)}
                    onEndReachedThreshold={0}
                  /></Col>
              </Row>
            </Fragment>
        }
      </Grid>
    )
  }

}

export default Reservations;