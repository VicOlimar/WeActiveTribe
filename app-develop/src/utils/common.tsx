import AsyncStorage from '@react-native-community/async-storage';
import { Alert, AlertButton, Dimensions } from 'react-native';
import { DefaultUserContext } from '../contexts/UserContext/UserContext';

const SMALL_BREAK_POINT = 360;

export function capitalize(text: string) {
  if (typeof text !== 'string') return ''
  return text.charAt(0).toUpperCase() + text.slice(1)
}


export async function getUserToken() {
  const userContext = await AsyncStorage.getItem('user_context');
  if (userContext !== null) {
    const user = JSON.parse(userContext) as DefaultUserContext;
    if (user.token) {
      return user.token!.token;
    } else {
      return null
    }
  }
  return null;
}

export function confirmAlert(title: string, message: string, buttons: Array<AlertButton> = [], cancelable: boolean = false) {
  const defaultButtons: Array<AlertButton> = [{
    text: 'Cerrar',
    style: 'cancel',
  }];

  // Works on both Android and iOS
  Alert.alert(
    title,
    message,
    defaultButtons.concat(buttons),
    { cancelable },
  );
}

export function confirmAlertWithInput(title: string, message: string, buttons: Array<AlertButton> = []) {
  const defaultButtons: Array<AlertButton> = [{
    text: 'Cerrar',
    style: 'cancel',
  }];

  // Works on both Android and iOS
  Alert.prompt(
    title,
    message,
    defaultButtons.concat(buttons),
    'plain-text',
  );
}

export function simpleAlert(title: string, message: string, onPress?: any) {
  Alert.alert(title, message, [{ text: 'Entendido', onPress }]);
}

/**
* Function to know if the device is small
*/
export function isSmallDevice() {
  return Dimensions.get('window').width <= SMALL_BREAK_POINT;
}