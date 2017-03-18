import stripePackage from 'stripe';

import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { Accounts } from 'meteor/accounts-base';
import { _ } from 'meteor/underscore';

import { KeyValues } from 'meteor/drizzle:models';

function getStripe() {
  const key = 'stripeSecretKey';
  const secretKey = KeyValues.findOne({ key });

  if (!secretKey || !secretKey.value) {
    throw new Meteor.Error('invalid-data', 'Stripe is not configured');
  }

  return stripePackage(secretKey.value);
}


export function charge({ amount, user, description }) {
  const Stripe = getStripe();

  const sourceType = 'card'; // user.stripeSourceType || 'card';
  let customer = user.stripeCustomer;
  if (sourceType === 'bank') {
    customer = user.stripeBankCustomer;
    if (customer && customer.bankAccount && customer.bankAccount.status !== 'verified') {
      throw new Meteor.Error('invalid-data', 'Stripe bank account have not verified');
    }
  }

  if (!customer) {
    throw new Meteor.Error('invalid-data', 'Stripe customer required');
  }

  const wrappedCharge = Meteor.wrapAsync(Stripe.charges.create, Stripe.charges);
  const retrieveTransaction = Meteor.wrapAsync(Stripe.balance.retrieveTransaction, Stripe.balance);

  function stripeCharge() {
    const chargeObj = wrappedCharge({
      customer: customer.id,
      amount,
      currency: 'usd',
      description: description || 'Drizzle',
      metadata: { userId: user._id },
    });

    const tr = retrieveTransaction(chargeObj.balance_transaction);

    chargeObj.fee = tr.fee;
    chargeObj.net = tr.net;

    return _.pick(chargeObj, 'transfer', 'status', 'amount', 'id',
                  'balance_transaction', 'metadata', 'fee', 'net');
  }

  try {
    return stripeCharge();
  } catch (err) {
    // pass
  }

  try {
    return stripeCharge();
  } catch (err) {
    // pass
  }

  try {
    return stripeCharge();
  } catch (err) {
    throw new Meteor.Error('stripe-error', err.reason || err.message || err);
  }
}

export function refund({ chargeId }) {
  const Stripe = getStripe();

  const wrappedRefund = Meteor.wrapAsync(Stripe.refunds.create, Stripe.refunds);

  try {
    return wrappedRefund({ charge: chargeId });
  } catch (err) {
    throw new Meteor.Error('stripe-error', err.reason || err.message || err);
  }
}

export function createCustomer({ user, source }) {
  check(source, String);

  const Stripe = getStripe();

  const email = user && _.last(user.emails) || null;

  if (email && !email.verified) {
    Accounts.sendVerificationEmail(user._id);
    throw new Meteor.Error('invalid-data', 'Please verify email');
  }

  try {
    const wrappedCustomers = Meteor.wrapAsync(Stripe.customers.create, Stripe.customers);
    const data = {
      source,
      metadata: { userId: user._id },
    };

    if (email) {
      data.email = email.address;
    }

    const customer = wrappedCustomers(data);
    const sources = customer.sources;
    if (sources && sources.data && sources.data.length) {
      const source2 = sources.data[0];

      if (source2.object === 'bank_account') {
        customer.bankAccount = _.pick(source2, 'id', 'account_holder_name',
          'account_holder_type', 'bank_name', 'country', 'currency',
          'fingerprint', 'last4', 'routing_number');
      } else if (source2.object === 'card') {
        customer.card = _.pick(source2, 'id', 'brand', 'last4', 'exp_month',
          'exp_year', 'country', 'name');
      }
    }

    return _.pick(customer, 'id', 'metadata', 'email', 'default_source', 'card', 'bankAccount');
  } catch (err) {
    throw new Meteor.Error('stripe-error', err.reason || err.message || err);
  }
}

export function retrieveCustomer({ customerId }) {
  check(customerId, String);

  const Stripe = getStripe();

  try {
    const wrappedCustomers = Meteor.wrapAsync(Stripe.customers.retrieve, Stripe.customers);

    const customer = wrappedCustomers(customerId);
    const sources = customer.sources;
    if (sources && sources.data && sources.data.length) {
      const source2 = sources.data[0];

      if (source2.object === 'bank_account') {
        customer.bankAccount = _.pick(source2, 'id', 'account_holder_name',
          'account_holder_type', 'bank_name', 'country', 'currency',
          'fingerprint', 'last4', 'routing_number');
      } else if (source2.object === 'card') {
        customer.card = _.pick(source2, 'id', 'brand', 'last4', 'exp_month',
          'exp_year', 'country', 'name');
      }
    }

    return _.pick(customer, 'id', 'metadata', 'email', 'default_source', 'card', 'bankAccount');
  } catch (err) {
    throw new Meteor.Error('stripe-error', err.reason || err.message || err);
  }
}

