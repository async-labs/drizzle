import { Meteor } from 'meteor/meteor';
import { ReactiveVar } from 'meteor/reactive-var';
import { _ } from 'meteor/underscore';

import { composeWithTracker } from 'react-komposer';

import {
  Plans,
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

const annualSubscribedVar = new ReactiveVar(null);
const monthlySubscribedVar = new ReactiveVar(null);
const weeklySubscribedVar = new ReactiveVar(null);

function changeWeeklySubscribed(val) {
  weeklySubscribedVar.set(val);
}

function changeMonthlySubscribed(val) {
  monthlySubscribedVar.set(val);
}

function changeAnnualSubscribed(val) {
  annualSubscribedVar.set(val);
}

const annualInProgressVar = new ReactiveVar(false);
const monthlyInProgressVar = new ReactiveVar(false);
const weeklyInProgressVar = new ReactiveVar(false);

function changeWeeklyInProgress(val) {
  weeklyInProgressVar.set(val);
}

function changeMonthlyInProgress(val) {
  monthlyInProgressVar.set(val);
}

function changeAnnualInProgress(val) {
  annualInProgressVar.set(val);
}

function composer(props, onData) {
  const user = Meteor.user();
  const product = getCurrentProduct();
  const wall = getCurrentWall();

  if (!subscriptions({ product })) {
    return null;
  }

  const annualEnabled = product.isAnnualSubscriptionEnabled();
  const monthlyEnabled = product.isMonthlySubscriptionEnabled();
  const weeklyEnabled = product.isWeeklySubscriptionEnabled();

  const isOwner = user._id === product.vendorUserId;
  let plan;

  if (wall && wall.subscriptionPlanIds) {
    plan = Plans.findOne({
      productId: product._id,
      _id: wall.subscriptionPlanIds[0],
      type: { $ne: 'singlePayment' },
    });
  }

  if (weeklySubscribedVar.get() === null) {
    annualSubscribedVar.set(!!(user.annualSubscribedProducts &&
      user.annualSubscribedProducts.indexOf(product._id) !== -1));

    monthlySubscribedVar.set(!!(user.subscribedProducts &&
      user.subscribedProducts.indexOf(product._id) !== -1));

    weeklySubscribedVar.set(!!(user.weeklySubscribedProducts &&
      user.weeklySubscribedProducts.indexOf(product._id) !== -1));
  }

  const annualSubscribed = annualSubscribedVar.get();
  const monthlySubscribed = monthlySubscribedVar.get();
  const weeklySubscribed = weeklySubscribedVar.get();

  const annualInProgress = annualSubscribed || annualInProgressVar.get();
  const monthlyInProgress = monthlySubscribed || monthlyInProgressVar.get();
  const weeklyInProgress = weeklySubscribed || weeklyInProgressVar.get();

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
    hasActiveDiscount: product.isDiscountEnabled() && !user.isEverSubscribed(product._id),
    product,
    isOwner,
    user,
    plan,
    currentSubscription,

    annualEnabled,
    monthlyEnabled,
    weeklyEnabled,

    isSubscribedFreeTrial,
    isPaid,
    isFreeTrialEnabled,
    freeTrialDayCount,
    trialSubscription,

    annualSubscribed,
    monthlySubscribed,
    weeklySubscribed,
    changeAnnualSubscribed,
    changeMonthlySubscribed,
    changeWeeklySubscribed,

    annualInProgress,
    monthlyInProgress,
    weeklyInProgress,
    changeAnnualInProgress,
    changeMonthlyInProgress,
    changeWeeklyInProgress,
  };

  onData(null, data);

  return () => {
    annualSubscribedVar.set(null);
    monthlySubscribedVar.set(null);
    weeklySubscribedVar.set(null);

    annualInProgressVar.set(false);
    monthlyInProgressVar.set(false);
    weeklyInProgressVar.set(false);
  };
}

export default composeWithTracker(composer)(SubscriptionComp);
