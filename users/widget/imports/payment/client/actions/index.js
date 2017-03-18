/* globals Stripe: false */

import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';

import { error } from '/imports/notifier';

import { KeyValues } from 'meteor/drizzle:models';

function setPublishableKey() {
  const key = 'stripePublishableKey';
  const publishableKey = KeyValues.findOne({ key });

  if (!publishableKey || !publishableKey.value) {
    error('Stripe is not configured');
    throw new Meteor.Error('invalid-data', 'Stripe is not configured');
  }

  Stripe.setPublishableKey(publishableKey.value);
}

export function addCard(cardInfo, callback) {
  setPublishableKey();

  Stripe.card.createToken(cardInfo, (status, response) => {
    if (response.error) {
      if (callback) { callback(response.error.message, response); }
    } else {
      Meteor.call('payment.addCard', { source: response.id }, (err, result) => {
        if (callback) { callback(err, result); }
      });
    }
  });
}

export function addBank(bankInfo, callback) {
  setPublishableKey();

  _.extend(bankInfo, {
    country: 'US',
    currency: 'USD',
  }, bankInfo);

  Stripe.bankAccount.createToken(bankInfo, (status, response) => {
    if (response.error) {
      if (callback) { callback(response.error.message, response); }
    } else {
      Meteor.call('payment.addBank', { source: response.id }, (err, result) => {
        if (callback) { callback(err, result); }
      });
    }
  });
}

export function verifyBank(data, callback) {
  Meteor.call('payment.verifyBank', data, (err, result) => {
    if (callback) { callback(err, result); }
  });
}

export function checkApplePayAvailability(callback) {
  setPublishableKey();
  Stripe.applePay.checkAvailability(available => callback(available));
}
