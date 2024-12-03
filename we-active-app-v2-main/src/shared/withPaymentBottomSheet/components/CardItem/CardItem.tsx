import React from 'react';
import { Text, Image, TouchableOpacity } from 'react-native';
import { Card } from '../../../../services/Card/Card';
import bem from 'react-native-bem';
// @ts-ignore
import styles from  './CardItem.scss';

const VisaCard = require('./../../../../assets/img/visa.png');
const MasterCard = require('./../../../../assets/img/master-card.png');
const AmexCard = require('./../../../../assets/img/amex.png');

const CardItem = ({ card, onPress }: { card?: Card, onPress: Function }) => {
  const b = (selector) => bem(selector, {}, styles);

  function getCardBrandIcon() {
    let cardBrand;

    switch (card.brand) {
      case 'visa':
        cardBrand = VisaCard;
        break;
      case 'american_express':
        cardBrand = AmexCard;
        break;
      case 'mastercard':
        cardBrand = MasterCard;
        break;
      default:
        cardBrand = VisaCard;
        break;
    }
    return cardBrand;
  }

  return (
    <TouchableOpacity onPress={() => onPress(card)} style={b('card-item__container')}>
      <Image style={b('card-item__image')} source={getCardBrandIcon()} />
      <Text style={b('card-item__digits')}>**** {card.last4}</Text>
    </TouchableOpacity>
  );
}

export default CardItem;