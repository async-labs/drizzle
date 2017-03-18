import { Meteor } from 'meteor/meteor';
import createLogger from 'redux-logger';
import thunk from 'redux-thunk';
import {
  createStore,
  combineReducers,
  applyMiddleware,
} from 'redux';

import userReducer from '/imports/users/client/reducer';

const reducers = combineReducers({
  user: userReducer,
});

const logger = createLogger();

let middlewares;

if (Meteor.settings.public.isDevelopment) {
  middlewares = applyMiddleware(thunk, logger);
} else {
  middlewares = applyMiddleware(thunk);
}

export default createStore(reducers, middlewares);
