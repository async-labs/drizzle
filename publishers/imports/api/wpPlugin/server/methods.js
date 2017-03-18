import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { check } from 'meteor/check';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { checkOwnerAndSetup } from 'meteor/drizzle:check-functions';
import { Products } from 'meteor/drizzle:models';

export const generateKey = new ValidatedMethod({
  name: 'wpPlugin.generateKey',

  validate({ productId }) {
    check(productId, String);
  },

  run({ productId }) {
    if (!this.userId) {
      throw new Meteor.Error('login-required', 'Login required');
    }

    const product = Products.findOne(productId);
    checkOwnerAndSetup({ product, user: Meteor.user(), checkSetup: false });

    Products.update(productId, {
      $set: { 'wpPlugin.apiKey': Random.secret() },
      $unset: { 'wpPlugin.isKeyInstalled': 1 },
    });
  },
});

export const deleteKey = new ValidatedMethod({
  name: 'wpPlugin.deleteKey',

  validate({ productId }) {
    check(productId, String);
  },

  run({ productId }) {
    if (!this.userId) {
      throw new Meteor.Error('login-required', 'Login required');
    }

    const product = Products.findOne(productId);
    checkOwnerAndSetup({ product, user: Meteor.user(), checkSetup: false });

    Products.update(productId, { $unset: { wpPlugin: 1 } });
  },
});
