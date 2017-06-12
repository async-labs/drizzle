import {
  composeWithTracker,
} from 'react-komposer';

import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { FlowRouter } from 'meteor/kadira:flow-router';

import { Products } from 'meteor/drizzle:models';
import { changeProduct, currentProduct } from '../../products/currentProduct';

import MainLayout from '../components/MainLayout.jsx';

let userId;
function composer(props, onData) {
  if (!Meteor.subscribe('_roles').ready()) {
    return;
  }

  const filter = {};
  if (Meteor.user() && !Meteor.user().isAdmin()) {
    filter.vendorUserId = Meteor.userId();
  }

  const options = {
    sort: { domain: 1 },
  };

  const isLoading = !Meteor.subscribe('myProducts', {}).ready();

  const products = Products.find(filter, options).fetch();

  if (userId !== Meteor.userId() && products.length > 0) {
    const product = _.findWhere(products, { asDefault: true }) || products[0];
    changeProduct({ id: product._id });
    userId = Meteor.userId();
  }

  const isLoggedIn = !!Meteor.userId();
  const isLoggingIn = Meteor.loggingIn();

  const { guestCanAccess } = props;

  if (!isLoggingIn && !isLoggedIn && !guestCanAccess) {
    setTimeout(() => {
      FlowRouter.go('/login');
    }, 0);

    return;
  }

  const currentUser = Meteor.user();

  if (currentUser && !currentUser.vendorStatus && !currentUser.isAdmin()) {
    Meteor.logout(() => {
      location.href = `${(currentUser.resetPasswordRequestedUrl || currentUser.registeredAt || 'https://getdrizzle.com/')}?__drizzle_open=1`;
    });

    return;
  }

  /* const product = currentProduct();
  if (product) {
    const currentPath = FlowRouter.current().path;
    Meteor.call('products.getWalkthroughStep', product._id, (err, step) => {
      if (step && step.path && step.path !== currentPath &&
          (!step.nextPath || step.nextPath !== currentPath)) {
        FlowRouter.go(step.path);
      }
    });
  }*/

  onData(null,
    { isLoggedIn,
      isLoading,
      products,
      currentProduct: currentProduct(),
      isLoggingIn,
      userMail: Meteor.user() && Meteor.user().emails[0].address,
      currentUser: Meteor.user(),
    });
}

export default composeWithTracker(composer)(MainLayout);
