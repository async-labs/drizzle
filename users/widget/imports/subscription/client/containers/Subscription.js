import { Meteor } from 'meteor/meteor';
import { ReactiveVar } from 'meteor/reactive-var';
import { _ } from 'meteor/underscore';

import { composeWithTracker } from 'react-komposer';

import {
  Subscriptions,
  ContentWallCharges,
} from 'meteor/drizzle:models';

import SubscriptionComp from '../components/Subscription';
import { getCurrentWall, getCurrentProduct } from '/imports/products/client/api';


function subscriptions({ product }) {
  const subs = [
    Meteor.subscribe('subscription.getCurrentSubscription', product._id).ready(),
  ];

  return _.every(subs);
}

const monthlySubscribedVar = new ReactiveVar(null);

function changeMonthlySubscribed(val) {
  monthlySubscribedVar.set(val);
}

const monthlyInProgressVar = new ReactiveVar(false);

function changeMonthlyInProgress(val) {
  monthlyInProgressVar.set(val);
}

function composer(props, onData) {
  const user = Meteor.user();
  const product = getCurrentProduct();
  const wall = getCurrentWall();

  if (!subscriptions({ product })) {
    return null;
  }

  const monthlyEnabled = product.isMonthlySubscriptionEnabled();

  const isOwner = user._id === product.vendorUserId;

  if (monthlySubscribedVar.get() === null) {
    monthlySubscribedVar.set(!!(user.subscribedProducts &&
      user.subscribedProducts.indexOf(product._id) !== -1));
  }

  const monthlySubscribed = monthlySubscribedVar.get();
  const monthlyInProgress = monthlySubscribed || monthlyInProgressVar.get();

  const now = new Date();

  const trialSubscription = Subscriptions.findOne({
    userId: user._id, productId: product._id, isFreeTrial: true,
    beginAt: { $lte: now }, endAt: { $gte: now },
  });

  const currentSubscription = Subscriptions.findOne({
    userId: user._id, productId: product._id,
    isFreeTrial: { $exists: false },
    beginAt: { $lte: now }, endAt: { $gte: now },
  });

  const { freeTrialDayCount, isFreeTrialEnabled } = product;
  const isSubscribedFreeTrial = user.isSubscribedFreeTrial(product._id);
  const isPaid = !!wall && !!ContentWallCharges.findOne({
    wallId: wall._id,
    userId: user._id,
    $or: [
      { expiredAt: { $exists: false } },
      { expiredAt: { $gt: now } },
    ],
  });

  const data = {
    product,
    isOwner,
    user,
    currentSubscription,

    monthlyEnabled,

    isSubscribedFreeTrial,
    isPaid,
    isFreeTrialEnabled,
    freeTrialDayCount,
    trialSubscription,

    monthlySubscribed,
    changeMonthlySubscribed,

    monthlyInProgress,
    changeMonthlyInProgress,
  };

  onData(null, data);

  return () => {
    monthlySubscribedVar.set(null);
    monthlyInProgressVar.set(false);
  };
}

export default composeWithTracker(composer)(SubscriptionComp);
