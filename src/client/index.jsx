// @flow
import 'babel-polyfill';

import * as Immutable from 'immutable';
import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader';
import { createStore, combineReducers, compose } from 'redux';
import { Provider } from 'react-redux';
import socketIOClient from 'socket.io-client';

import App from '../shared/app';
import trafficLightReducer from '../shared/reducers/traffic-lights';
import { appContainerSelector } from '../shared/config';

const rootEl = document.querySelector(appContainerSelector);

/* eslint-disable no-underscore-dangle */
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
// const preloadedState = window.__PRELOADED_STATE__;
/* eslint-enable no-underscore-dangle */

const store = createStore(combineReducers(
  { lights: trafficLightReducer }),
  // { lights: Immutable.fromJS(preloadedState.lights)},
  composeEnhancers());

const AppWrapper = (AppComponent, ReduxStore) => (
  <Provider store={ReduxStore}>
    <AppContainer>
      <AppComponent />
    </AppContainer>
  </Provider>
);

const io = socketIOClient(window.location.host);

io.on('connect', () => {
  console.log('[socket.io] A client connected');
});

ReactDOM.render(AppWrapper(App, store), rootEl);

if (module.hot) {
  // flow-disable-next-line
  module.hot.accept('../shared/app', () => {
    /* eslint-disable global-require */
    const NextApp = require('../shared/app').default;
    /* eslint-enable global-require */
    ReactDOM.render(AppWrapper(App), rootEl);
  });
}
