import React, { Component } from "react";
import { View, Text, SafeAreaView, FlatList } from "react-native";
import { Grid, Row, Col } from 'react-native-easy-grid';
import WaitingService, { Waiting } from "../../services/Waiting/Waiting";
import { simpleAlert, confirmAlert } from "../../utils/common";
import WaitingItem from "./components/WaitingItem/WaitingItem";

// Styles
import bem from 'react-native-bem';
// @ts-ignore
import styles from  './WaitingList.scss';

type Props = {
  navigation: any
}

type State = {
  waitings: Array<Waiting>,
  pagination?: {
    page: number,
  },
  loading: boolean,
  loadingScroll: boolean,
  maxItemLoaded: boolean,
}

class WaitingList extends Component<Props, State> {
  PAGE_SIZE = 5;

  state = {
    waitings: [],
    pagination: {
      page: 1,
    },
    loading: false,
    loadingScroll: false,
    maxItemLoaded: false,
  }

  componentDidMount() {
    this.firstListLoading();
  }

  /**
   * Function called to make the first request
   */
  firstListLoading = async () => {
    this.setState({ loading: true, pagination: { page: 1 }, maxItemLoaded: false }, async () => {
      await this.loadWaitingList(true);
      this.setState({ loading: false, pagination: { page: 1 }, maxItemLoaded: false });
    });
  }

  /**
   * Loads the user waiting list when the user scroll the FlatList
   */
  loadWaitingList = async (isFirstTime = false) => {
    const { loading, loadingScroll, maxItemLoaded, waitings } = this.state;
    let { page } = this.state.pagination;
    try {
      if (!isFirstTime && !loading && !loadingScroll && !maxItemLoaded) {
        this.setState({ loadingScroll: true });
        const nextPage = await WaitingService.find(page, this.PAGE_SIZE);
        const newWaitings = waitings.concat(nextPage.data);
        if (newWaitings.length <= (nextPage.count / 2)) { // The division by 2 is for the Count bug in the core
          page = page + 1;
          this.setState({
            waitings: newWaitings,
            pagination: { page },
            loadingScroll: false,
            maxItemLoaded: newWaitings.length === (nextPage.count / 2)
          });
        }
      } else if (isFirstTime) {
        const waitings = await WaitingService.find(page, this.PAGE_SIZE);
        this.setState({ waitings: waitings.data, pagination: { page } });
      }

    } catch (error) {
      simpleAlert('Ups', error.message);
    }
  }

  /**
   * Callback to show the confirm for a cancelation
   */
  confirmCancelation = (waiting: Waiting) => {
    confirmAlert(
      'Espera',
      '¿Seguro que deseas cancelar tu solicitud en la lista de espera?',
      [{
        text: 'Confirmar',
        style: 'default',
        onPress: () => this.cancelWaitingListRequest(waiting)
      }]
    );
  }

  /**
   * Cancel a waiting list request
   */
  cancelWaitingListRequest = async (waiting: Waiting) => {
    try {
      const cancelation = await WaitingService.delete(waiting);
      simpleAlert('Correcto', 'Tu solicitud en la lista de espera ha sido cancelada correctamente');
      this.firstListLoading();
    } catch (error) {
      simpleAlert('Ups', error.message);
    }
  }

  render() {
    const { waitings } = this.state;
    const b = (selector) => bem(selector, {}, styles);
    return (
      waitings.length === 0 ? <View style={b('waiting-list__empty')}>
        <Text style={b('waiting-list__text')}>Aún no te anotas a ninguna lista de espera.</Text>
      </View> :
        <Grid style={b('waiting-list__content')}>
          <Row size={2}>
            <Col><Text style={b('waiting-list__text')}>Estudio</Text></Col>
            <Col><Text style={b('waiting-list__text')}>Instructor</Text></Col>
            <Col><Text style={b('waiting-list__text')}>Horario</Text></Col>
            <Col style={{ width: 30 }}></Col>
          </Row>
          <Row size={98}>
            <Col>
              <FlatList
                keyExtractor={(item, index) => index.toString()}
                data={waitings}
                renderItem={(waiting) => (
                  <WaitingItem waiting={waiting.item} onCancel={this.confirmCancelation} />
                )}
                onEndReached={() => this.loadWaitingList(false)}
                onEndReachedThreshold={0}
              /></Col>
          </Row>
        </Grid>
    )
  }

}

export default WaitingList;