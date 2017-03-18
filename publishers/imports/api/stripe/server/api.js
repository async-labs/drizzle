import bodyParser from 'body-parser';

import { _ } from 'meteor/underscore';
import { Picker } from 'meteor/meteorhacks:picker';

import { verifyEvent } from 'meteor/drizzle:stripe';

import {
  Products,
  Subscriptions,
} from 'meteor/drizzle:models';

const EVENTS = [
  'invoice.payment_succeeded',
  'invoice.payment_failed',
];

function paymentSucceeded(obj) {
  if (!obj.subscription) {
    return;
  }

  const subObj = obj.lines && obj.lines.data && obj.lines.data[0];
  if (!subObj) {
    return;
  }

  const { subscriptionId, productId } = subObj.metadata;
  if (!subscriptionId || !productId) {
    return;
  }

  const subscription = Subscriptions.findOne(subscriptionId);
  if (!subscription) {
    return;
  }

  const endAt = new Date(subObj.period.end * 1000);
  const beginAt = new Date(subObj.period.start * 1000);

  if (!subscription.paid) {
    Subscriptions.update(subscriptionId, { $set: {
      paid: true,
      endAt,
      beginAt,
      amount: subObj.amount,
      stripeInvoiceId: obj.id,
    } });

    return;
  }

  const amount = subObj.amount;
  const newObj = _.extend(
    {
      paid: true,
      endAt,
      beginAt,
      amount,
      createdAt: new Date(),
      stripeInvoiceId: obj.id,
    },
    _.pick(subscription, 'userId', 'productId', 'vendorId', 'monthly', 'stripeSubscriptionId')
  );

  if (subscription.isFreeTrial) {
    newObj.monthly = true;
  }

  Subscriptions.insert(newObj);

  Products.update(productId, {
    $inc: {
      totalIncome: amount,
      subscriptionIncome: amount,
      subscribedUserCount: 1,
    },
  });
}

function paymentFailed(obj) {
  if (!obj.subscription) {
    return;
  }

  const subObj = obj.lines && obj.lines.data && obj.lines.data[0];
  if (!subObj) {
    return;
  }

  const { subscriptionId } = subObj.metadata;
  if (!subscriptionId) {
    return;
  }

  const subscription = Subscriptions.findOne(subscriptionId);
  if (!subscription) {
    return;
  }

  const endAt = new Date();

  if (!subscription.paid) {
    Subscriptions.update(subscriptionId, { $set: {
      endAt,
      amount: subObj.amount,
      stripeInvoiceId: obj.id,
    } });

    return;
  }
}

Picker.middleware(bodyParser.urlencoded({ extended: false }));
Picker.middleware(bodyParser.json());

const apiRoutes = Picker.filter((req) => req.method === 'POST');

apiRoutes.route('/stripe/event', (params, req, res) => {
  if (!req.body) {
    return res.end(JSON.stringify({ status: 'invalid', error: 'Body is missing' }));
  }

  if (EVENTS.indexOf(req.body.type) === -1) {
    res.writeHead(200);
    return res.end('ok');
  }

  try {
    const verified = verifyEvent({ eventId: req.body.id });

    if (!verified) {
      res.writeHead(500);
      return res.end('error');
    }
  } catch (ex) {
    console.log(ex);
    res.writeHead(500);
    return res.end('error');
  }

  if (req.body.type === 'invoice.payment_succeeded') {
    paymentSucceeded(req.body.data.object);
  } else if (req.body.type === 'invoice.payment_failed') {
    paymentFailed(req.body.data.object);
  }

  res.writeHead(200);
  return res.end('ok');
});
