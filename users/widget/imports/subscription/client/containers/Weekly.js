import { Meteor } from 'meteor/meteor';

import { composeWithTracker } from 'react-komposer';

import { Subscriptions } from 'meteor/drizzle:models';

import Weekly from '../components/Weekly';
import { getCurrentWall, getCurrentProduct } from '/imports/products/client/api';


function composer(props, onData) {
  const user = Meteor.user();
  const product = getCurrentProduct();
  const wall = getCurrentWall();

  const price = (product.weeklySubscriptionEnabled && product.weeklySubscription &&
    product.weeklySubscription.amount || 0);

  const now = new Date();

  const weeklySubscription = Subscriptions.findOne({
    userId: user._id, weekly: true, productId: product._id, planId: { $exists: false },
    beginAt: { $lte: now }, endAt: { $gte: now },
  });

  const data = {
    wall,
    product,
    price,
    weeklySubscription,
    subscribed: props.subscribed,
    changeSubscribed: props.changeSubscribed,
    changeInProgress: props.changeInProgress,
  };

  onData(null, data);
}

export default composeWithTracker(composer)(Weekly);
