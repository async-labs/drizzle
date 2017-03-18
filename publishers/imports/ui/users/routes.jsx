import React from 'react';
import NProgress from 'nprogress';
import { mount } from 'react-mounter';

import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { FlowRouter } from 'meteor/kadira:flow-router';

import MainLayout from '../layouts/containers/MainLayout';

import Login from './containers/Login';
import Signup from './containers/Signup';
import RecoverPassword from './containers/RecoverPassword';
import SetPassword from './containers/SetPassword';
import Users from './containers/Users';

import { error, success } from '../notifier';


FlowRouter.route('/users', {
  name: 'users',
  action(params, queryParams) {
    const { filter, search, fromDate, toDate, offset } = queryParams;
    mount(MainLayout, {
      content: <Users
        filter={filter}
        searchQuery={search}
        fromDate={fromDate}
        toDate={toDate}
        offset={parseInt(offset) || 0}
      />,
    });
  },
});

FlowRouter.route('/login', {
  action() {
    mount(MainLayout, {
      guestCanAccess: true,
      content: <Login />,
    });
  },
});

FlowRouter.route('/logout', {
  action() {
    if (Meteor.isClient) {
      NProgress.start();
      NProgress.set(0.5);

      Meteor.logout(() => {
        NProgress.set(0.7);
        NProgress.done();
        FlowRouter.go('/login');
      });
    }
  },
});

FlowRouter.route('/signup', {
  action() {
    mount(MainLayout, {
      guestCanAccess: true,
      content: <Signup />,
    });
  },
});

FlowRouter.route('/auth/recover-password', {
  action() {
    mount(MainLayout, {
      guestCanAccess: true,
      content: <RecoverPassword />,
    });
  },
});

FlowRouter.route('/auth/recover-password/:token', {
  action(params) {
    mount(MainLayout, {
      guestCanAccess: true,
      content: <SetPassword token={params.token} />,
    });
  },
});

FlowRouter.route('/auth/verify/:token', {
  action(params) {
    if (Meteor.isClient && params.token) {
      Accounts.verifyEmail(params.token, (err) => {
        if (err) {
          error(err.reason || err);
        } else {
          Meteor.call('auth/emailVerified', (err2, nextUrl) => {
            if (!err2 && nextUrl) {
              if (nextUrl.startsWith('/')) {
                FlowRouter.go(nextUrl);
              } else {
                location.href = nextUrl;
              }
            }
          });
          success('Your email was successfully verified!');
        }

        return FlowRouter.go('/');
      });
    } else {
      return FlowRouter.go('/');
    }

    return true;
  },
});
