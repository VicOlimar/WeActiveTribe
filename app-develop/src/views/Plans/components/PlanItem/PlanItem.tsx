import React from 'react';
import { Text, View } from 'react-native';
import bem from 'react-native-bem';

import styles from './PlanItem.scss';
import { Plan } from '../../../../services/Plan/Plan';
import PlanItemHeader from './components/PlanItemHeader';
import PlanItemBody from './components/PlanItemBody';
import { TouchableOpacity } from 'react-native-gesture-handler';

type Props = { plan: Plan, onPress: Function }
const PlanItem = ({ plan, onPress }: Props) => {
  const b = selector => bem(selector, {}, styles);
  return (<TouchableOpacity onPress={() => onPress(plan)} style={[b('plan-item'), plan.special ? b('plan-item__special') : b('plan-item__normal')]}>
    <View style={plan.special ? b('plan-item__special-header') : 'plan-item__normal-header'}>
      <PlanItemHeader plan={plan} />
    </View>
    <View style={plan.special ? b('plan-item__special-body') : 'plan-item__normal-body'}>
      <PlanItemBody plan={plan} />
    </View>
  </TouchableOpacity >)
}

export default PlanItem