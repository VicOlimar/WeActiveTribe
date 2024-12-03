import React, { Component } from "react";
import { View, Text, SafeAreaView, FlatList, Image } from "react-native";
import hoistNonReactStatics from 'hoist-non-react-statics';
import { Card } from "../../services/Card/Card";
import CardService from "../../services/Card";
import Loader from '../../shared/Loader';
import Method from "./components/Method";
import { TouchableOpacity } from "react-native-gesture-handler";
import PlusIcon from './../../assets/icon/plus.png';
import withPaymentBottomSheet from "../../shared/withPaymentBottomSheet";
import { PaymentBottomSheetProps } from "../../shared/withPaymentBottomSheet/withPaymentBottomSheet";

const styles = require('./PaymentMethods.scss');

type Props = {
  navigation: any,
  paymentBottomSheet: PaymentBottomSheetProps,
}

type State = {
  paymentMethods: Array<Card>
  loading: boolean;
}

class PaymentMethods extends Component<Props, State> {

  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;

    return {
      headerRight: () => (
        <TouchableOpacity onPress={() => params.openBottomSheet()}>
          <Image source={PlusIcon} style={styles.paymentMethods__rightAction} resizeMode='cover' />
        </TouchableOpacity>
      ),
    }
  };

  state = {
    paymentMethods: [],
    loading: true
  }

  componentDidMount() {
    this.load();
    this.props.navigation.setParams({
      openBottomSheet: this.openPaymentMethodForm
    });
    this.props.paymentBottomSheet.setCloseCallback(this.load);
  }

  /**
   * Function callback to handle an error
   */
  handleError = (message: string) => {
    console.log(message);
  }

  /**
   * Load payment methods
   */
  load = async () => {
    this.setState({ loading: true });
    try {
      let paymentMethods: Card[] = await CardService.find();
      if (paymentMethods !== null) {
        paymentMethods = paymentMethods.sort((a: Card, b: Card) => {
          if (a.default && !b.default) {
            return -1;
          }
          return 0;
        })
        this.setState({ paymentMethods });
      } else {
        this.handleError('Ocurrió un problema al obtener tus métodos de pago');
      }
    } catch (err) {
      this.handleError('Ocurrió un problema al obtener tus métodos de pago');
    }
    this.setState({ loading: false });
  }

  /**
   * Callback function to open bottomsheet
   */
  openPaymentMethodForm = () => {
    this.props.paymentBottomSheet.openBottomSheet();
  }

  setLoading = () => {
    const { loading } = this.state;
    this.setState({ loading: !loading });
  }

  render() {
    const { paymentMethods, loading } = this.state;
    return (
      loading ? <View style={styles.paymentMethods__empty} >
        <Loader />
      </View> :
        paymentMethods.length == 0 ? <View style={styles.paymentMethods__empty}>
          <Text style={styles.paymentMethods__text}>Aún no tienes métodos de pago.</Text>
        </View> :
          <SafeAreaView style={styles.paymentMethods__content}>
            <FlatList
              contentContainerStyle={{ paddingTop: 20 }}
              data={paymentMethods}
              renderItem={(paymentMethod) => (
                <Method data={paymentMethod.item} load={this.load} setLoading={this.setLoading} />
              )}
            />
          </SafeAreaView>
    )
  }
}

export default hoistNonReactStatics(withPaymentBottomSheet(PaymentMethods), PaymentMethods);