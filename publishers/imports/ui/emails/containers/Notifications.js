import { composeWithTracker } from 'react-komposer';

import { Meteor } from 'meteor/meteor';

import Notifications from '../components/Notifications.jsx';
import { toggleConfig } from '../actions';


function composer(props, onData) {
  const user = Meteor.user();
  if (!user) { return; }

  const notifications = user.notifications || {};
  onData(null, { notifications, toggleConfig });
}

export default composeWithTracker(composer)(Notifications);
