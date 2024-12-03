import React, { Component, Fragment } from 'react';
import { View } from 'react-native';
import { Row, Grid } from 'react-native-easy-grid';
import RBSheet from "react-native-raw-bottom-sheet";
import PaymentContainer from './components/PaymentContainer';
import { Plan } from '../../services/Plan/Plan';

export type PaymentBottomSheetProps = {
  openBottomSheet: Function,
  closeBottomSheet: Function,
  setCloseCallback: Function,
};

type State = {
  plan?: Plan,
  closeCallback?: Function,
};

const withPaymentBottomSheet = <P extends object>(WrappedComponent: React.ComponentType<P>) => {
  return class PaymentBottomSheet extends Component<P & PaymentBottomSheetProps, State> {
    RBSheet = null;

    state = {
      plan: undefined,
      closeCallback: undefined,
    }

    /**
     * Open the bottom sheet
     */
    openBottomSheet = (plan: Plan) => {
      this.RBSheet.open();
      this.setState({ plan });
    }

    /**
     * Close the bottom sheet
     */
    closeBottomSheet = () => {
      const { closeCallback } = this.state;
      this.RBSheet.close();
      if(closeCallback){
        closeCallback();
      }
    }

    /**
     * Set close callback
     */
    setCloseCallback = (callback: Function) => {
      this.setState({ closeCallback: callback });
    }

    render() {
      const { plan } = this.state;
      const paymentBottomSheet = {
        openBottomSheet: this.openBottomSheet,
        closeBottomSheet: this.closeBottomSheet,
        setCloseCallback: this.setCloseCallback,
      }
      // Renders the wrapped component with the conekta functions
      return (
        <Grid>
          <Row>
            <WrappedComponent paymentBottomSheet={paymentBottomSheet} {...this.props as P} />
          </Row>
          <RBSheet
            ref={ref => {
              this.RBSheet = ref;
            }}
            height={400}
            customStyles={{
              container: {
                justifyContent: "center",
                alignItems: "center"
              }
            }}
          >
            <PaymentContainer onCancel={this.closeBottomSheet} plan={plan} setCloseCallback={this.setCloseCallback} />
          </RBSheet>
        </Grid>
      )
    }
  }
}

export default withPaymentBottomSheet;