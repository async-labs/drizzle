import React from 'react';
import { mount } from 'react-mounter';

import { FlowRouter } from 'meteor/kadira:flow-router';

import { set, get } from '/imports/products/client/currentUrl';
import Layout from '../../client/Layout';
import NotFound from '../../client/NotFound.jsx';

import Subscription from './containers/Subscription';

FlowRouter.route('/', {
  name: 'subscription',
  action(params, queryParams) {
    if (!queryParams.url) {
      if (!get()) {
        mount(NotFound);
        return;
      }
    } else {
      set(queryParams.url);
    }
    mount(Layout, {
      content: (<Subscription />),
    });
  },
});
