import React from 'react';
import { Col, Row, Grid } from 'react-native-easy-grid';
import styles from './PaymentMethods.scss';
import bem from 'react-native-bem';
import PaymentMethod from './components/PaymentMethod';

const MasterCard  = require ('./../../../../assets/img/master-card.png');
const Visa = require('./../../../../assets/img/visa.png')


export type PaymentMehodElement = {
    icon: any,
    label: string,
    type: 'paypal' | 'card' | 'fill',
}

type Props = {
    onPress: Function,
};

const PaymentMethods = (props: Props) => {
    const b = (selector) => bem(selector, {}, styles);

    const paymentMethods: Array<PaymentMehodElement> = [
        {
            icon: MasterCard,
            label: 'Tarjeta de Crédito / Débito',
            type: 'card',
        },
        {
            icon: null,
            label: null,
            type: 'fill',
        }
    ];

    return (
        <Grid style={b('payment_methods')}>
            {
                paymentMethods.map((element, index) => <Row key={index} >
                    {element.icon !== null && <PaymentMethod onPress={props.onPress} paymentMethod={element} />}
                </Row>)
            }
        </Grid>
    )
}

export default PaymentMethods;