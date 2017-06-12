import React from 'react';
import { mount } from 'react-mounter';

import { FlowRouter } from 'meteor/kadira:flow-router';

import Layout from '../../client/Layout';
import NotFound from '../../client/NotFound.jsx';
import { set, get } from '/imports/products/client/currentUrl';

import ReadLater from './containers/ReadLater.jsx';

FlowRouter.route('/', {
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
      content: (<ReadLater offset={queryParams.offset} />),
    });
  },
});
