import { Meteor } from 'meteor/meteor';

import { composeWithTracker } from 'react-komposer';

import { getCurrentWall, getCurrentProduct } from '/imports/products/client/api';
import {
  Subscriptions,
} from 'meteor/drizzle:models';

import { toggleSubscribe } from '../actions';
import FreeTrial from '../components/FreeTrial';


function composer(props, onData) {
  const user = Meteor.user();
  const product = getCurrentProduct();
  const wall = getCurrentWall();

  if (!user || !product) {
    return;
  }

  const { freeTrialDayCount, isFreeTrialEnabled } = product;

  const now = new Date();

  const trialSubscription = Subscriptions.findOne({
    userId: user._id, productId: product._id, isFreeTrial: true,
    beginAt: { $lte: now }, endAt: { $gte: now },
  });

  const isSubscribedFreeTrial = user.isSubscribedFreeTrial(product._id);

  const monthlyPrice = product.subscriptionEnabled && product.subscription &&
    product.subscription.amount;

  const data = {
    product,
    wall,
    freeTrialDayCount,
    toggleSubscribe,
    trialSubscription,
    isSubscribedFreeTrial,
    isFreeTrialEnabled,
    monthlyPrice,
  };

  onData(null, data);
}

export default composeWithTracker(composer)(FreeTrial);
