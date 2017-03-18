import moment from 'moment';
import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { createSubscription, cancelSubscription } from 'meteor/drizzle:stripe';

import {
  subscribed,
  unsubscribed,
} from 'meteor/drizzle:user-functions';

import {
  Products,
  Subscriptions,
  ContentWalls,
} from 'meteor/drizzle:models';

function ValidateData(options_) {
  const options = options_;

  // save real run
  const runFunc = options_.run;

  // override run
  options.run = function run({ productId, wallId }) {
    if (!this.userId) {
      throw new Meteor.Error('login-required', 'Login is required');
    }

    this.product = Products.findOne(productId);
    if (!this.product || !this.product.vendorUserId) {
      throw new Meteor.Error('invalid-data', 'Product is not found!');
    }

    this.wall = null;

    if (wallId) {
      this.wall = ContentWalls.findOne(wallId);
      if (!this.wall) {
        throw new Meteor.Error('invalid-data', 'Wall is not found!');
      }
    }

    if (!this.product.isMonthlySubscriptionEnabled()) {
      throw new Meteor.Error('invalid-data', 'Subscription is not enabled!');
    }

    if (this.userId === this.product.vendorUserId) {
      throw new Meteor.Error('invalid-data', 'You are vendor!');
    }

    this.vendor = Meteor.users.findOne(this.product.vendorUserId);
    if (!this.vendor) {
      throw new Meteor.Error('invalid-data', 'Vendor is not found!');
    }

    return runFunc.call(this, { productId, wallId });
  };

  return options;
}

new ValidatedMethod({ // eslint-disable-line
  name: 'products.subscribeMonthly',
  mixins: [ValidateData],

  validate: new SimpleSchema({
    productId: { type: String },
    wallId: { type: String, optional: true },
  }).validator(),

  run({ productId }) {
    if (this.product.disabled) {
      throw new Meteor.Error('invalid-data',
        'Membership is not available. Contact owner of the website.');
    }

    const user = Meteor.users.findOne(this.userId);
    if (!user.stripeCustomer) {
      throw new Meteor.Error('card-required', 'Please add card.');
    }

    const { subscribedProducts = [] } = user;
    if (subscribedProducts.indexOf(this.product._id) !== -1) {
      throw new Meteor.Error('invalid-data', 'Already subscribed monthly plan!');
    }

    const modifier = { $addToSet: { subscribedProducts: this.product._id } };

    const now = new Date();

    const subscription = Subscriptions.findOne({
      userId: this.userId,
      productId,
      beginAt: { $lte: now },
      endAt: { $gte: now },
    });

    if (subscription) {
      Meteor.users.update(this.userId, modifier);
      return;
    }

    const endAt = moment(now).add(1, 'M');
    endAt.endOf('day');

    const subObj = {
      userId: user._id,
      productId: this.product._id,
      vendorId: this.vendor._id,
      createdAt: now,
      amount: this.product.subscription.amount,
      beginAt: now,
      endAt: endAt._d,
      monthly: true,
    };

    if (this.wall) {
      subObj.subscribedWallId = this.wall._id;
    }

    subObj._id = Subscriptions.insert(subObj);

    try {
      subObj.stripeSubscriptionId = createSubscription({
        userId: user._id,
        subscriptionId: subObj._id,
        customerId: user.stripeCustomer.id,
        plan: this.product.subscription.stripePlanId,
        productId,
      });

      Subscriptions.update(
        subObj._id,
        { $set: { stripeSubscriptionId: subObj.stripeSubscriptionId } }
      );
    } catch (err) {
      Subscriptions.remove(subObj._id);

      const productUser = user.getProductUser(this.product._id);
      if (productUser && productUser.isCurrentlySubscribed({
        monthly: true,
      })) {
        unsubscribed({
          userId: user._id,
          productId: this.product._id,
          monthly: true,
        });
      }

      throw err;
    }

    if (this.wall) {
      ContentWalls.update(this.wall._id, { $inc: { subscribedUserCount: 1 } });
    }

    Products.update(this.product._id, {
      $inc: {
        subscribedUserCount: 1,
      },
    });

    subscribed({
      userId: user._id,
      productId: this.product._id,
      subscriptionObject: subObj,
      monthly: true,
    });

    Meteor.users.update(this.userId, modifier);
  },
});

