import React from 'react';
import { View, Text, Image, Dimensions } from 'react-native';
import bem from 'react-native-bem';
import styles from './PlanItemBody.scss';
import { Plan } from '../../../../../../services/Plan/Plan';
import { getMoneyFormat } from '../../../../../../utils/money';
import WeLogo from '../../../../../../assets/icon/plan.png';

const PlanItemBody = ({ plan }: { plan: Plan }) => {
  const b = selector => bem(selector, {}, styles);
  const className = plan.special ? 'item-body__special' : 'item-body__normal';
  const width = Dimensions.get('window').width * .735;

  function getIntervalValue() {
    switch (plan.expires_unit) {
      case 'years':
        return 'años';
      case 'months':
        return 'meses';
      case 'days':
        return 'días';
    }
  }

  return (<View style={[b(className), plan.special ? {} : { width}]}>
    <View style={b(`${className}__logo`)}>
      <Image source={WeLogo} style={b(`${className}__image`)} resizeMode='cover' />
    </View>
    <View style={b(`${className}__info`)}>
      <Text style={b(`${className}__price`)}>{getMoneyFormat(plan.price)}</Text>
      <Text style={b(`${className}__validity`)}>Vigencia {plan.expires_numbers} {getIntervalValue()}</Text>
    </View>
  </View >)
}

export default PlanItemBody;