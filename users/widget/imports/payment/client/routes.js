import React from 'react';
import { mount } from 'react-mounter';

import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import { FlowRouter } from 'meteor/kadira:flow-router';

import Layout from '../../client/Layout';
import Card from './containers/Card';

FlowRouter.route('/card-info', {
  name: 'card-info',
  action(params, queryParams) {
    mount(Layout, {
      content: <Card updateCard={!!queryParams.updateCard} />,
    });
  },
});

Tracker.autorun(() => {
  const user = Meteor.user();
  if (!user) { return; }

  if (!user.isCardDeclined) { return; }

  FlowRouter.watchPathChange();
  const currentRoute = FlowRouter.current();

  if (currentRoute.path !== '/card-info') {
    FlowRouter.go('/card-info?updateCard=1');
  }
});
