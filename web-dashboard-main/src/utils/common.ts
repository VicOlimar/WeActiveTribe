import { DefaultUserContext } from "../contexts/UserContext/UserContext";

export function capitalize(text: string) {
  if (typeof text !== 'string') return ''
  return text.charAt(0).toUpperCase() + text.slice(1)
}

export function validateNumber(value: string) {
  var isNumberRegex = /[0-9]|\./;
  return value !== '' ? isNumberRegex.test(value) : true;
}

export function getUserToken() {
  const userContext = window.localStorage.getItem('user_context');
  if(userContext){
    const user = JSON.parse(userContext) as DefaultUserContext;
    return user.token!.token;
  }
  return '';
}