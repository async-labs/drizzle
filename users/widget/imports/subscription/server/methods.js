import moment from 'moment';
import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { createSubscription, cancelSubscription } from 'meteor/drizzle:stripe';

import {
  create,
  subscribed,
  unsubscribed,
} from 'meteor/drizzle:user-functions';

import {
  Plans,
  Products,
  ProductUsers,
  Subscriptions,
  ContentWalls,
} from 'meteor/drizzle:models';

function subscribeFn({
  now,
  user,
  product,
  plan,
  vendor,
  wall,
  weekly,
  monthly,
  annual,
  freeTrial,
}) {
  if (product.disabled) {
    throw new Meteor.Error('invalid-data', 'Membership is not available. Contact owner of the website.');
  }

  if (!user.stripeCustomer) {
    throw new Meteor.Error(
      'card-required',
      'Please add your card info to continue using Drizzle.'
    );
  }

  const { freeTrialDayCount } = product;

  if (freeTrial && !freeTrialDayCount) {
    throw new Meteor.Error('invalid-data', 'Free trial is not enabled!');
  }

  if (freeTrial &&
    Subscriptions.findOne({ productId: product._id, userId: user._id, isFreeTrial: true })
  ) {
    throw new Meteor.Error('invalid-data', 'You have used your Free Trial');
  }

  let endAt;
  let stripePlanId;

  if (plan) {
    stripePlanId = plan.stripePlanId;
    if (plan.type === 'monthlySubscription') {
      endAt = moment(now).add(1, 'M');
    } else if (plan.type === 'annualSubscription') {
      endAt = moment(now).add(1, 'Y');
    } else {
      throw new Meteor.Error('invalid-data', 'Invalid plan');
    }
  } else if (monthly) {
    endAt = moment(now).add(1, 'M');
    stripePlanId = product.subscription && product.subscription.stripePlanId;
  } else if (freeTrial) {
    endAt = moment(now).add(freeTrialDayCount, 'days');
    stripePlanId = product.subscription && product.subscription.stripePlanId;
  } else if (weekly) {
    endAt = moment(now).add(1, 'w');
    stripePlanId = product.weeklySubscription && product.weeklySubscription.stripePlanId;
  } else if (annual) {
    endAt = moment(now).add(1, 'Y');
    stripePlanId = product.annualSubscription && product.annualSubscription.stripePlanId;
  } else {
    return;
  }

  if (!stripePlanId) {
    throw new Meteor.Error('invalid-data', 'Stripe plan is not configured!');
  }

  endAt.endOf('day');

  let amount = plan && plan.price || product.subscription && product.subscription.amount;
  if (weekly) {
    amount = product.weeklySubscription && product.weeklySubscription.amount;
  } else if (annual) {
    amount = product.annualSubscription && product.annualSubscription.amount;
  }

  if (!amount) {
    throw new Meteor.Error('invalid-data', 'Subscription is not enabled!');
  }

  if (freeTrial) {
    amount = 0;
  }

  const subObj = {
    userId: user._id,
    productId: product._id,
    vendorId: vendor._id,
    createdAt: now,
    amount,
    beginAt: now,
    endAt: endAt._d,
  };

  if (wall) {
    subObj.subscribedWallId = wall._id;
  }

  if (freeTrial) {
    subObj.isFreeTrial = true;
  } else if (weekly) {
    subObj.weekly = true;
  } else if (monthly) {
    subObj.monthly = true;
  } else if (annual) {
    subObj.annual = true;
  } else if (plan) {
    subObj.planId = plan._id;
  }

  subObj._id = Subscriptions.insert(subObj);

  try {
    subObj.stripeSubscriptionId = createSubscription({
      userId: user._id,
      subscriptionId: subObj._id,
      customerId: user.stripeCustomer.id,
      plan: stripePlanId,
      productId: product._id,
    });

    Subscriptions.update(
      subObj._id,
      { $set: { stripeSubscriptionId: subObj.stripeSubscriptionId } }
    );
  } catch (err) {
    Subscriptions.remove(subObj._id);

    const productUser = user.getProductUser(product._id);

    if (productUser && productUser.isCurrentlySubscribed({
      annual,
      monthly,
      weekly,
      planId: plan && plan._id,
    })) {
      unsubscribed({
        userId: user._id,
        productId: product._id,
        planId: plan && plan._id,
        annual,
        monthly,
        weekly,
        freeTrial,
      });
    }

    throw err;
  }

  if (wall) {
    if (freeTrial) {
      ContentWalls.update(wall._id, { $inc: { freeTrialSubscribedUserCount: 1 } });
    } else {
      ContentWalls.update(wall._id, { $inc: { subscribedUserCount: 1 } });
    }
  }

  Meteor.users.update(vendor._id, { $inc: {
    incomeBalance: amount, incomeCurrentBalance: amount,
    subscriptionBalance: amount, subscriptionCurrentBalance: amount,
  } });

  Products.update(product._id, {
    $inc: {
      totalIncome: amount,
      subscriptionIncome: amount,
      subscribedUserCount: 1,
    },
  });

  subscribed({
    userId: user._id,
    productId: product._id,
    planId: plan && plan._id,
    subscriptionObject: subObj,
    weekly,
    monthly,
    annual,
    freeTrial,
  });
}