new ValidatedMethod({ // eslint-disable-line
  name: 'products.subscribeFreetrial',
  mixins: [ValidateData],

  validate: new SimpleSchema({
    productId: { type: String },
    wallId: { type: String, optional: true },
  }).validator(),

  run({ productId }) {
    if (this.product.disabled) {
      throw new Meteor.Error('invalid-data',
        'Membership is not available. Contact owner of the website.');
    }

    const user = Meteor.users.findOne(this.userId);
    if (!user.stripeCustomer) {
      throw new Meteor.Error('card-required', 'Please add card.');
    }

    const { subscribedProducts = [] } = user;
    if (subscribedProducts.indexOf(this.product._id) !== -1) {
      throw new Meteor.Error('invalid-data', 'Already subscribed monthly plan!');
    }

    const modifier = { $addToSet: { subscribedProducts: this.product._id } };

    const now = new Date();

    const subscription = Subscriptions.findOne({
      userId: this.userId,
      productId,
      beginAt: { $lte: now },
      endAt: { $gte: now },
    });

    if (subscription) {
      throw new Meteor.Error('invalid-data', 'Already subscribed');
    }

    if (subscription) {
      Meteor.users.update(this.userId, modifier);
      return;
    }

    const { freeTrialDayCount } = this.product;

    if (!freeTrialDayCount) {
      throw new Meteor.Error('invalid-data', 'Free trial is not enabled!');
    }

    if (Subscriptions.findOne({ productId: this.product._id, userId: user._id, isFreeTrial: true })
    ) {
      throw new Meteor.Error('invalid-data', 'You have used your Free Trial');
    }

    const endAt = moment(now).add(freeTrialDayCount, 'days');
    endAt.endOf('day');

    const productUser = user.getProductUser(this.product._id);

    const subObj = {
      userId: user._id,
      productId: this.product._id,
      vendorId: this.vendor._id,
      createdAt: now,
      amount: 0,
      beginAt: now,
      endAt: endAt._d,
      isFreeTrial: true,
    };

    if (this.wall) {
      subObj.subscribedWallId = this.wall._id;
    }

    subObj._id = Subscriptions.insert(subObj);

    try {
      subObj.stripeSubscriptionId = createSubscription({
        userId: user._id,
        subscriptionId: subObj._id,
        customerId: user.stripeCustomer.id,
        plan: this.product.subscription.stripePlanId,
        productId,
        trialEnd: endAt._d,
      });

      Subscriptions.update(
        subObj._id,
        { $set: { stripeSubscriptionId: subObj.stripeSubscriptionId } }
      );
    } catch (err) {
      Subscriptions.remove(subObj._id);

      if (productUser && productUser.isCurrentlySubscribed({
        monthly: true,
      })) {
        unsubscribed({
          userId: user._id,
          productId: this.product._id,
          freeTrial: true,
        });
      }

      throw err;
    }

    if (this.wall) {
      ContentWalls.update(this.wall._id, { $inc: { freeTrialSubscribedUserCount: 1 } });
    }

    Products.update(this.product._id, {
      $inc: {
        subscribedUserCount: 1,
      },
    });

    subscribed({
      userId: user._id,
      productId: this.product._id,
      subscriptionObject: subObj,
      freeTrial: true,
    });

    Meteor.users.update(this.userId, modifier);
  },
});

new ValidatedMethod({ // eslint-disable-line
  name: 'products.unsubscribeMonthly',
  mixins: [ValidateData],

  validate: new SimpleSchema({
    productId: { type: String },
    wallId: { type: String, optional: true },
  }).validator(),

  run({ productId }) {
    const modifier = { $pull: { subscribedProducts: this.product._id } };

    const now = new Date();

    const subscription = Subscriptions.findOne({
      userId: this.userId,
      productId,
      beginAt: { $lte: now },
      endAt: { $gte: now },
    });

    Meteor.users.update(this.userId, modifier);

    Products.update(
      { _id: this.product._id, subscribedUserCount: { $gt: 0 } },
      { $inc: { subscribedUserCount: -1 } }
    );

    const user = Meteor.users.findOne(this.userId);
    const productUser = user.getProductUser(productId);

    if (productUser.stripeSubscriptionId) {
      try {
        cancelSubscription({ subId: productUser.stripeSubscriptionId });
      } catch (err) {
        console.log(err);
      }
    }

    unsubscribed({
      userId: this.userId,
      productId: this.product._id,
      monthly: true,
    });

    if (subscription) {
      if (this.wall && this.wall.demo) {
        Subscriptions.remove(subscription._id);

        const amount = -subscription.amount;

        Meteor.users.update(this.vendor._id, { $inc: {
          incomeBalance: amount, incomeCurrentBalance: amount,
          subscriptionBalance: amount, subscriptionCurrentBalance: amount,
        } });

        Products.update(this.product._id, {
          $inc: {
            totalIncome: amount,
            subscriptionIncome: amount,
          },
        });
      }
    }
  },
});

new ValidatedMethod({ // eslint-disable-line
  name: 'products.unsubscribeFreetrial',
  mixins: [ValidateData],

  validate: new SimpleSchema({
    productId: { type: String },
    wallId: { type: String, optional: true },
  }).validator(),

  run({ productId }) {
    const modifier = { $pull: { subscribedProducts: this.product._id } };

    const now = new Date();

    const subscription = Subscriptions.findOne({
      userId: this.userId,
      productId,
      beginAt: { $lte: now },
      endAt: { $gte: now },
    });

    Meteor.users.update(this.userId, modifier);

    Products.update(
      { _id: this.product._id, subscribedUserCount: { $gt: 0 } },
      { $inc: { subscribedUserCount: -1 } }
    );

    const user = Meteor.users.findOne(this.userId);
    const productUser = user.getProductUser(productId);

    if (productUser && productUser.stripeSubscriptionId) {
      try {
        cancelSubscription({ subId: productUser.stripeSubscriptionId });
      } catch (err) {
        console.log(err);
      }
    }

    unsubscribed({
      userId: this.userId,
      productId: this.product._id,
      freeTrial: true,
    });

    if (subscription) {
      Subscriptions.update(subscription._id, { $set: { endAt: now } });

      if (this.wall && this.wall.demo) {
        Subscriptions.remove(subscription._id);

        const amount = -subscription.amount;

        Meteor.users.update(this.product.vendorUserId, { $inc: {
          incomeBalance: amount, incomeCurrentBalance: amount,
          subscriptionBalance: amount, subscriptionCurrentBalance: amount,
        } });

        Products.update(this.product._id, {
          $inc: {
            totalIncome: amount,
            subscriptionIncome: amount,
          },
        });
      }
    }
  },
});
