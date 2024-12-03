import React from 'react';
import { Text, View, Image, Alert } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';
import CardService from '../../../../services/Card';
import Toast from 'react-native-tiny-toast';
import { confirmAlert, simpleAlert } from '../../../../utils/common';

const VisaCard = require('../../../../assets/img/visa.png');
const MasterCard = require('../../../../assets/img/master-card.png');
const AmexCard = require('../../../../assets/img/amex.png');
const star = require('../../../../assets/icon/star.png');
const trash = require('../../../../assets/icon/trash.png');

const styles = require('./Method.scss');


const CardItem = (cardItem: any) => {
  function getCardBrandIcon(brand) {
    let cardBrand;

    switch (brand) {
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


  function showConfirm() {
    confirmAlert('Espera', '¿Seguro que deseas eliminar este método de pago?', [{
      text: 'Confimar',
      style: 'destructive',
      onPress: () => deleteMethod()
    }])
  }

  async function deleteMethod() {
    cardItem.setLoading();
    try {
      const res = await CardService.delete(cardItem.data.id);
      if (res) Toast.showSuccess('Forma de pago eliminada.');
      cardItem.load();
    }
    catch (err) {
      Toast.show('Error eliminando método de pago');
    }
    cardItem.setLoading();
  }

  async function setDefault() {
    try {
      const res = await CardService.update(cardItem.data.id);
      if (res) {
        simpleAlert('Listo', 'Método predeterminado de pago actualizado', () => cardItem.load());
      }
    }
    catch (err) {
      Toast.show('Error cambiando tu forma de pago predeterminado');
    }
  }

  return (
    <View style={styles.method__cardContainer}>
      {cardItem.data.default &&
        <View style={styles.method__default}>
          <Image
            style={styles.method__defaultIcon}
            resizeMode='contain'
            source={star} />
        </View>
      }
      <TouchableOpacity
        style={styles.method__card}
        onPress={!cardItem.data.default ? setDefault : null}>
        <View style={styles.method__cardData}>
          <Text style={styles.method__cardOwner}>{cardItem.data.name}</Text>
          <View style={styles.method__numbersContainer}>
            <Text style={styles.method__cardNumber}>
              <Text style={styles.method__cardText}>x </Text>
              {cardItem.data.last4}
            </Text>
            <Text style={styles.method__cardExp}>exp.{cardItem.data.exp_month}/{cardItem.data.exp_year}</Text>
          </View>
        </View>
        <Image
          style={styles.method__cardLogo}
          resizeMode='contain'
          source={getCardBrandIcon(cardItem.data.brand)}
        />
      </TouchableOpacity>
      <View style={styles.method__delete}>
        <TouchableOpacity
          onPress={showConfirm}>
          <Image
            style={styles.method__deleteIcon}
            resizeMode='contain'
            source={trash} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default CardItem;