new ValidatedMethod({ // eslint-disable-line
  name: 'products.toggleSubscribe',

  validate: new SimpleSchema({
    productId: { type: String },
    wallId: { type: String, optional: true },
    planId: { type: String, optional: true },
    weekly: { type: Boolean, optional: true },
    monthly: { type: Boolean, optional: true },
    annual: { type: Boolean, optional: true },
    freeTrial: { type: Boolean, optional: true },
    subscribe: { type: Boolean },
  }).validator(),

  run({ productId, subscribe, planId, wallId, weekly, monthly, annual, freeTrial }) {
    if (!this.userId) {
      throw new Meteor.Error('login-required', 'Login is required');
    }

    const product = Products.findOne(productId);
    if (!product || !product.vendorUserId) {
      throw new Meteor.Error('invalid-data', 'Product is not found!');
    }

    let wall;

    if (wallId) {
      wall = ContentWalls.findOne(wallId);
      if (!wall) {
        throw new Meteor.Error('invalid-data', 'Wall is not found!');
      }
    }

    if (weekly && !product.isWeeklySubscriptionEnabled()) {
      throw new Meteor.Error('invalid-data', 'Subscription is not enabled!');
    }

    if (monthly && !product.isMonthlySubscriptionEnabled()) {
      throw new Meteor.Error('invalid-data', 'Subscription is not enabled!');
    }

    if (annual && !product.isAnnualSubscriptionEnabled()) {
      throw new Meteor.Error('invalid-data', 'Subscription is not enabled!');
    }

    const plan = Plans.findOne({ _id: planId, productId });
    if (planId && !plan) {
      throw new Meteor.Error('invalid-data', 'Subscription category not found!');
    }

    if (plan && plan.type === 'singlePayment') {
      throw new Meteor.Error('invalid-data', 'Can not subscribe to single payment section');
    }

    if (this.userId === product.vendorUserId) {
      throw new Meteor.Error('invalid-data', 'You are vendor!');
    }

    const user = Meteor.users.findOne(this.userId);
    if (subscribe && !user.stripeCustomer) {
      throw new Meteor.Error('card-required', 'Please add card.');
    }

    const vendor = Meteor.users.findOne(product.vendorUserId);
    if (!vendor) {
      throw new Meteor.Error('invalid-data', 'Vendor is not found!');
    }

    if (subscribe && plan) {
      const { subscribedPlanIds = [] } = user;
      if (subscribedPlanIds.indexOf(product._id) !== -1) {
        throw new Meteor.Error('invalid-data', 'Already subscribed this plan!');
      }
    } else if (subscribe) {
      const { subscribedProducts = [] } = user;
      if (subscribedProducts.indexOf(product._id) !== -1) {
        throw new Meteor.Error('invalid-data', 'Already subscribed monthly plan!');
      }

      const { annualSubscribedProducts = [] } = user;
      if (annualSubscribedProducts.indexOf(product._id) !== -1) {
        throw new Meteor.Error('invalid-data', 'Already subscribed annual plan!');
      }

      const { weeklySubscribedProducts = [] } = user;
      if (weeklySubscribedProducts.indexOf(product._id) !== -1) {
        throw new Meteor.Error('invalid-data', 'Already subscribed weekly plan!');
      }
    }

    const modifier = {};
    if (subscribe) {
      if (planId) {
        modifier.$addToSet = { subscribedPlans: planId };
      } else if (weekly) {
        modifier.$addToSet = { weeklySubscribedProducts: product._id };
      } else if (monthly || freeTrial) {
        modifier.$addToSet = { subscribedProducts: product._id };
      } else if (annual) {
        modifier.$addToSet = { annualSubscribedProducts: product._id };
      }
    } else {
      if (planId) {
        modifier.$pull = { subscribedPlans: planId };
      } else if (weekly) {
        modifier.$pull = { weeklySubscribedProducts: product._id };
      } else if (monthly || freeTrial) {
        modifier.$pull = { subscribedProducts: product._id };
      } else if (annual) {
        modifier.$pull = { annualSubscribedProducts: product._id };
      }
    }

    if (_.isEmpty(modifier)) {
      throw new Meteor.Error('invalid-data', 'Invalid data');
    }

    const now = new Date();
    let subscription;

    if (planId) {
      subscription = Subscriptions.findOne({
        userId: this.userId,
        productId,
        planId,
        beginAt: { $lte: now },
        endAt: { $gte: now },
      });
    } else {
      subscription = Subscriptions.findOne({
        userId: this.userId,
        productId,
        planId: { $exists: false },
        beginAt: { $lte: now },
        endAt: { $gte: now },
      });
    }

    if (subscribe) {
      if (freeTrial && subscription) {
        throw new Meteor.Error('invalid-data', 'Already subscribed');
      }

      if (subscription) {
        Meteor.users.update(this.userId, modifier);
        return;
      }

      subscribeFn({ now, user, product, vendor, plan, wall, weekly, monthly, annual, freeTrial });
      Meteor.users.update(this.userId, modifier);
    } else {
      Meteor.users.update(this.userId, modifier);

      Products.update(
        { _id: product._id, subscribedUserCount: { $gt: 0 } },
        { $inc: { subscribedUserCount: -1 } }
      );

      const productUser = user.getProductUser(productId);
      if (productUser && productUser.stripeSubscriptionId) {
        try {
          cancelSubscription({ subId: productUser.stripeSubscriptionId });
        } catch (err) {
          console.log(err);
        }
      }

      unsubscribed({
        userId: user._id,
        productId: product._id,
        planId: plan && plan._id,
        annual,
        monthly,
        weekly,
        freeTrial,
      });

      if (subscription) {
        if (freeTrial) {
          Subscriptions.update(subscription._id, { $set: { endAt: now } });
        }

        if (wall && wall.demo) {
          Subscriptions.remove(subscription._id);

          const amount = -subscription.amount;

          Meteor.users.update(vendor._id, { $inc: {
            incomeBalance: amount, incomeCurrentBalance: amount,
            subscriptionBalance: amount, subscriptionCurrentBalance: amount,
          } });

          Products.update(product._id, {
            $inc: {
              totalIncome: amount,
              subscriptionIncome: amount,
            },
          });
        }
      }
    }
  },
});

export const saveDiscount = new ValidatedMethod({
  name: 'subscriptions.saveDiscount',

  validate: new SimpleSchema({
    productId: { type: String },
    discountCode: { type: String },
  }).validator(),

  run({ productId, discountCode }) {
    if (!this.userId) {
      throw new Meteor.Error('login-required', 'Login is required');
    }

    const product = Products.findOne(productId);
    if (!product || !product.vendorUserId) {
      throw new Meteor.Error('invalid-data', 'Product is not found!');
    }

    if (!product.isDiscountEnabled()) {
      throw new Meteor.Error('invalid-data', 'Product has no active discount!');
    }

    const { discountConfig } = product;
    if (discountConfig.promoCode !== discountCode) {
      throw new Meteor.Error('invalid-data', 'Wrong discount code!');
    }

    create({ userId: this.userId, productId });
    ProductUsers.update(
      { productId, userId: this.userId },
      { $set: { usedDiscountCode: discountCode } }
    );
  },
});
