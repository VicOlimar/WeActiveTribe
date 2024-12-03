import { mdiBike, mdiTeach, mdiCreditCardOutline, mdiAccountGroup, mdiSale, mdiCashUsdOutline, mdiBell, mdiSchool } from "@mdi/js";
import React from 'react';

export interface ItemT {
  pathIcon: string;
  color: string;
  text: string;
  size: number;
  routeTo: string;
  component?: React.ReactNode;
}

const color: string = 'white'

export const SideItems: ItemT[] = [
  {
    pathIcon: mdiBike,
    color: color,
    text: 'Entrenadores',
    size: 1,
    routeTo: '/trainers'
  },
  {
    pathIcon: mdiSchool,
    color: color,
    text: 'Tipo de clases',
    size: 1,
    routeTo: '/lessons'
  },
  {
    pathIcon: mdiTeach,
    color: color,
    text: 'Clases',
    size: 1,
    routeTo: '/studio'
  },
  {
    pathIcon: mdiCreditCardOutline,
    color: color,
    text: 'Pagos',
    size: 1,
    routeTo: '/purchases'
  },
  {
    pathIcon: mdiAccountGroup,
    color: color,
    text: 'Usuarios',
    size: 1,
    routeTo: '/users'
  },
  {
    pathIcon: mdiSale,
    color: color,
    text: 'Cupones',
    size: 1,
    routeTo: '/discounts'
  },
  {
    pathIcon: mdiCashUsdOutline,
    color: color,
    text: 'Planes',
    size: 1,
    routeTo: '/plans'
  },
  {
    pathIcon: mdiBell,
    color: color,
    text: 'Notificaciones',
    size: 1,
    routeTo: '/notifications'
  }
]
