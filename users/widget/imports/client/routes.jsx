import { mount } from 'react-mounter';

import { FlowRouter } from 'meteor/kadira:flow-router';

import NotFound from './NotFound.jsx';

import '../wallet/client/routes.js';
import '../subscription/client/routes.jsx'; // <-- Default route '/'
import '../users/client/routes.jsx';
import '../products/client/routes.jsx';
// import '../savedWalls/client/routes.jsx';
import '../payment/client/routes';
import '../referral/client/routes';

FlowRouter.route('/404', {
  action() {
    mount(NotFound);
  },
});
