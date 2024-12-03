import React, { Component } from "react";
import { View, Text, SafeAreaView, FlatList } from "react-native";
import ChargeService from '../../services/Charges';
import { Charge } from "../../services/Charges/Charges";
import Loader from "../../shared/Loader";
import Toast from 'react-native-tiny-toast';
import PurchaseItem from "./components/Method";

const styles = require('./PurchaseHistory.scss');

type Props = {
  navigation: any,
}

type State = {
  loading: boolean;
  purchaseHistory: Array<Charge>;
}

class PurchaseHistory extends Component<Props, State> {

  state = {
    loading: true,
    purchaseHistory: []
  }

  componentDidMount() {
    this.load();
  }

  load = async () => {
    try {
      const purchaseHistory: Charge[] = await ChargeService.find();
      if (purchaseHistory !== undefined) {
        this.setState({ purchaseHistory });
      }
      this.setState({ loading: false });
    } catch (err) {
      Toast.show('Ocurrió un problema al obtener tu historia de compras');
    }
  }

  render() {
    const { purchaseHistory, loading } = this.state;
    return (
      loading ?
        <View style={styles.purchaseHistory__empty} >
          <Loader />
        </View> :
        purchaseHistory.length === 0 ? <View style={styles.purchaseHistory__empty}>
          <Text style={styles.purchaseHistory__text}>No tienes historial de compra.</Text>
        </View> :
          <SafeAreaView style={styles.purchaseHistory__content}>
            <FlatList
              contentContainerStyle={{ padding: 20 }}
              data={purchaseHistory}
              renderItem={(purchase) => {
                return (
                  <PurchaseItem data={purchase.item} />
                )
              }}
            />
          </SafeAreaView>
    )
  }
}

export default PurchaseHistory;