import { Meteor } from 'meteor/meteor';
import { composeWithTracker } from 'react-komposer';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { ProductUsers } from 'meteor/drizzle:models';

import { getCurrentProduct } from '/imports/products/client/api';

import Wallet from '../components/Wallet';

function compose(props, onData) {
  const user = Meteor.user();
  if (!user) {
    return;
  }

  let amount = 0;
  const product = getCurrentProduct();
  const walletBalance = -(user.walletBalance || 0);
  const depositBalance = user.depositBalance || 0;

  if (!product) {
    return;
  }

  if (!product.paygEnabled) {
    FlowRouter.go('/');
    return;
  }

  const isOwner = user._id === product.vendorUserId;

  const site = ProductUsers.findOne({ userId: user._id, productId: product._id });
  if (site) {
    amount = site.totalSpent || 0;
  }

  onData(null, {
    product,
    amount,
    walletBalance,
    depositBalance,
    isOwner,
    isCardDeclined: !!user.isCardDeclined,
  });
}

export default composeWithTracker(compose)(Wallet);
