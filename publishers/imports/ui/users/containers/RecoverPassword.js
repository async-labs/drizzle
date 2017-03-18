import { composeWithTracker } from 'react-komposer';

import { Meteor } from 'meteor/meteor';

import RecoverPassword from '../components/RecoverPassword.jsx';
import { recoverPassword } from '../actions';

function composer(props, onData) {
  if (Meteor.loggingIn()) {
    return;
  }

  onData(null, { userId: Meteor.userId(), recoverPassword });
}

export default composeWithTracker(composer)(RecoverPassword);
