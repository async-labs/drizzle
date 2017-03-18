import { Meteor } from 'meteor/meteor';
import { Counts } from 'meteor/tmeasday:publish-counts';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { composeWithTracker } from 'react-komposer';
import { currentProduct } from '../../products/currentProduct';

import Conversions from '../components/Conversions';

function compose(props, onData) {
  const product = currentProduct();

  if (!product) {
    return null;
  }

  const params = {
    startDate: FlowRouter.getQueryParam('fromDate'),
    endDate: FlowRouter.getQueryParam('toDate'),
    searchQuery: FlowRouter.getQueryParam('search'),
    productId: product._id,
  };

  const subscription = Meteor.subscribe('productUsers.counters', params);
  const isLoading = !subscription.ready();
  const rates = {};

  if (!isLoading) {
    const counts = {
      registered: Counts.get('productUsers.counters.isRegisteredAtIt'),
      trial: Counts.get('productUsers.counters.isUsedFreeTrial'),
      cancelTrial: Counts.get('productUsers.counters.isCancelledFreeTrial'),
      microPaid: Counts.get('productUsers.counters.isMicropaid'),
      subscription: Counts.get('productUsers.counters.isSubscribed'),
      cancelSubscription: Counts.get('productUsers.counters.isUnsubscribed'),
    };

    rates.signupToTrial = 0;
    rates.signupToMicropaid = 0;
    rates.micropaidToTrial = 0;
    rates.trialToCancelTrial = 0;
    rates.trialToSubscription = 0;
    rates.subscriptionToCancelSubscription = 0;

    if (counts.registered > 0) {
      rates.signupToTrial = Math.round((counts.trial / counts.registered) * 100);
      rates.signupToMicropaid = Math.round((counts.microPaid / counts.registered) * 100);
    }

    if (counts.microPaid > 0) {
      rates.micropaidToTrial = Math.round((counts.trial / counts.microPaid) * 100);
    }

    if (counts.trial > 0) {
      rates.trialToCancelTrial = Math.round((counts.cancelTrial / counts.trial) * 100);
      rates.trialToSubscription = Math.round((counts.subscription / counts.trial) * 100);
    }

    if (counts.subscription > 0) {
      rates.subscriptionToCancelSubscription = Math.round(
        (counts.cancelSubscription / counts.subscription) * 100);
    }
  }

  return onData(null, {
    isLoading,
    rates,
  });
}

export default composeWithTracker(compose)(Conversions);
