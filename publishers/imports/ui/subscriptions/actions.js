import { Meteor } from 'meteor/meteor';

import {
  savePlan as savePlanMethod,
  deletePlan as deletePlanMethod,
} from '/imports/api/subscriptions/methods';

import {
  configDiscount as configDiscountMethod,
} from '/imports/api/products/methods';

import { error, success } from '../notifier';

const handleCallback = (err) => {
  if (err) {
    return error(err.reason || err);
  }

  return success('Saved');
};


export function configDiscount({
  productId,
  config,
}, callback) {
  configDiscountMethod.call(
    { productId, config },
    (err) => {
      if (err) {
        error(err.reason || err);
      } else {
        success('Saved');
      }

      if (callback) {
        callback(err);
      }
    }
  );
}

export const configReferral = ({ productId, referralConfig }) =>
  Meteor.call('products.configReferral', { productId, referralConfig }, handleCallback);

export const toggleMonthlySubscription = ({ productId, state }) =>
  Meteor.call('products/toggleSubscription', productId, state, handleCallback);

export const configMonthlySubscription = ({ productId, amount, stripePlanId }) =>
  Meteor.call('products/configSubscription', productId, { amount, stripePlanId }, handleCallback);

export const toggleWeeklySubscription = ({ productId, state }) =>
  Meteor.call('products/toggleWeeklySubscription', productId, state, handleCallback);

export const configWeeklySubscription = ({ productId, amount, stripePlanId }) =>
  Meteor.call(
    'products/configWeeklySubscription',
    productId,
    { amount, stripePlanId },
    handleCallback
  );

export const toggleAnnualSubscription = ({ productId, state }) =>
  Meteor.call('products/toggleAnnualSubscription', productId, state, handleCallback);

export const configAnnualSubscription = ({ productId, amount, stripePlanId }) =>
  Meteor.call(
    'products/configAnnualSubscription',
    productId,
    { amount, stripePlanId },
    handleCallback
  );

export const toggleFreeTrial = ({ productId, state }) =>
  Meteor.call('products.toggleFreeTrial', { productId, isFreeTrialEnabled: state }, handleCallback);

export const configFreeTrial = ({ productId, freeTrialDayCount }) =>
  Meteor.call('products.configFreeTrial', { productId, freeTrialDayCount }, handleCallback);

export function savePlan(params, callback) {
  savePlanMethod.call(params, (err) => {
    if (err) {
      error(err.reason || err);
    } else {
      success('Saved');
    }

    if (callback) {
      callback(err);
    }
  });
}

export function deletePlan({ planId }, callback) {
  deletePlanMethod.call({ planId }, (err) => {
    if (err) {
      error(err.reason || err);
    } else {
      success('Deleted');
    }

    if (callback) {
      callback(err);
    }
  });
}
