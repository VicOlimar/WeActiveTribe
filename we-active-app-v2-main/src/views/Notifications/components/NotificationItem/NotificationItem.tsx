import React from 'react';
import { Notification } from '../../../../services/Notification/Notification'
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Text } from 'react-native';
import moment from 'moment-timezone';

// @ts-ignore
import styles from  './NotificationItem.scss';


type Props = { notification: Notification, onPress: Function }

const NotificationItem = ({ notification, onPress }: Props) => {

  return (
    <TouchableOpacity onPress={() => onPress(notification)} style={styles.notificationItem__container}>
      <Text style = {styles.notificationItem__title}>
        {notification.title}
      </Text>
      <Text style = {styles.notificationItem__date}>
        Fecha : {moment(notification.created_at).format("D MMMM [del] YYYY")}
      </Text>
    </TouchableOpacity >
  );
}

export default NotificationItem;