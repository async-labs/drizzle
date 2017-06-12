import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { _ } from 'meteor/underscore';
import { Accounts } from 'meteor/accounts-base';

import {
  createCustomer,
  createSource,
  deleteSource,
} from 'meteor/drizzle:stripe';

import { userAddedCardInfo } from 'meteor/drizzle:referral-functions';

const methods = {};

methods.addCard = new ValidatedMethod({
  name: 'payment.addCard',

  validate: new SimpleSchema({
    source: { type: String },
  }).validator(),

  run({ source }) {
    if (!this.userId) {
      throw new Meteor.Error('login-required', 'Login required');
    }

    const user = Meteor.users.findOne(this.userId);

    const email = _.findWhere(user.emails, { verified: true });
    if (!user.services.facebook && !email) {
      Accounts.sendVerificationEmail(this.userId);
      throw new Meteor.Error('invalid-data', 'Please verify your email');
    }

    if (!user.stripeCustomer) {
      const customer = createCustomer({ user, source });
      Meteor.users.update(user._id, {
        $set: { stripeCustomer: customer },
        $unset: { isCardDeclined: 1 },
      });
    } else {
      const oldCard = user.stripeCustomer.card;

      const card = createSource({ customerId: user.stripeCustomer.id, source });
      Meteor.users.update(user._id, {
        $set: { 'stripeCustomer.card': card },
        $unset: { isCardDeclined: 1 },
      });

      try {
        deleteSource({ customerId: user.stripeCustomer.id, id: oldCard.id });
      } catch (e) {
        // pass
      }
    }

    userAddedCardInfo({ user });
  },
});

/* methods.addBank = new ValidatedMethod({
  name: 'payment.addBank',

  validate: new SimpleSchema({
    source: { type: String },
  }).validator(),

  run({ source }) {
    // disable this feature
    const temp = true;
    if (temp) {
      throw new Meteor.Error('invalid-data', 'This feature is disabled');
    }

    if (!this.userId) {
      throw new Meteor.Error('login-required', 'Login required');
    }

    const user = Meteor.users.findOne(this.userId);

    const email = _.findWhere(user.emails, { verified: true });
    if (!user.services.facebook && !email) {
      Accounts.sendVerificationEmail(this.userId);
      throw new Meteor.Error('invalid-data', 'Please verify your email');
    }

    if (!user.stripeBankCustomer) {
      const customer = createCustomer({ user, source });
      Meteor.users.update(user._id, { $set: { stripeBankCustomer: customer } });
    } else {
      let bankAccount = user.stripeBankCustomer.bankAccount;

      if (bankAccount) {
        try {
          deleteSource({ customerId: user.stripeBankCustomer.id, id: bankAccount.id });
        } catch (e) {
          // pass
        }
      }

      bankAccount = createSource({ customerId: user.stripeBankCustomer.id, source });
      Meteor.users.update(user._id, { $set: { 'stripeBankCustomer.bankAccount': bankAccount } });
    }
  },
});

methods.configStripeSourceType = new ValidatedMethod({
  name: 'payment.configStripeSourceType',

  validate: new SimpleSchema({
    type: { type: String },
  }).validator(),

  run({ type }) {
    if (!this.userId) {
      throw new Meteor.Error('login-required', 'Login required');
    }

    if (['card', 'bank'].indexOf(type) === -1) {
      throw new Meteor.Error('invalid-data', 'Wrong type');
    }

    const user = Meteor.users.findOne(this.userId);
    if (type === 'cart' && !user.stripeCustomer) {
      throw new Meteor.Error('invalid-data', 'Please add card');
    }

    if (type === 'bank' && !user.stripeBankCustomer) {
      throw new Meteor.Error('invalid-data', 'Please add bank account');
    }

    Meteor.users.update(this.userId, { $set: { stripeSourceType: type } });
  },
});

methods.verifyBank = new ValidatedMethod({
  name: 'payment.verifyBank',

  validate: new SimpleSchema({
    amount1: { type: Number },
    amount2: { type: Number },
  }).validator(),

  run({ amount1, amount2 }) {
    if (!this.userId) {
      throw new Meteor.Error('login-required', 'Login required');
    }

    const user = Meteor.users.findOne(this.userId);
    if (!user.stripeBankCustomer) {
      throw new Meteor.Error('invalid-data', 'Please add bank account');
    }

    const bankAccount = verifySource({
      customerId: user.stripeBankCustomer.id,
      id: user.stripeBankCustomer.bankAccount.id,
      amounts: [amount1, amount2],
    });

    Meteor.users.update(user._id, { $set: { 'stripeBankCustomer.bankAccount': bankAccount } });
  },
}); */

export default methods;
