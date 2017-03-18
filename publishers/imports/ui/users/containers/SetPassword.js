import { composeWithTracker } from 'react-komposer';

import { Meteor } from 'meteor/meteor';

import SetPassword from '../components/SetPassword.jsx';
import { setPassword } from '../actions';

function composer(props, onData) {
  if (Meteor.loggingIn()) {
    return;
  }

  const { token } = props;
  if (!token) {
    return;
  }

  onData(null, { userId: Meteor.userId(), token, setPassword });
}

export default composeWithTracker(composer)(SetPassword);
