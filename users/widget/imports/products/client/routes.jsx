import React from 'react';
import { mount } from 'react-mounter';
import { FlowRouter } from 'meteor/kadira:flow-router';

import Layout from '../../client/Layout';
import Invoices from './containers/Invoices.jsx';

FlowRouter.route('/history', {
  name: 'history',
  action() {
    mount(Layout, {
      content: (<Invoices />),
    });
  },
});
