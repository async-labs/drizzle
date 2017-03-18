import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { composeWithTracker } from 'react-komposer';

function composer(props, onData) {
  const shouldRedirect = [
    '/login',
    '/register',
    '/recover-password',
  ].indexOf(FlowRouter.current().path) !== -1;

  if (Meteor.loggingIn()) {
    return null;
  }

  if (Meteor.user()) {
    onData(null, {
      user: Meteor.user(),
    });

    if (shouldRedirect) {
      FlowRouter.go('/');
    }
  } else {
    onData(null, {});

    if (!shouldRedirect) {
      FlowRouter.go('/login');
    }
  }

  return null;
}

export default (component) => composeWithTracker(composer)(component);
