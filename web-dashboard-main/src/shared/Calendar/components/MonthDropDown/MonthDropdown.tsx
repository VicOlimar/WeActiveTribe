import React from 'react';
import { Dropdown } from 'react-bootstrap';
import './MonthDropdown.scss';

export interface month {
  name: string;
  id: number;
}

export interface year {
  year: number;
  id: number;
}

type Props = {
  dropDownText?: String,
  dropDownItems?: Array<any>,
  onClick?: Function,
}

const AppDropdown = ({ dropDownText, dropDownItems, onClick }: Props) => {
  return (
    <Dropdown className='header-dropdown'>
      <Dropdown.Toggle id='toggle' className='header-button'>
        {dropDownText}
      </Dropdown.Toggle>

      <Dropdown.Menu>
        {dropDownItems && dropDownItems.map(item => <Dropdown.Item key={item.id} onClick={() => { if (onClick) onClick(item) }}>{item.name ? item.name : item.year }</Dropdown.Item>)}
      </Dropdown.Menu>
    </Dropdown>
  )
}

export default AppDropdown;