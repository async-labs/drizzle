import moment from 'moment';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { check, Match } from 'meteor/check';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { checkOwnerAndSetup } from 'meteor/drizzle:check-functions';
import { Products } from 'meteor/drizzle:models';

Meteor.methods({
  /* 'products.wallSetupDone'(productId) {
    check(productId, String);

    const product = Products.findOne(productId);
    checkOwnerAndSetup({ product, user: Meteor.user() });

    Products.update(productId, { $set: { isWallSetupDone: true } });
  },*/

  'products.disableFreeArticle'(productId) {
    check(productId, String);

    const product = Products.findOne(productId);
    checkOwnerAndSetup({ product, user: Meteor.user() });

    Products.update(productId, {
      $unset: {
        freeArticleCount: 1,
        freeArticleCountChangedAt: 1,
      },
    });
  },

  /* 'products.getWalkthroughStep'(productId) {
    check(productId, String);

    const product = Products.findOne(productId);
    checkOwnerAndSetup({ product, user: Meteor.user() });

    const isKeyInstalled = product.wpPlugin && product.wpPlugin.isKeyInstalled;
    const installed = product.isScriptInstalled;

    if (!installed && !isKeyInstalled) {
      return { step: 1, path: '/setup' };
    }

    if (!product.isWallSetupDone && !product.usingWordpress) {
      return { step: 2, path: '/wall-settings' };
    }

    return null;
  },*/
});


export const configFreeArticleCount = new ValidatedMethod({
  name: 'products.configFreeArticleCount',
  validate({ productId, count }) {
    check(productId, String);
    check(count, Number);
  },

  run({ productId, count }) {
    const product = Products.findOne(productId);
    checkOwnerAndSetup({ product, user: Meteor.user() });

    const changedAt = product.freeArticleCountChangedAt;
    const now = new Date();

    if (changedAt && now.getYear() === changedAt.getYear() &&
        now.getMonth() === changedAt.getMonth()) {
      throw new Meteor.Error('now-allowed',
        'You can change the number of free articles only once per month.');
    }

    if (!count || count < 1 || count > 5) {
      throw new Meteor.Error('invalid-data',
        'Please enter a number between 1 and 5.');
    }

    Products.update(productId, { $set: {
      freeArticleCount: count,
      freeArticleCountChangedAt: new Date(),
    } });
  },
});

export const configWelcomeEmail = new ValidatedMethod({
  name: 'products.configWelcomeEmail',
  validate({ productId, subject, body }) {
    check(productId, String);
    check(subject, String);
    check(body, String);
  },

  run({ productId, subject, body }) {
    const product = Products.findOne(productId);
    checkOwnerAndSetup({ product, user: Meteor.user() });

    Products.update(productId, { $set: {
      welcomeEmail: {
        subject,
        body,
      },
    } });
  },
});

export const togglePAYG = new ValidatedMethod({
  name: 'products.togglePAYG',
  validate({ productId, state }) {
    check(productId, String);
    check(state, Boolean);
  },

  run({ productId, state }) {
    const product = Products.findOne(productId);
    checkOwnerAndSetup({ product, user: Meteor.user() });

    Products.update(productId, { $set: {
      paygEnabled: state,
    } });
  },
});

export const toggleUpselling = new ValidatedMethod({
  name: 'products.toggleUpselling',
  validate({ productId, type, state }) {
    check(productId, String);
    check(state, Boolean);
    check(type, Match.Where((t) => { // eslint-disable-line new-cap
      check(t, String);
      return ['popular', 'trending', 'related', 'newest'].indexOf(t) !== -1;
    }));
  },

  run({ productId, type, state }) {
    const product = Products.findOne(productId);
    checkOwnerAndSetup({ product, user: Meteor.user() });

    const modifier = { $set: {} };
    modifier.$set[`upsellingConfig.${type}`] = state;

    Products.update(productId, modifier);
  },
});

export const configUpsellingItemCountToShow = new ValidatedMethod({
  name: 'products.configUpsellingItemCountToShow',
  validate({ productId, count }) {
    check(productId, String);
    check(count, Number);
  },

  run({ productId, count }) {
    if (count > 10 || count < 1) {
      throw new Meteor.Error('invalid-data', 'Count should be between 1 and 10');
    }

    const product = Products.findOne(productId);
    checkOwnerAndSetup({ product, user: Meteor.user() });

    Products.update(productId, { $set: { 'upsellingConfig.itemCountToShow': count } });
  },
});

export const configUpsellingPurchasedCount = new ValidatedMethod({
  name: 'products.configUpsellingPurchasedCount',
  validate({ productId, count }) {
    check(productId, String);
    check(count, Number);
  },

  run({ productId, count }) {
    const product = Products.findOne(productId);
    checkOwnerAndSetup({ product, user: Meteor.user() });

    Products.update(productId, { $set: { 'upsellingConfig.purchasedCount': count } });
  },
});

export const configUpsellingUpvoteCount = new ValidatedMethod({
  name: 'products.configUpsellingUpvoteCount',
  validate({ productId, count }) {
    check(productId, String);
    check(count, Number);
  },

  run({ productId, count }) {
    const product = Products.findOne(productId);
    checkOwnerAndSetup({ product, user: Meteor.user() });

    Products.update(productId, { $set: { 'upsellingConfig.upvoteCount': count } });
  },
});

export const configUpsellingUserCount = new ValidatedMethod({
  name: 'products.configUpsellingUserCount',
  validate({ productId, count }) {
    check(productId, String);
    check(count, Number);
  },

  run({ productId, count }) {
    const product = Products.findOne(productId);
    checkOwnerAndSetup({ product, user: Meteor.user() });

    Products.update(productId, { $set: { 'upsellingConfig.userCount': count } });
  },
});

