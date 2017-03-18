import React from 'react';
import { mount } from 'react-mounter';

import { FlowRouter } from 'meteor/kadira:flow-router';

import MainLayout from './layouts/containers/MainLayout';
import NotFound from './layouts/components/NotFound.jsx';

import Paywalls from './paywalls/containers/Paywalls';

import Subscriptions from './subscriptions/containers/Subscriptions';

import Payout from './payout/containers/Payout';
import MonthlyIncomeGraph from './payout/containers/MonthlyIncomeGraph';

import Notifications from './emails/containers/Notifications';
import Setup from './setup/containers/Setup';
import WidgetUI from './widgetUI/containers/WidgetUI';

import Micropayments from './contentWalls/containers/Micropayments';
import ManageContentWall from './contentWalls/containers/ManageContentWall';
import AddContentWall from './contentWalls/containers/AddContentWall';
import WallSettings from './contentWalls/containers/WallSettings';
import SubscriptionConfig from './subscriptions/containers/SubscriptionConfig';

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

FlowRouter.route('/websites/add', {
  name: 'websites.add',
  action() {
    mount(MainLayout, {
      content: <AddProduct />,
    });
  },
});

FlowRouter.notfound = {
  action() {
    mount(NotFound);
  },
};
