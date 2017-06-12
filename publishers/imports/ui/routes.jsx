import React from 'react';
import { mount } from 'react-mounter';

import { Meteor } from 'meteor/meteor';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { error, success } from './notifier';
import MainLayout from './layouts/containers/MainLayout';
import NotFound from './layouts/components/NotFound.jsx';

import Paywalls from './paywalls/containers/Paywalls';

import Subscriptions from './subscriptions/containers/Subscriptions';

import Payout from './payout/containers/Payout';
import MonthlyIncomeGraph from './payout/containers/MonthlyIncomeGraph';

import DailyAccessChart from './dailyAccess/containers/DailyAccessChart';

import Notifications from './emails/containers/Notifications';
import Setup from './setup/containers/Setup';
import WidgetUI from './widgetUI/containers/WidgetUI';

import Micropayments from './contentWalls/containers/Micropayments';
import ManageContentWall from './contentWalls/containers/ManageContentWall';
import AddContentWall from './contentWalls/containers/AddContentWall';
import WallSettings from './contentWalls/containers/WallSettings';
import SubscriptionConfig from './subscriptions/containers/SubscriptionConfig';

import ConnectVimeo from './vimeo/components/ConnectVimeo';

import Products from './products/containers/Products';
// import Verify from './products/containers/Verify';
import AddProduct from './products/containers/AddProduct';

FlowRouter.route('/', {
  name: 'paywalls',
  action(params, queryParams) {
    mount(MainLayout, {
      content: <Paywalls categoryId={queryParams.categoryId} />,
    });
  },
});

FlowRouter.route('/paywalls/manage/:id', {
  name: 'paywalls.manage',
  action(params) {
    mount(MainLayout, {
      content: <ManageContentWall id={params.id} />,
    });
  },
});

FlowRouter.route('/paywalls/add', {
  name: 'paywalls.add',
  action() {
    mount(MainLayout, {
      content: <AddContentWall />,
    });
  },
});

FlowRouter.route('/single-payments', {
  action() {
    mount(MainLayout, {
      content: <Micropayments />,
    });
  },
});

FlowRouter.route('/subscriptions', {
  name: '/subscriptions',
  action(params, queryParams) {
    mount(MainLayout, {
      content: <Subscriptions id={queryParams.id} />,
    });
  },
});

FlowRouter.route('/subscriptions/config', {
  name: 'subscriptions/config',
  action() {
    mount(MainLayout, {
      content: <SubscriptionConfig />,
    });
  },
});

FlowRouter.route('/payout', {
  name: 'payout',
  action() {
    mount(MainLayout, {
      content: <Payout />,
    });
  },
});

FlowRouter.route('/payout/monthly-graph', {
  name: 'payout/monthly-graph',
  action() {
    mount(MainLayout, {
      content: <MonthlyIncomeGraph />,
    });
  },
});

FlowRouter.route('/daily-access', {
  name: 'daily-access',
  action() {
    mount(MainLayout, {
      content: <DailyAccessChart />,
    });
  },
});

FlowRouter.route('/emails', {
  name: 'notifications',
  action() {
    mount(MainLayout, {
      content: <Notifications />,
    });
  },
});

FlowRouter.route('/setup', {
  name: 'setup',
  action() {
    mount(MainLayout, {
      content: <Setup />,
    });
  },
});

FlowRouter.route('/wall-settings', {
  name: 'wall-settings',
  action() {
    mount(MainLayout, {
      content: <WallSettings />,
    });
  },
});

FlowRouter.route('/custom-logo', {
  name: 'widget-ui',
  action() {
    mount(MainLayout, {
      content: <WidgetUI />,
    });
  },
});

FlowRouter.route('/websites', {
  name: 'websites',
  action() {
    mount(MainLayout, {
      content: <Products />,
    });
  },
});

/*
FlowRouter.route('/websites/verify/:id', {
  name: 'websites.verify',
  action(params) {
    mount(MainLayout, {
      content: <Verify productId={params.id} />,
    });
  },
});*/

FlowRouter.route('/websites/add', {
  name: 'websites.add',
  action() {
    mount(MainLayout, {
      content: <AddProduct />,
    });
  },
});

FlowRouter.route('/vimeo/connect', {
  name: 'connect.vimeo',
  action(params, queryParams) {
    const { state, code, error: errorCode } = queryParams;

    if (errorCode) {
      error(errorCode);
      FlowRouter.go('/wall-settings');
    } else {
      Meteor.call('vimeo.getAccessToken', { state, code }, (err) => {
        if (err) {
          error(err);
        } else {
          success('Connected to Vimeo');
        }

        FlowRouter.go('/wall-settings');
      });
    }

    mount(MainLayout, {
      content: <ConnectVimeo />,
    });
  },
});


FlowRouter.notfound = {
  action() {
    mount(NotFound);
  },
};
