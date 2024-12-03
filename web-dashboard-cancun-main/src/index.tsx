import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './routes/App/App';
import * as serviceWorker from './serviceWorker';
import 'moment/locale/es';
import axios from 'axios';

ReactDOM.render(<App />, document.getElementById('root'));

axios.interceptors.response.use(response => {
    return response;
}, error => {
    if(error.response.status === 401){
        window.location.replace("/login");
    }
    return Promise.reject(error);
});
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
