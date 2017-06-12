import React from 'react';
import { mount } from 'react-mounter';
import { FlowRouter } from 'meteor/kadira:flow-router';

import Layout from '../../client/Layout';
import Referral from './containers/Referral';

FlowRouter.route('/referral', {
  name: 'referral',
  action() {
    mount(Layout, {
      content: (<Referral />),
    });
  },
});
