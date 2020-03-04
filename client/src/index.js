import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Integration from './integration/IntegrationMercadoPago';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<Integration />, document.getElementById('root'));
serviceWorker.unregister();
