import React from 'react';
import {
  setDefaultLoadingComponent,
  composeWithTracker,
} from 'react-komposer';


const LoadingComponent = () => (
  <div className="cssload-container">
    <div className="cssload-loading"><i></i><i></i><i></i><i></i></div>
  </div>
);

setDefaultLoadingComponent(LoadingComponent);

import { Meteor } from 'meteor/meteor';

import Menus from '../components/Menus.jsx';

function composer(props, onData) {
  onData(null, { isLoggedIn: !!Meteor.userId(), isLoggingIn: Meteor.loggingIn() });
}

export default composeWithTracker(composer)(Menus);
