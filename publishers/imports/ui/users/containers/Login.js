import { composeWithTracker } from 'react-komposer';

import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';

import Login from '../components/Login.jsx';
import { login } from '../actions';

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

  onData(null, { login });
}

export default composeWithTracker(composer)(Login);
