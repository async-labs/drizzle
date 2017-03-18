import { Meteor } from 'meteor/meteor';

import { composeWithTracker } from 'react-komposer';

import { Subscriptions } from 'meteor/drizzle:models';

import Monthly from '../components/Monthly';
import { getCurrentWall, getCurrentProduct } from '/imports/products/client/api';

function composer(props, onData) {
  const user = Meteor.user();
  const product = getCurrentProduct();
  const wall = getCurrentWall();

  if (!user || !product) {
    return;
  }

  const price = (product.subscriptionEnabled && product.subscription &&
    product.subscription.amount || 0);

  const now = new Date();

  const monthlySubscription = Subscriptions.findOne({
    userId: user._id,
    productId: product._id,
    monthly: true,
    beginAt: { $lte: now },
    endAt: { $gte: now },
  });

  const data = {
    wall,
    product,
    price,
    monthlySubscription,
    subscribed: props.subscribed,
    changeSubscribed: props.changeSubscribed,
    changeInProgress: props.changeInProgress,
    user,
  };

  onData(null, data);
}

export default composeWithTracker(composer)(Monthly);
