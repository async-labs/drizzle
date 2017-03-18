import { composeWithTracker } from 'react-komposer';

import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';

import Signup from '../components/Signup.jsx';
import { signup } from '../actions';

function composer(props, onData) {
  if (Meteor.loggingIn()) {
    return;
  }

  if (Meteor.userId()) {
    setTimeout(() => {
      FlowRouter.go('/');
    }, 0);

    return;
  }

  onData(null, { signup });
}

export default composeWithTracker(composer)(Signup);
