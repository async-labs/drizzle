import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';

import { FlowRouter } from 'meteor/kadira:flow-router';

import { error, success } from '../notifier';

export function login({ email, password }, callback) {
  Meteor.loginWithPassword(email, password, (err) => {
    if (err) {
      error(err);
    } else {
      FlowRouter.go('/');
    }

    if (callback) { callback(err); }
  });
}

export function signup({ email, password, url }, callback) {
  Accounts.createUser({ email, password,
    profile: { url, vendorStatus: true } }, (err) => {
    if (err) {
      error(err.reason);
    } else {
      success('Success! Please check your inbox and click on verification link.');
      FlowRouter.go('/setup');
    }

    if (callback) { callback(err); }
  });
}

export function recoverPassword({ email }, callback) {
  Accounts.forgotPassword({ email }, (err) => {
    if (err) {
      error(err.reason);
    } else {
      success('Sent email with link to reset password.');
      FlowRouter.go('/login');
    }

    if (callback) { callback(err); }
  });
}


export function setPassword({ token, password }, callback) {
  Accounts.resetPassword(token, password, (err) => {
    if (err) {
      error(err.reason);
    } else {
      success('Password is changed');
      FlowRouter.go('/');
    }

    if (callback) { callback(err); }
  });
}

export function exportUsersToCSV(params) {
  Meteor.call('productUsers.exportToCSV', params, (err, csv) => {
    if (!err) {
      const encodedUri = encodeURI(`data:text/csv;charset=utf-8,${csv}`);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', 'drizzle_users.csv');
      document.body.appendChild(link); // Required for FF

      link.click();
    } else {
      error(err);
    }
  });
}

export function exportWallCharges({ productId, startDate, endDate, filter }) {
  Meteor.call('wallCharges.export', { productId, startDate, endDate, filter }, (err, csv) => {
    if (!err) {
      const encodedUri = encodeURI(`data:text/csv;charset=utf-8,${csv}`);
      const link = document.createElement('a');
      link.setAttribute('href', encodedUri);
      link.setAttribute('download', 'drizzle_browsing_history.csv');
      document.body.appendChild(link); // Required for FF

      link.click();
    } else {
      error(err);
    }
  });
}

export function unsubscribe({ productUserId }) {
  Meteor.call('productUsers.unsubscribe', productUserId, (err) => {
    if (err) {
      error(err);
    } else {
      success('Unsubscribed');
    }
  });
}
