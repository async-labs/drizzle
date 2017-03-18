import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { _ } from 'meteor/underscore';
import {
  Products,
  ProductUsers,
  Subscriptions,
  ContentWalls,
  ContentWallCharges,
  Payouts,
} from 'meteor/drizzle:models';

Meteor.publish('vendorWallCharges', function vendorWallCharges(productId, limit) {
  check(productId, String);
  check(limit, Number);

  if (!this.userId) { return this.ready(); }

  const product = Products.findOne(productId, { fields: { vendorUserId: 1 } });
  if (!product || !product.isOwner(this.userId)) {
    return { find() { this.ready(); } };
  }

  const options = { fields: { userId: 1 }, limit, sort: { createdAt: -1 } };
  const userIds = ContentWalls.find(
    { productId },
    options).map((s) => s.userId
  );

  delete options.fields;
  return [
    Meteor.users.find({ _id: { $in: _.uniq(userIds) } }, { fields: { profile: 1, emails: 1 } }),
    ContentWalls.find({ vendorId: this.userId }, options),
  ];
});

Meteor.publish('userPayouts', function userPayouts(limit) {
  check(limit, Number);

  if (!this.userId) { return this.ready(); }

  const options = { limit, sort: { createdAt: -1 } };
  return Payouts.find({ userId: this.userId }, options);
});


Meteor.publishComposite('contentWallCharges', function contentWallCharges(params) {
  check(params, {
    productId: String,
    limit: Number,
    offset: Number,
    datePeriod: {
      beginDate: Date,
      endDate: Date,
    },
  });

  const { productId, datePeriod, limit, offset } = params;

  if (!this.userId) {
    return { find() { this.ready(); } };
  }

  const product = Products.findOne(productId, { fields: { vendorUserId: 1 } });
  if (!product || !product.isOwner(this.userId)) {
    return { find() { this.ready(); } };
  }

  return {
    find() {
      return ContentWallCharges.find({
        productId,
        createdAt: { $gte: datePeriod.beginDate, $lte: datePeriod.endDate },
        amount: { $gt: 0 },
      }, {
        sort: { createdAt: -1 },
        skip: offset,
        limit,
      });
    },

    children: [{
      find(sub) {
        return ProductUsers.find({ userId: sub.userId, productId });
      },
    }],
  };
});

Meteor.publishComposite('subscriptionCharges', function subscriptionCharges(params) {
  check(params, {
    productId: String,
    limit: Number,
    offset: Number,
    datePeriod: {
      beginDate: Date,
      endDate: Date,
    },
  });

  const { productId, datePeriod, limit, offset } = params;

  if (!this.userId) {
    return { find() { this.ready(); } };
  }

  const product = Products.findOne(productId, { fields: { vendorUserId: 1 } });
  if (!product || !product.isOwner(this.userId)) {
    return { find() { this.ready(); } };
  }

  return {
    find() {
      return Subscriptions.find({
        productId,
        createdAt: { $gte: datePeriod.beginDate, $lte: datePeriod.endDate },
        amount: { $gt: 0 },
      }, {
        sort: { createdAt: -1 },
        skip: offset,
        limit,
      });
    },

    children: [{
      find(sub) {
        return ProductUsers.find({ userId: sub.userId, productId });
      },
    }],
  };
});
