import { parse } from 'url';

import { Meteor } from 'meteor/meteor';
import { Email } from 'meteor/email';
import { _ } from 'meteor/underscore';
import { charge as stripeCharge } from 'meteor/drizzle:stripe';

import {
  Subscriptions,
  Products,
  ProductUsers,
  ContentWallCharges,
  PaymentCharges,
} from 'meteor/drizzle:models';

function charge({ amount, url, user }) {
  const transactionFee = 0; // no transaction fee
  const platformFee = Math.round(amount * 4 / 100); // 4% platform fee

  const totalAmount = amount + transactionFee + platformFee;

  let text = '<p>Thank you for supporting content creators!</p>';

  text += `<p>Your charge: $${(totalAmount / 100).toFixed(2)} = `;
  text += `$${(amount / 100).toFixed(2)} (publisher's payout)`;
  // text += ` + $${(transactionFee / 100).toFixed(2)} (transaction fee)`;
  text += ` + $${(platformFee / 100).toFixed(2)} (platform fee)</p>`;

  if (url) {
    text += `<a href="${url}">${url}</a>`;
  } else {
    text += '<a href="https://getdrizzle.com">getdrizzle.com</a>';
  }

  const email = _.findWhere(user.emails, { verified: true });
  let description = 'Thanks for paying via Drizzle';
  if (url) {
    description = `Thanks for paying on ${parse(url).host} via Drizzle`;
  }

  try {
    const obj = stripeCharge({ amount: totalAmount, user, description });

    obj.fee = transactionFee + platformFee;
    obj.net = amount;
    obj.userId = user._id;
    obj.createdAt = new Date();

    const chargeId = PaymentCharges.insert(obj);

    Meteor.users.update(user._id, { $unset: { isCardDeclined: 1 } });

    if (email) {
      Email.send({
        from: 'Drizzle <support@getdrizzle.com>',
        to: email.address,
        subject: `Charged $${(totalAmount / 100).toFixed(2)}`,
        html: text,
      });
    }

    return chargeId;
  } catch (err) {
    if (email) {
      Email.send({
        from: 'Drizzle <support@getdrizzle.com>',
        to: email.address,
        subject: 'Charge failed',
        text: 'Your card is declined. Please update you card information.',
      });
    }

    Email.send({
      from: 'Drizzle <support@getdrizzle.com>',
      to: 'support@getdrizzle.com',
      subject: 'Error on the charge.',
      text: `User id: ${user._id}, Error: ${err.reason || err.message || err}`,
    });

    Meteor.users.update(user._id, { $set: { isCardDeclined: true } });

    throw err;
  }
}

function chargeSubscription({ user, subscriptionId }) {
  const sub = Subscriptions.findOne({
    _id: subscriptionId,
    userId: user._id,
    paid: { $exists: false },
  });

  if (!sub) { return; }

  const product = Products.findOne(sub.productId);
  if (!product) { return; }

  const amount = sub.amountToCharge || sub.amount;

  const chargeId = charge({ amount, url: product.url, user });
  Subscriptions.update(subscriptionId, { $set: { paid: true, chargeId } });
}

function chargeSinglePayment({ user, chargeId }) {
  const chargeObj = ContentWallCharges.findOne({
    _id: chargeId,
    userId: user._id,
    paid: { $exists: false },
  });

  if (!chargeObj) { return; }

  const amount = chargeObj.amountToCharge || chargeObj.amount;

  const id = charge({ amount, url: chargeObj.url, user });
  ContentWallCharges.update(chargeId, { $set: { paid: true, chargeId: id } });
}

function getAmount({ user }) {
  let amount = 0;
  let product;

  const filter = {
    userId: user._id,
    paid: { $exists: false },
    amount: { $gt: 0 },
  };

  ContentWallCharges.find(filter).forEach((ch) => {
    product = Products.findOne(ch.productId);
    if (!product) { return; }

    if (!ch.amountToCharge && !ch.amount) { return; }

    amount += ch.amountToCharge || ch.amount;
  });

  return amount;
}

export function chargeUser({ userId, subscriptionId, chargeId }) {
  const user = Meteor.users.findOne(userId);

  if (!user || !user.stripeCustomer) {
    throw new Meteor.Error('invalid-data', 'Card is required');
  }

  if (subscriptionId) {
    chargeSubscription({ user, subscriptionId });
    return;
  }

  if (chargeId) {
    chargeSinglePayment({ user, chargeId });
    return;
  }

  const amount = getAmount({ user });

  if (!amount || amount <= 0) {
    return;
  }

  if (-amount !== user.walletBalance) {
    Email.send({
      from: 'Drizzle <support@getdrizzle.com>',
      to: 'support@getdrizzle.com',
      subject: 'User balance does not match',
      text: `User id: ${user._id}, Total loan: ${-user.walletBalance}, Charge summary: ${amount}`,
    });

    throw new Meteor.Error('invalid-data', 'User balance does not match');
  }

  const id = charge({ amount, user });

  ContentWallCharges.update(
    { userId: user._id, paid: { $exists: false } },
    { $set: { paid: true, chargeId: id } },
    { multi: true }
  );

  ProductUsers.update(
    { userId: user._id },
    { $set: { totalSpent: 0 } },
    { multi: true }
  );

  Meteor.users.update(user._id, { $set: { walletBalance: 0 } });
}
