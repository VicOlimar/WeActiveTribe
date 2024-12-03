import React, { Component } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";

import styles from './PlanComponent.scss';

import PlanLogo from '../../../../assets/icon/plan.png';
import { Plan } from "../../../../services/Plan/Plan";

type Props = {
    plan: Plan;
}
class PlanComponent extends Component<Props> {

    render() {
        return (
            <View style={styles.planComponent__item}>
                <Text style={[styles.planComponent__classes, styles.planComponent__text]}>
                    {this.props.plan.name}
                </Text>

                <Image style={styles.planComponent__icon} source={PlanLogo} />
                <Text style={[styles.planComponent__cost, styles.planComponent__text]}>
                    ${this.props.plan.price} MX
                </Text>
                <Text style={[styles.planComponent__until, styles.planComponent__text]}>
                    Vigencia {this.props.plan.expires_numbers}&nbsp;
                    {this.props.plan.expires_unit == 'years' ? 'Años' : this.props.plan.expires_unit == 'months' ? 'Meses' : 'Días'}
                </Text>
            </View>
        )
    }
}

export default PlanComponent;