export const configMailgun = new ValidatedMethod({
  name: 'products.configMailgun',
  validate({ productId, apiKey, domain, fromName, fromEmail }) {
    check(productId, String);
    check(apiKey, String);
    check(domain, String);
    check(fromName, String);
    check(fromEmail, String);
  },

  run({ productId, apiKey, domain, fromName, fromEmail }) {
    const product = Products.findOne(productId);
    checkOwnerAndSetup({ product, user: Meteor.user() });

    Products.update(productId, { $set: {
      mailgunConfig: { apiKey, domain, fromName, fromEmail },
    } });
  },
});

export const configDefaultPrice = new ValidatedMethod({
  name: 'products.configDefaultPrice',
  validate({ productId, price }) {
    check(productId, String);
    check(price, Number);
  },

  run({ productId, price }) {
    const product = Products.findOne(productId);
    checkOwnerAndSetup({ product, user: Meteor.user() });

    if (price) {
      Products.update(productId, { $set: {
        defaultWallPrice: price,
      } });
    } else {
      Products.update(productId, { $unset: {
        defaultWallPrice: 1,
      } });
    }
  },
});

export const toggleFreeTrial = new ValidatedMethod({
  name: 'products.toggleFreeTrial',
  validate: new SimpleSchema({
    productId: { type: String },
    isFreeTrialEnabled: { type: Boolean },
  }).validator(),
  run({ productId, isFreeTrialEnabled }) {
    const product = Products.findOne(productId);
    checkOwnerAndSetup({ product, user: Meteor.user() });

    return Products.update(productId, {
      $set: {
        isFreeTrialEnabled,
      },
    });
  },
});

export const configFreeTrial = new ValidatedMethod({
  name: 'products.configFreeTrial',
  validate: new SimpleSchema({
    productId: { type: String },
    freeTrialDayCount: { type: Number },
  }).validator(),
  run({ productId, freeTrialDayCount }) {
    const product = Products.findOne(productId);
    checkOwnerAndSetup({ product, user: Meteor.user() });

    return Products.update(productId, {
      $set: {
        freeTrialDayCount,
      },
    });
  },
});

export const configReferral = new ValidatedMethod({
  name: 'products.configReferral',
  validate: new SimpleSchema({
    productId: { type: String },
    referralConfig: { type: Products.referralConfigSchema },
  }).validator(),
  run({ productId, referralConfig }) {
    const product = Products.findOne(productId);
    checkOwnerAndSetup({ product, user: Meteor.user() });

    Products.update(productId, {
      $set: {
        referralConfig,
      },
    });
  },
});

export const configDiscount = new ValidatedMethod({
  name: 'products.configDiscount',
  validate({ productId, config }) {
    check(productId, String);

    check(config, {
      discountPercent: Match.Optional(Number), // eslint-disable-line new-cap
      activeDayCount: Match.Optional(Number), // eslint-disable-line new-cap
      isEnabled: Boolean,
    });
  },

  run({ productId, config }) {
    const { discountPercent, activeDayCount, isEnabled } = config;

    const product = Products.findOne(productId);
    checkOwnerAndSetup({ product, user: Meteor.user() });

    if (!isEnabled) {
      Products.update(productId, {
        $set: { 'discountConfig.isEnabled': false },
        $unset: { 'discountConfig.promoCode': 1, 'discountConfig.endAt': 1 },
      });

      return;
    }

    const { discountConfig = {} } = product;

    let promoCode = discountConfig.promoCode;
    if (!promoCode) {
      promoCode = `${product.domain.split('.')[0]}${_.random(100, 999)}`;
    }

    const endAt = moment().add(activeDayCount, 'days').endOf('day')._d;

    Products.update(productId, { $set: {
      discountConfig: {
        endAt,
        promoCode,
        discountPercent,
        isEnabled,
        activeDayCount,
      },
    } });
  },
});

export const toggleSocialProof = new ValidatedMethod({
  name: 'products.toggleSocialProof',
  validate: new SimpleSchema({
    productId: { type: String },
    isEnabled: { type: Boolean },
  }).validator(),
  run({ productId, isEnabled }) {
    const product = Products.findOne(productId);
    checkOwnerAndSetup({ product, user: Meteor.user() });

    const modifier = {
      $set: {
        'socialProof.isEnabled': isEnabled,
      },
    };

    return Products.update(productId, modifier);
  },
});

export const updateSocialProofMessage = new ValidatedMethod({
  name: 'products.updateSocialProofMessage',
  validate: new SimpleSchema({
    productId: { type: String },
    message: { type: String },
  }).validator(),
  run({ productId, message }) {
    const product = Products.findOne(productId);
    checkOwnerAndSetup({ product, user: Meteor.user() });

    const modifier = {
      $set: {
        'socialProof.message': message,
      },
    };

    return Products.update(productId, modifier);
  },
});

export const toggleDailyAccess = new ValidatedMethod({
  name: 'products.toggleDailyAccess',
  validate: new SimpleSchema({
    productId: { type: String },
    state: { type: Boolean },
  }).validator(),
  run({ productId, state }) {
    const product = Products.findOne(productId);
    checkOwnerAndSetup({ product, user: Meteor.user() });

    Products.update(productId, {
      $set: {
        'dailyAccessConfig.isEnabled': state,
      },
    });
  },
});

export const updateDailyAccessPrice = new ValidatedMethod({
  name: 'products.updateDailyAccessPrice',
  validate: new SimpleSchema({
    productId: { type: String },
    price: { type: Number },
  }).validator(),
  run({ productId, price }) {
    const product = Products.findOne(productId);
    checkOwnerAndSetup({ product, user: Meteor.user() });

    Products.update(productId, {
      $set: {
        'dailyAccessConfig.price': price,
      },
    });
  },
});
