import React from 'react';
import { Text, Modal, TouchableHighlight, View } from 'react-native';
import { Credit } from '../../../../services/Credit/Credit';
import { OnlineCredit } from '../../../../services/OnlineCredit/OnlineCredit';

const styles = require('./CreditDetailModal.scss');

type Props = {
  visible: boolean;
  credits: Credit[] | OnlineCredit[];
  title: string;
  onClose?: () => void;
}

type CreditTypeInfo = {
  name: string;
  count: Number;
}

const CreditTypeInfo: React.FC<{ info: CreditTypeInfo }> = ({ info }) => {
  return <View style={styles.credit_type}>
    <Text style={styles.credit_type__text}>{info.name}</Text>
    <Text style={styles.credit_type__value}>{info.count}</Text>
  </View>
}

const CreditDetailModal: React.FC<Props> = ({ title, credits, visible, onClose = () => true }) => {
  function getLessonTypeIDS(): Array<Number> {
    const lessonTypesIds: Array<Number> = [];
    credits.forEach((credit: Credit | OnlineCredit) => {
      if (!lessonTypesIds.includes(credit.lesson_type_id)) {
        lessonTypesIds.push(credit.lesson_type_id);
      }
    });
    return lessonTypesIds;
  }

  function getStudioIDS(): Array<Number> {
    const studiosIds: Array<Number> = [];
    credits.forEach((credit: Credit | OnlineCredit) => {
      if (!studiosIds.includes(credit.studio_id)) {
        studiosIds.push(credit.studio_id);
      }
    });
    return studiosIds;
  }

  function mapCreditTypeData(): Array<CreditTypeInfo> {
    const lessonTypesIds: Array<Number> = getLessonTypeIDS();
    const studiosIds: Array<Number> = getStudioIDS();
    const creditsInfo: Array<CreditTypeInfo> = [];

    lessonTypesIds.forEach((id: Number) => {
      const filteredCredits: Credit[] | OnlineCredit[] = credits.filter((credit: Credit | OnlineCredit) => credit.lesson_type_id === id && credit.lesson_type && !credit.studio_id);
      if (filteredCredits.length > 0) {
        creditsInfo.push({
          name: filteredCredits[0].lesson_type ? filteredCredits[0].lesson_type.name : 'Normales',
          count: filteredCredits.length,
        });
      }
    });

    studiosIds.forEach((id: Number) => {
      const filteredCredits: Credit[] | OnlineCredit[] = credits.filter((credit: Credit | OnlineCredit) => credit.studio_id === id && !credit.lesson_type_id);
      if (filteredCredits.length > 0) {
        creditsInfo.push({
          name: filteredCredits[0].studio ? filteredCredits[0].studio.name : 'Normales',
          count: filteredCredits.length,
        });
      }
    });
    return creditsInfo;
  }

  const creditTypesInfo: CreditTypeInfo[] = mapCreditTypeData();

  return <Modal
    animationType="slide"
    transparent={true}
    visible={visible}
  >
    <View style={styles.credit_detail_modal__centeredView}>
      <View style={styles.credit_detail_modal__modalView}>
        <Text style={styles.credit_detail_modal__title}>{title}</Text>
        <View>
          {
            creditTypesInfo.map((creditTypeInfo: CreditTypeInfo, index: number) => <CreditTypeInfo key={index} info={creditTypeInfo} />)
          }
          {
            creditTypesInfo.length === 0 && <Text style={{ textAlign: 'center' }}>Sin clases disponibles</Text>
          }
        </View>
        <TouchableHighlight
          style={{ ...styles.credit_detail_modal__closeButton }}
          onPress={onClose}
        >
          <Text style={styles.credit_detail_modal__textStyle}>Cerrar</Text>
        </TouchableHighlight>
      </View>
    </View>
  </Modal>
}

export default CreditDetailModal;