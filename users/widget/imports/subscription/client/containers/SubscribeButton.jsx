import { Meteor } from 'meteor/meteor';

import { composeWithTracker } from 'react-komposer';

import { ContentWallCharges } from 'meteor/drizzle:models';
import SubscribeButton from '../components/SubscribeButton.jsx';
import { getCurrentWall, getCurrentProduct } from '/imports/products/client/api';


function composer(props, onData) {
  const user = Meteor.user();
  const product = getCurrentProduct();
  const wall = getCurrentWall();

  if (!user || !product) {
    return;
  }

  const isOwner = user._id === product.vendorUserId;

  const planId = wall && wall.subscriptionPlanIds && wall.subscriptionPlanIds[0];

  const subscriptionEnabled = !!(
    (product.subscriptionEnabled && product.subscription && product.subscription.amount) ||
    (product.weeklySubscriptionEnabled && product.weeklySubscription &&
     product.weeklySubscription.amount) ||
    planId
  );

  let userSubscribed = false;
  if (subscriptionEnabled) {
    userSubscribed = !!(user.subscribedProducts &&
      user.subscribedProducts.indexOf(product._id) !== -1);

    if (!userSubscribed) {
      userSubscribed = !!(user.weeklySubscribedProducts &&
        user.weeklySubscribedProducts.indexOf(product._id) !== -1);
    }

    if (!userSubscribed && planId) {
      userSubscribed = !!(user.subscribedPlans &&
        user.subscribedPlans.indexOf(planId) !== -1);
    }
  }

  const { freeTrialDayCount, isFreeTrialEnabled } = product;
  const isSubscribedFreeTrial = user.isSubscribedFreeTrial(product._id);

  const isPaid = !!wall && !!ContentWallCharges.findOne({
    wallId: wall._id,
    userId: user._id,
    $or: [
      { expiredAt: { $exists: false } },
      { expiredAt: { $gt: new Date() } },
    ],
  });

  const data = {
    isOwner,
    isPaid,
    subscriptionEnabled,
    userSubscribed,

    freeTrialDayCount,
    isSubscribedFreeTrial,
    isFreeTrialEnabled,
  };

  onData(null, data);
}

export default composeWithTracker(composer)(SubscribeButton);
