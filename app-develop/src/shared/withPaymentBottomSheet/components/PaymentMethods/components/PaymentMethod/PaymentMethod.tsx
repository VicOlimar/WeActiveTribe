import React from 'react';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { Text, View, Image, TouchableHighlight } from 'react-native';

import styles from './PaymentMethod.scss';
import bem from 'react-native-bem';
import { PaymentMehodElement } from '../../PaymentMethods';
import Divider from '../../../../../Divider';

type Props = {
    paymentMethod: PaymentMehodElement,
    onPress: Function,
};

const PaymentMethod = (props: Props) => {
    const b = (selector) => bem(selector, {}, styles);

    return (
        <TouchableHighlight style={{ width: '100%' }} underlayColor='#eeeeee' onPress={() => props.onPress(props.paymentMethod)}>
            <View style={b('payment_method')}>
                <Grid>
                    <Row style={b('payment_method__container')} size={20}>
                        <Image style={b('payment_method__container__image')} source={props.paymentMethod.icon} />
                        <Text style={b('payment_method__container__text')}>{props.paymentMethod.label}</Text>
                    </Row>
                </Grid>
            </View>
        </TouchableHighlight>
    );
}

export default PaymentMethod;