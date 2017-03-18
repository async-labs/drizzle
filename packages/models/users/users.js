/* eslint import/no-unresolved: [2, { ignore: ['meteor/'] }]*/

import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { Roles } from 'meteor/alanning:roles';

import {
  Products,
  ProductUsers,
  Subscriptions,
} from 'meteor/drizzle:models';

Meteor.users.helpers({
  getFullName() {
    const { profile } = this;
    if (!profile) { return ''; }

    return profile.name || `${profile.firstName} ${profile.lastName}`;
  },

  getEmailAddress() {
    const email = _.last(this.emails);

    return email && email.address || undefined;
  },

  isEmailVerified() {
    const email = _.find(this.emails, (e) => e.verified) || _.last(this.emails);

    if (email) {
      return !!email.verified;
    }

    if (this.services && this.services.facebook) {
      return true;
    }

    return false;
  },

  isAdmin() {
    return Roles.userIsInRole(this, 'admin');
  },

  isSubscribedFreeTrial(productId) {
    if (!productId) {
      return false;
    }

    const productUser = ProductUsers.findOne({ productId, userId: this._id });
    return !!productUser && !!productUser.freeTrialBeginAt;
  },

  getProductUser(productId) {
    if (!productId) {
      return null;
    }

    return ProductUsers.findOne({ productId, userId: this._id });
  },

  hasCardInfo() {
    return !!this.stripeCustomer;
  },

  getRegisteredProduct() {
    const productUser = ProductUsers.findOne({ isRegisteredAtIt: true, userId: this._id });
    if (!productUser) {
      return null;
    }

    return Products.findOne(productUser.productId);
  },

  isEverSubscribed(productId) {
    const product = Products.findOne(productId);
    if (!product || !product.vendorUserId) {
      return false;
    }

    return !!Subscriptions.findOne({
      userId: this.userId,
      productId,
      freeTrial: { $exists: false },
      imported: { $exists: false },
    });
  },
});
