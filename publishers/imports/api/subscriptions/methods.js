import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { ValidatedMethod } from 'meteor/mdg:validated-method';

import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { Products, Subscriptions, Plans } from 'meteor/drizzle:models';
import { checkOwnerAndSetup } from 'meteor/drizzle:check-functions';

Meteor.methods({
  'products/configSubscription'(productId, params) {
    check(productId, String);
    check(params, {
      amount: Number,
      stripePlanId: String,
    });

    const data = params;
    if (data.amount < 5 || data.amount > 50) {
      throw new Meteor.Error(
        'invalid-data',
        'Wrong amount. Subscription fee must be between $5 and $50.'
      );
    }

    const product = Products.findOne(productId);
    checkOwnerAndSetup({ product, user: Meteor.user() });

    data.amount *= 100;
    const oldAmount = product.subscription && product.subscription.amount;
    if (oldAmount && data.amount !== oldAmount) {
      data.oldAmount = oldAmount;
    }

    data.changedAt = new Date();

    Products.update(productId, {
      $set: {
        subscription: data,
      },
    });
  },

  'products/toggleSubscription'(productId, state) {
    check(productId, String);
    check(state, Boolean);

    const product = Products.findOne(productId);
    checkOwnerAndSetup({ product, user: Meteor.user() });

    if (Subscriptions.find(
      {
        productId, monthly: true, imported: { $exists: false },
        endAt: { $gte: new Date() },
      }
    ).count() > 0) {
      throw new Meteor.Error(
        'denied',
        'There is an active subscription. So you can not disable subscription.'
      );
    }

    Products.update(productId,
      { $set: { subscriptionEnabled: state } }
    );
  },

  'products/configWeeklySubscription'(productId, params) {
    check(productId, String);
    check(params, {
      amount: Number,
      stripePlanId: String,
    });

    const data = params;
    if (data.amount < 5 || data.amount > 25) {
      throw new Meteor.Error(
        'invalid-data',
        'Wrong amount. Subscription fee must be between $5 and $25.'
      );
    }

    const product = Products.findOne(productId);
    checkOwnerAndSetup({ product, user: Meteor.user() });

    data.amount *= 100;

    const oldAmount = product.subscription && product.subscription.amount;
    if (oldAmount && data.amount !== oldAmount) {
      data.oldAmount = oldAmount;
    }

    data.changedAt = new Date();

    Products.update(productId, {
      $set: {
        weeklySubscription: data,
      },
    });
  },

  'products/toggleWeeklySubscription'(productId, state) {
    check(productId, String);
    check(state, Boolean);

    const product = Products.findOne(productId);
    checkOwnerAndSetup({ product, user: Meteor.user() });

    if (Subscriptions.find(
      { productId, weekly: true, imported: { $exists: false },
        endAt: { $gte: new Date() } }
    ).count() > 0) {
      throw new Meteor.Error(
        'denied',
        'There is an active subscription. So you can not disable subscription.'
      );
    }

    Products.update(productId,
      { $set: { weeklySubscriptionEnabled: state } }
    );
  },

  'products/configAnnualSubscription'(productId, params) {
    check(productId, String);
    check(params, {
      amount: Number,
      stripePlanId: String,
    });

    const data = params;
    if (data.amount < 5 || data.amount > 500) {
      throw new Meteor.Error(
        'invalid-data',
        'Wrong amount. Subscription fee must be between $5 and $500.'
      );
    }

    const product = Products.findOne(productId);
    checkOwnerAndSetup({ product, user: Meteor.user() });

    data.amount *= 100;

    const oldAmount = product.subscription && product.subscription.amount;
    if (oldAmount && data.amount !== oldAmount) {
      data.oldAmount = oldAmount;
    }

    data.changedAt = new Date();

    Products.update(productId, {
      $set: {
        annualSubscription: data,
      },
    });
  },

  'products/toggleAnnualSubscription'(productId, state) {
    check(productId, String);
    check(state, Boolean);

    const product = Products.findOne(productId);
    checkOwnerAndSetup({ product, user: Meteor.user() });

    if (Subscriptions.find(
      { productId, annual: true, imported: { $exists: false },
        endAt: { $gte: new Date() } }
    ).count() > 0) {
      throw new Meteor.Error(
        'denied',
        'There is an active subscription. So you can not disable subscription.'
      );
    }

    Products.update(productId,
      { $set: { annualSubscriptionEnabled: state } }
    );
  },
});

export const savePlan = new ValidatedMethod({
  name: 'subscriptions.savePlan',
  validate: new SimpleSchema({
    productId: {
      type: String,
      regEx: SimpleSchema.RegEx.Id,
    },
    planId: {
      type: String,
      regEx: SimpleSchema.RegEx.Id,
      optional: true,
    },
    name: {
      type: String,
    },
    type: {
      type: String,
    },
    price: {
      type: Number,
    },
    stripePlanId: {
      type: String,
      optional: true,
    },
  }).validator(),

  run({ productId, planId, name, price, type, stripePlanId }) {
    const product = Products.findOne(productId);
    checkOwnerAndSetup({ product, user: Meteor.user() });

    if (price < 500 || price > 50000) {
      throw new Meteor.Error(
        'invalid-data',
        'Wrong amount. Subscription fee must be between $5 and $500.'
      );
    }

    if (planId) {
      const plan = Plans.findOne(planId);
      if (!plan) {
        throw new Meteor.Error('invalid-data', 'Plan not found');
      }

      const data = {
        name,
        price,
        type,
        priceChangedAt: new Date(),
        oldPrice: plan.price,
        stripePlanId,
      };

      Plans.update(planId, { $set: data });
    } else {
      if (Plans.findOne({ productId, name })) {
        throw new Meteor.Error('invalid-data', 'This plan is already exists!');
      }

      Plans.insert({ productId, name, price, type, createdAt: new Date(), stripePlanId });
    }
  },
});

export const deletePlan = new ValidatedMethod({
  name: 'subscriptions.deletePlan',
  validate: new SimpleSchema({
    planId: {
      type: String,
      regEx: SimpleSchema.RegEx.Id,
    },
  }).validator(),

  run({ planId }) {
    const plan = Plans.findOne(planId);
    if (!plan) {
      throw new Meteor.Error('invalid-data', 'Plan not found');
    }

    const product = Products.findOne(plan.productId);
    checkOwnerAndSetup({ product, user: Meteor.user() });

    if (Subscriptions.find({ planId, endAt: { $gte: new Date() } }).count() > 0) {
      throw new Meteor.Error(
        'denied',
        'There is an active subscription. So you can not delete.'
      );
    }

    Plans.remove(planId);
  },
});
