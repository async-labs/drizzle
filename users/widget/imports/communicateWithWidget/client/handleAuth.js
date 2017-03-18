/**
 * Fix localStorage on mobile iframe issue.
 */

import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import { Accounts } from 'meteor/accounts-base';
import sendCommand from './sendCommand';
import { get as getCurrentUrl } from '/imports/products/client/currentUrl';

Accounts.onLogin(() => {
  sendCommand({
    url: getCurrentUrl(),
    name: 'saveLoginToken',
    data: {
      loginToken: Meteor._localStorage.getItem('Meteor.loginToken'),
    },
  });
});

Tracker.autorun((comp) => {
  const url = getCurrentUrl();
  if (!url || Meteor.loggingIn()) { return; }

  // User is logged in, we don't need the token
  if (Meteor.userId()) { return; }

  sendCommand({
    url,
    name: 'getLoginToken',
  });

  comp.stop();
});
