import React from 'react';
import ReactDOM from 'react-dom';
import Studios from './Login';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Studios />, div);
  ReactDOM.unmountComponentAtNode(div);
});
