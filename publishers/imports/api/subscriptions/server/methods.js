import moment from 'moment';
import { Meteor } from 'meteor/meteor';
import { Email } from 'meteor/email';
import { check, Match } from 'meteor/check';

import { checkOwnerAndSetup } from 'meteor/drizzle:check-functions';
import { refund } from 'meteor/drizzle:stripe';
import { unsubscribed } from 'meteor/drizzle:user-functions';
import {
  ProductUsers,
  Products,
  Subscriptions,
  ContentWalls,
  PaymentCharges,
} from 'meteor/drizzle:models';

Meteor.methods({
  'subscriptions/stats'(productId, planId, datePeriod) {
    check(productId, String);
    check(planId, Match.Maybe(String)); // eslint-disable-line new-cap
    check(datePeriod, {
      beginDate: Date,
      endDate: Date,
    });

    const product = Products.findOne(productId);
    checkOwnerAndSetup({ product, user: Meteor.user() });

    const incomes = [];
    const counts = [];
    const dates = {};

    let beginAt = new Date(datePeriod.beginDate);
    let endAt = new Date(datePeriod.beginDate);

    while (moment(endAt).isBefore(datePeriod.endDate)) {
      endAt = moment(beginAt).add(1, 'days')._d; // eslint-disable-line no-underscore-dangle

      if (!moment(endAt).isBefore(datePeriod.endDate)) {
        endAt = moment(datePeriod.endDate).add(1, 'seconds')._d; // eslint-disable-line
      }

      incomes.push(0);
      counts.push(0);
      dates[moment(beginAt).format('YYYYMMDD')] = incomes.length - 1;

      beginAt = moment(beginAt).add(1, 'days')._d; // eslint-disable-line no-underscore-dangle
    }

    const filter = {
      productId,
      isRenewed: { $exists: false },
      $or: [
        { createdAt: { $gte: datePeriod.beginDate, $lte: datePeriod.endDate } },
      ],
    };

    if (!planId) {
      filter.monthly = true;
    }

    const cursor = Subscriptions.find(filter);

    cursor.forEach((sub) => {
      const index = dates[moment(sub.createdAt).format('YYYYMMDD')];

      if (index === undefined || incomes[index] === undefined) {
        return;
      }

      incomes[index] += (sub.amount / 100);
      counts[index] += 1;
    });

    return { daily: { incomes, counts } };
  },

  'subscriptions/getCounts'(productId) {
    check(productId, String);

    const product = Products.findOne(productId);
    checkOwnerAndSetup({ product, user: Meteor.user() });

    const paywallCounts = {};
    const subscriberCounts = {};
    const unsubscriberCounts = {};

    const paywallFilter = {
      productId,
    };

    paywallCounts[''] = ContentWalls.find(paywallFilter).count();
    subscriberCounts[''] = Meteor.users.find({ subscribedProducts: productId }).count();
    unsubscriberCounts[''] = ProductUsers.find({
      isUnsubscribed: true,
      productId: product._id,
    }).count();

    return { paywallCounts, subscriberCounts, unsubscriberCounts };
  },

  'subscriptions.refund'(subId) {
    check(subId, String);

    const sub = Subscriptions.findOne(subId);
    if (!sub) {
      throw new Meteor.Error('invalid-data', 'Subscription not found');
    }

    if (sub.endAt.getTime() <= (new Date()).getTime()) {
      throw new Meteor.Error('invalid-data', 'This subscription has ended');
    }

    const product = Products.findOne(sub.productId);
    checkOwnerAndSetup({ product, user: Meteor.user() });

    let charge;
    if (sub.chargeId) {
      charge = PaymentCharges.findOne(sub.chargeId);
      if (charge) {
        refund({ chargeId: charge.id });
      }
    }

    Subscriptions.remove(subId);

    unsubscribed({
      userId: sub.userId,
      productId: product._id,
      monthly: sub.monthly,
      freeTrial: sub.isFreeTrial,
    });

    Meteor.users.update(sub.userId, { $pull: {
      subscribedProducts: sub.productId,
    } });

    const amount = -sub.amount;
    Meteor.users.update(product.vendorUserId, { $inc: {
      incomeBalance: amount, incomeCurrentBalance: amount,
      subscriptionBalance: amount, subscriptionCurrentBalance: amount,
    } });

    Products.update(product._id, {
      $inc: {
        totalIncome: amount,
        subscriptionIncome: amount,
        subscribedUserCount: -1,
      },
    });

    ProductUsers.update(
      { userId: sub.userId, productId: sub.productId },
      { $set: { isRefunded: true } }
    );

    const vendor = Meteor.users.findOne(product.vendorUserId);
    const user = Meteor.users.findOne(sub.userId);

    if (charge && vendor && vendor.getEmailAddress() && user && user.getEmailAddress()) {
      Email.send({
        from: 'Drizzle <support@getdrizzle.com>',
        to: vendor.getEmailAddress(),
        subject: 'Refund',
        text: `Refund $${(charge.amount / 100).toFixed(2)} was issued to ${user.getEmailAddress()}`,
      });

      let text = 'This email is to confirm a refund of';
      text += ` $${((sub.amountToCharge || sub.amount) / 100).toFixed(2)}.\n`;
      text += 'You will not be able to access premium content ';
      text += `on ${product.domain} effective immediately.`;

      Email.send({
        from: 'Drizzle <support@getdrizzle.com>',
        to: user.getEmailAddress(),
        subject: 'Refund',
        text,
      });
    }
  },
});
