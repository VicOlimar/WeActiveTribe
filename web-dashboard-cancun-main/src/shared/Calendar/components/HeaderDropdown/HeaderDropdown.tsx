import React from 'react';
import { Dropdown } from 'react-bootstrap';
import './HeaderDropdown.scss';
import { Instructor } from '../../../../api/Instructor/Instructor';

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
        {dropDownItems && dropDownItems.map((instructor: Instructor) => <Dropdown.Item key={instructor.id} onClick={() => { if (onClick) onClick(instructor) }}>{instructor.name}</Dropdown.Item>)}
      </Dropdown.Menu>
    </Dropdown>
  )
}

export default AppDropdown;