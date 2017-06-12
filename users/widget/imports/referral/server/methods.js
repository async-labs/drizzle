import { Meteor } from 'meteor/meteor';
import { Email } from 'meteor/email';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import { generatePromoCode } from 'meteor/drizzle:user-functions';

import {
  Products,
  ProductUsers,
} from 'meteor/drizzle:models';

new ValidatedMethod({ // eslint-disable-line
  name: 'referral.generatePromoCode',

  validate: new SimpleSchema({
    productId: { type: String },
  }).validator(),

  run({ productId }) {
    if (!this.userId) {
      throw new Meteor.Error('login-required', 'Login is required');
    }

    const user = Meteor.user();
    if (!user.hasCardInfo()) {
      throw new Meteor.Error('invalid-data', 'Must add card info!');
    }

    const product = Products.findOne(productId);
    if (!product) {
      throw new Meteor.Error('invalid-data', 'Product is not found!');
    }

    return generatePromoCode({ userId: this.userId, productId });
  },
});

new ValidatedMethod({ // eslint-disable-line
  name: 'referral.sendInvite',

  validate: new SimpleSchema({
    productId: { type: String },
    url: { type: String },
    email: { type: String, regEx: SimpleSchema.RegEx.Email },
  }).validator(),

  run({ productId, email, url }) {
    if (!this.userId) {
      throw new Meteor.Error('login-required', 'Login is required');
    }

    const user = Meteor.user();
    if (!user.hasCardInfo()) {
      throw new Meteor.Error('invalid-data', 'Must add card info!');
    }

    const product = Products.findOne(productId);
    if (!product) {
      throw new Meteor.Error('invalid-data', 'Product is not found!');
    }

    if (!product.isReferralEnabled()) {
      throw new Meteor.Error('invalid-data', 'Product is not enabled referral!');
    }

    const productUser = user.getProductUser(product._id);

    if (!productUser || !productUser.promoCode) {
      throw new Meteor.Error('invalid-data', 'There is no promo code!');
    }

    const { referralConfig: { condition } } = product;

    let conditionText;
    if (condition === 'buyMonthlySubscription') {
      conditionText = 'become a paid subscriber';
    } else if (condition === 'addCardInfo') {
      conditionText = 'add card info';
    } else {
      throw new Meteor.Error('invalid-data', 'Invalid condition');
    }

    const subject = `Your friend ${user.getFullName()} (${user.getEmailAddress()}) sent you a gift`;

    let html = `<p>Your friend ${user.getFullName()} (${user.getEmailAddress()})`;
    html += ` has sent you a promo code: ${productUser.promoCode}.</p>`;

    html += `<p>Sign up on <a href="${url}">${product.domain}</a>`;

    html += `, ${conditionText} and get reward for referred friend.</p>`;

    Email.send({
      from: 'Drizzle <support@getdrizzle.com>',
      subject,
      html,
      to: email,
    });
  },
});

new ValidatedMethod({ // eslint-disable-line
  name: 'referral.validatePromoCode',

  validate: new SimpleSchema({
    promoCode: { type: String },
  }).validator(),

  run({ promoCode }) {
    if (ProductUsers.findOne({ promoCode })) {
      return true;
    }

    throw new Meteor.Error('invalid-data', 'Wrong promo code!');
  },
});
