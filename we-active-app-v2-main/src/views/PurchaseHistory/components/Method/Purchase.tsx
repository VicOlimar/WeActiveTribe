import React from 'react';
import { Text, View, Image } from 'react-native';
import moment from 'moment-timezone';

const VisaCard = require('../../../../assets/img/visa.png');
const MasterCard = require('../../../../assets/img/master-card.png');
const AmexCard = require('../../../../assets/img/amex.png');

const styles = require('./Purchase.scss');

const PurchaseItem = (purchaseItem: any) => {
  const EXP_DATE_FORMAT = 'DD-MMM-YYYY hh:MM A';

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

  function getExpDate(purchaseItem) {
    return purchaseItem.data.credits.length > 0 ? moment(purchaseItem.data.credits[0].expires_at).tz('America/Merida').format(EXP_DATE_FORMAT) : 'N/A';
  }

  function getCardLabel() {
    const payment_type = purchaseItem.data.payment_type;
    if (
      payment_type === 'conekta' ||
      payment_type === 'credit-card'
    ) {
      return <Text style={styles.purchase__importantText}>x  {purchaseItem.data.card_last4}</Text>
    } else if (payment_type === 'paypal') {
      return <Text style={styles.purchase__importantText}>PayPal</Text>
    } else if (payment_type === 'cash') {
      return <Text style={styles.purchase__importantText}>Efectivo</Text>
    } else if (payment_type === 'courtesy') {
      return <Text style={styles.purchase__importantText}>Cortesía</Text>
    }
  }

  function getPrice() {
    const payment_type = purchaseItem.data.payment_type;
    if (payment_type !== 'courtesy') {
      return `$${purchaseItem.data.paid} ${purchaseItem.data.currency}`;
    } else {
      return null
    }
  }

  return (
    <View style={styles.purchase__element}>
      <View style={styles.purchase__data}>
        <Text style={styles.purchase__normalText}>{purchaseItem.data.plan_name} <Text style={styles.purchase__importantText}>{getPrice()}</Text></Text>
        <Text style={styles.purchase__normalText}>Pagado el {moment(new Date(purchaseItem.data.created_at)).tz('America/Merida').format(EXP_DATE_FORMAT)}</Text>
        <Text style={styles.purchase__normalText}>Expira el {getExpDate(purchaseItem)}</Text>
        {getCardLabel()}
      </View>
      {
        (
          purchaseItem.data.payment_type === 'conekta' ||
          purchaseItem.data.payment_type === 'credit-card'
        ) &&
        <Image
          style={styles.purchase__cardLogo}
          resizeMode='contain'
          source={getCardBrandIcon(purchaseItem.data.card_brand)}
        />
      }
    </View>
  );
}

export default PurchaseItem;