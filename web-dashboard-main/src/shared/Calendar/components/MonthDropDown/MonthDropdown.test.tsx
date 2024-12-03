import React from 'react';
import ReactDOM from 'react-dom';
import AppDropDown from './MonthDropdown';

it('renders <AppDropDown> without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<AppDropDown />, div);
  ReactDOM.unmountComponentAtNode(div);
});
