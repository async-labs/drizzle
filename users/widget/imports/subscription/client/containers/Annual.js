import { Meteor } from 'meteor/meteor';

import { composeWithTracker } from 'react-komposer';

import { Subscriptions } from 'meteor/drizzle:models';

import Annual from '../components/Annual';
import { getCurrentWall, getCurrentProduct } from '/imports/products/client/api';

function composer(props, onData) {
  const user = Meteor.user();
  const product = getCurrentProduct();
  const wall = getCurrentWall();

  if (!user || !product) {
    return;
  }

  const price = product.annualSubscription.amount;

  const now = new Date();

  const annualSubscription = Subscriptions.findOne({
    userId: user._id,
    productId: product._id,
    annual: true,
    beginAt: { $lte: now },
    endAt: { $gte: now },
  });

  const data = {
    wall,
    product,
    price,
    annualSubscription,
    subscribed: props.subscribed,
    changeSubscribed: props.changeSubscribed,
    changeInProgress: props.changeInProgress,
    user,
  };

  onData(null, data);
}

export default composeWithTracker(composer)(Annual);
