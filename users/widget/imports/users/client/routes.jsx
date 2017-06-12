import React from 'react';
import { mount } from 'react-mounter';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { set } from '../../products/client/currentUrl';
import Layout from '../../client/Layout';
import Logout from './containers/Logout.jsx';
import RecoverPasswordForm from './containers/RecoverPassword';

import Login from './containers/Login';
import Register from './containers/Register';
import PromoCode from './containers/PromoCode';


FlowRouter.route('/login', {
  action(params, { url }) {
    if (url) {
      set(url);
    }

    mount(Layout, {
      content: <Login />,
    });
  },
});

FlowRouter.route('/logout', {
  action() {
    mount(Layout, {
      content: <Logout />,
    });
  },
});

FlowRouter.route('/register', {
  action() {
    mount(Layout, {
      content: <Register />,
    });
  },
});

FlowRouter.route('/recover-password', {
  action() {
    mount(Layout, {
      content: <RecoverPasswordForm />,
    });
  },
});

FlowRouter.route('/promo-code', {
  action() {
    mount(Layout, {
      content: <PromoCode />,
    });
  },
});
