import React from 'react';
import { mount } from 'react-mounter';
import { FlowRouter } from 'meteor/kadira:flow-router';

import Layout from '../../client/Layout';
import Wallet from './containers/Wallet';

FlowRouter.route('/wallet', {
  name: 'wallet',
  action() {
    mount(Layout, {
      content: <Wallet />,
    });
  },
});
