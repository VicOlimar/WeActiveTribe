import Dinero from 'dinero.js';

export function getMoneyFormat(amount: number, cents: number = 100, currency: string = '', format: string = '$0,0.00') {
  return `${Dinero({ amount: amount * cents }).toFormat(format)} ${currency}`;
}