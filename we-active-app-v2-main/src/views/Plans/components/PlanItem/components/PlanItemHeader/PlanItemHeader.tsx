import React, { Fragment } from 'react';
import { Text, View, Dimensions } from 'react-native';
// @ts-ignore
import styles from  './PlanItemHeader.scss';
import bem from 'react-native-bem';
import { Plan } from '../../../../../../services/Plan/Plan';
import LinearGradient from 'react-native-linear-gradient';


const PlanItemHeader = ({ plan }: { plan: Plan }) => {
  const splitedName = plan.name.split(' ');
  const b = selector => bem(selector, {}, styles);

  function specialPlanNanme() {
    return <LinearGradient
      colors={['#58318b', '#04108e']} // PURPLE / BLUE
      start={{ x: 0, y: 1 }}
      end={{ x: 1, y: 0 }}
      style={b('item-header__special')}>
      {splitedName.length > 1 ?
        <Text style={b('item-header__special-text')}>{`${splitedName[0]} \n`}{splitedName.length > 2 ? `${splitedName[1]} ${splitedName[2] ? splitedName[2] : ''}` : `${splitedName[1]}`}</Text>
        : <Text style={b('item-header__special-text')}>{plan.name}</Text>}
    </LinearGradient>
  }

  function planName() {
    const width = Dimensions.get('window').width * .20;
    return <View style={[b('item-header__normal'), { width }]}>
      <Text style={b('item-header__normal-credits')}>{splitedName[0]}</Text>
      <Text style={b('item-header__normal-text')}>{splitedName[1]}</Text>
    </View>
  }

  return (<Fragment>
    {
      splitedName[0].toLowerCase() === 'first' || plan.special ? specialPlanNanme() : planName()
    }
  </Fragment>)
}

export default PlanItemHeader;