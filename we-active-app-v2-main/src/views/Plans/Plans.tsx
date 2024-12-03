import React, { Component } from "react"
import { View, FlatList } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context";
import LinearGradient from 'react-native-linear-gradient';
import PlanService, { Plan } from '../../services/Plan/Plan';
import hoistNonReactStatics from 'hoist-non-react-statics';
import withUserContext from "../../contexts/UserContext/WithUserContext";
import withPaymentBottomSheet from "../../shared/withPaymentBottomSheet";
import { PaymentBottomSheetProps } from "../../shared/withPaymentBottomSheet/withPaymentBottomSheet";
import Loader from '../../shared/Loader';
import PlanItem from "./components/PlanItem";

const styles = require('./Plans.scss');

type Props = {
  navigation: any,
  paymentBottomSheet: PaymentBottomSheetProps,
}
type State = {
  plans: Array<Plan>,
  loading: boolean
}

class Plans extends Component<Props, State> {

  state = {
    plans: [],
    loading: true
  }

  componentDidMount() {
    this.props.navigation.addListener('willFocus', (payload) => {
      this.getPlans()
    });
  }

  /**
   * Get the plans from the backend
   */
  getPlans = async () => {
    this.setState({ loading: true })
    const plans = await PlanService.find();
    if (plans !== null) {
      this.setState({ plans });
    } else {
      console.error('Ocurrió un problema al obtener los planes');
    }
    this.setState({ loading: false });
  }

  /**
   * Handle the plan press
   */
  handlePlanPress = (plan: Plan) => {
    this.props.paymentBottomSheet.openBottomSheet(plan);
  }

  /**
   * Sort plans by special and credits
   */
  sortPlans = (plans: Array<Plan>) => {
    // We prepare the plans
    return plans.sort((a: Plan, b: Plan) => {
      if (a.special && !b.special) {
        return -1;
      }
      if (!a.special && b.special) {
        return 1;
      }
      if (!a.special && !b.special && a.credits < b.credits) {
        return -1;
      }
      return 0;
    });
  }

  render() {
    const { plans, loading } = this.state;
    return (
      loading ? <SafeAreaView style={styles.plans__empty}>
        <Loader />
      </SafeAreaView> :
        <LinearGradient
          style={styles.plans__content}
          colors={['#171c32', '#3e0923']} // PURPLE / BLUE
          start={{ x: 0.0, y: 0.0 }} end={{ x: 0.5, y: 1.0 }}>
          <FlatList
            keyExtractor={(item, index) => index.toString()}
            data={this.sortPlans(plans)}
            renderItem={(plan) => (
              <PlanItem plan={plan.item} onPress={this.handlePlanPress} />
            )}
          />
        </LinearGradient>
    )
  }
}


export default hoistNonReactStatics(withUserContext(withPaymentBottomSheet(Plans)), withPaymentBottomSheet(Plans));