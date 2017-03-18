import moment from 'moment';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { check, Match } from 'meteor/check';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { checkOwnerAndSetup } from 'meteor/drizzle:check-functions';
import { Products } from 'meteor/drizzle:models';

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
      return ['popular', 'newest'].indexOf(t) !== -1;
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
