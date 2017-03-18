import { Meteor } from 'meteor/meteor';

import { error, success } from '../notifier';

const handleCallback = (err) => {
  if (err) {
    return error(err.reason || err);
  }

  return success('Saved');
};

export const toggleMonthlySubscription = ({ productId, state }) =>
  Meteor.call('products/toggleSubscription', productId, state, handleCallback);

export const configMonthlySubscription = ({ productId, amount, stripePlanId }) =>
  Meteor.call('products/configSubscription', productId, { amount, stripePlanId }, handleCallback);

export const toggleFreeTrial = ({ productId, state }) =>
  Meteor.call('products.toggleFreeTrial', { productId, isFreeTrialEnabled: state }, handleCallback);

export const configFreeTrial = ({ productId, freeTrialDayCount }) =>
  Meteor.call('products.configFreeTrial', { productId, freeTrialDayCount }, handleCallback);