export function createSubscription({
  customerId,
  plan,
  trialEnd,
  productId,
  subscriptionId,
  userId,
}) {
  check(customerId, String);
  check(plan, String);

  const Stripe = getStripe();

  try {
    const wrappedCreateSubscription = Meteor.wrapAsync(
      Stripe.subscriptions.create, Stripe.subscriptions);

    const params = {
      customer: customerId,
      metadata: {
        userId,
        productId,
        subscriptionId,
      },
      plan,
    };

    if (trialEnd) {
      params.trial_end = Math.round(trialEnd.getTime() / 1000);
    }

    const obj = wrappedCreateSubscription(params);
    return obj.id;
  } catch (err) {
    throw new Meteor.Error('stripe-error', err.reason || err.message || err);
  }
}

export function updateSubscription({ subId, trialEnd }) {
  check(subId, String);
  check(trialEnd, Date);

  const Stripe = getStripe();

  try {
    const wrappedUpdateSubscription = Meteor.wrapAsync(
      Stripe.subscriptions.update, Stripe.subscriptions);

    const params = {};
    if (trialEnd) {
      params.trial_end = Math.round(trialEnd.getTime() / 1000);
    }

    const obj = wrappedUpdateSubscription(subId, params);
    return obj.id;
  } catch (err) {
    throw new Meteor.Error('stripe-error', err.reason || err.message || err);
  }
}

export function cancelSubscription({ subId }) {
  check(subId, String);

  const Stripe = getStripe();

  try {
    const wrapped = Meteor.wrapAsync(
      Stripe.subscriptions.del, Stripe.subscriptions);

    const obj = wrapped(subId);
    return obj;
  } catch (err) {
    throw new Meteor.Error('stripe-error', err.reason || err.message || err);
  }
}

export function createSource({ customerId, source }) {
  check(customerId, String);
  check(source, String);

  const Stripe = getStripe();

  try {
    const wrappedCreateSource = Meteor.wrapAsync(Stripe.customers.createSource, Stripe.customers);

    const obj = wrappedCreateSource(customerId, { source });
    if (obj.object === 'bank_account') {
      return _.pick(obj, 'id', 'account_holder_name', 'account_holder_type',
        'bank_name', 'country', 'currency', 'fingerprint', 'last4', 'routing_number', 'status');
    } else if (obj.object === 'card') {
      return _.pick(obj, 'id', 'brand', 'last4', 'exp_month', 'exp_year', 'country', 'name');
    }

    return null;
  } catch (err) {
    throw new Meteor.Error('stripe-error', err.reason || err.message || err);
  }
}

export function deleteSource({ customerId, id }) {
  check(customerId, String);
  check(id, String);

  const Stripe = getStripe();

  try {
    const wrappedDeleteSource = Meteor.wrapAsync(Stripe.customers.deleteSource, Stripe.customers);

    return wrappedDeleteSource(customerId, id);
  } catch (err) {
    throw new Meteor.Error('stripe-error', err.reason || err.message || err);
  }
}

export function verifySource({ customerId, id, amounts }) {
  check(customerId, String);
  check(id, String);
  check(amounts, [Number]);

  const Stripe = getStripe();

  try {
    const wrappedVerifySource = Meteor.wrapAsync(Stripe.customers.verifySource, Stripe.customers);

    const obj = wrappedVerifySource(customerId, id, { amounts });
    return _.pick(obj, 'id', 'account_holder_name', 'account_holder_type',
      'bank_name', 'country', 'currency', 'fingerprint', 'last4',
      'routing_number', 'status');
  } catch (err) {
    throw new Meteor.Error('stripe-error', err.reason || err.message || err);
  }
}

export function verifyEvent({ eventId }) {
  check(eventId, String);

  const Stripe = getStripe();

  try {
    const wrappedFunc = Meteor.wrapAsync(Stripe.events.retrieve, Stripe.events);

    return wrappedFunc(eventId);
  } catch (err) {
    throw new Meteor.Error('stripe-error', err.reason || err.message || err);
  }
}
