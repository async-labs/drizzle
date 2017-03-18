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
  },
});

export default methods;
