import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';

import {
  Subscriptions,
  Products,
  ProductUsers,
  ContentWalls,
  ContentWallCharges,
} from 'meteor/drizzle:models';

import { getScore } from 'meteor/drizzle:util';
import { subscriberVisitedWall } from '../../subscription/server';

import {
  chargePAYG as charge,
  unlock as unlockFn,
} from './index';

export const chargePAYG = new ValidatedMethod({
  name: 'products.chargePAYG',

  validate: new SimpleSchema({
    wallId: { type: String },
  }).validator(),

  run({ wallId }) {
    const wall = ContentWalls.findOne(wallId);
    if (!wall) {
      throw new Meteor.Error('invalid-data', 'Paywall is not enabled.');
    }

    if (!this.userId) {
      throw new Meteor.Error('login-required', 'Login is required');
    }

    const user = Meteor.users.findOne(this.userId);
    const product = Products.findOne(wall.productId);
    if (!product || !product.vendorUserId) {
      throw new Meteor.Error('invalid-data', 'Website is not found!');
    }

    const vendor = Meteor.users.findOne(product.vendorUserId);
    if (!vendor) {
      throw new Meteor.Error('invalid-data', 'Website owner is not found!');
    }

    return charge({ user, vendor, product, wall });
  },
});

export const getUserCount = new ValidatedMethod({
  name: 'products.getUserCount',

  validate: new SimpleSchema({
    productId: { type: String },
  }).validator(),

  run({ productId }) {
    return ProductUsers.find({ productId }).count();
  },
});

export const unlock = new ValidatedMethod({
  name: 'products.unlock',

  validate: new SimpleSchema({
    wallId: { type: String },
  }).validator(),

  run({ wallId }) {
    const wall = ContentWalls.findOne(wallId);
    if (!wall) {
      throw new Meteor.Error('invalid-data', 'Paywall is not enabled.');
    }

    if (!this.userId) {
      throw new Meteor.Error('login-required', 'Login is required');
    }

    const user = Meteor.users.findOne(this.userId);
    const product = Products.findOne(wall.productId);
    if (!product || !product.vendorUserId) {
      throw new Meteor.Error('invalid-data', 'Website is not found!');
    }

    const vendor = Meteor.users.findOne(product.vendorUserId);
    if (!vendor) {
      throw new Meteor.Error('invalid-data', 'Website owner is not found!');
    }

    return unlockFn({ user, vendor, product, wall });
  },
});

export const getPurchasedCount = new ValidatedMethod({
  name: 'products.getPurchasedCount',

  validate: new SimpleSchema({
    productId: { type: String },
  }).validator(),

  run({ productId }) {
    if (!this.userId) {
      throw new Meteor.Error('login-required', 'Login is required');
    }

    return ContentWallCharges.find({ userId: this.userId, productId }).count();
  },
});


function autoDecrypt(wall) {
  if (!wall.autoDecryption) {
    return false;
  }

  const config = wall.autoDecryptionConfig || {};
  if ((config.viewCountLimit || 1000) > wall.viewCount) {
    return false;
  }

  const viewCount = wall.viewCount || 1;
  const income = wall.totalIncome / 100; // converting to dollars from cents

  const cpm = (income / viewCount) * 1000;

  return cpm < (config.cpm || 2);
}

function sendContent(connection, wall, product) {
  const givenContents = connection.given_wall_contents || {};
  givenContents[wall._id] = 1;
  connection.given_wall_contents = givenContents; // eslint-disable-line

  if (product.isClientSide) {
    return 'client side content';
  }

  return wall.content && wall.content.original;
}

export const getWallContent = new ValidatedMethod({
  name: 'products.getWallContent',

  validate: new SimpleSchema({
    wallId: { type: String },
    viewport: {
      type: Object,
      blackbox: true,
      optional: true,
    },
  }).validator(),

  run({ wallId, viewport }) {
    const wall = ContentWalls.findOne(wallId);

    if (!wall) {
      throw new Meteor.Error('not-found', 'Paywall is not found');
    }

    const givenContents = this.connection.given_wall_contents || {};
    if (!wall.demo && givenContents[wall._id]) {
      throw new Meteor.Error('already-given', 'Already given the content');
    }

    const product = Products.findOne(wall.productId, {
      fields: {
        isClientSide: 1,
        vendorUserId: 1,
      },
    });

    if (!product) {
      throw new Meteor.Error('not-found', 'Website is not found');
    }

    const content = wall.content && wall.content.original;

    if (!content && !product.isClientSide) {
      throw new Meteor.Error('invalid-data', 'There is no content for this wall');
    }

    /**
     * Wall is disabled, no need more checks. -> send content.
     */
    if (wall.disabled) {
      return sendContent(this.connection, wall, product);
    }

    /**
     * Check if viewport is bigger than width configuration. If its true -> send content.
     */
    if (wall.viewportConfig && viewport) {
      if (!wall.viewportConfig.disabled && viewport.width > wall.viewportConfig.width) {
        return sendContent(this.connection, wall, product);
      }
    }

    /**
     * autoDecrypt -> send content.
     */
    if (autoDecrypt(wall)) {
      return sendContent(this.connection, wall, product);
    }

    /**
     * Paid content -> ask for login.
     */
    if (!this.userId) {
      this.connection.given_wall_contents = {};
      throw new Meteor.Error('not-paid', 'Login required');
    }

    const user = Meteor.user();
    if (user.isCardDeclined) {
      throw new Meteor.Error('card-declined', 'Card is declined. Please update card info');
    }

    /**
     * Product Vendor is user -> send content.
     */
    if (product.vendorUserId === this.userId) {
      return sendContent(this.connection, wall, product);
    }

    const productUser = user.getProductUser(product._id);

    // user has free unlimited access
    if (productUser && productUser.hasFreeAccess) {
      return sendContent(this.connection, wall, product);
    }

    const now = new Date();
    const contentWallCharge = ContentWallCharges.findOne({
      wallId,
      userId: this.userId,
      $or: [
        { expiredAt: { $exists: false } },
        { expiredAt: { $gt: now } },
      ],
    }, {
      fields: { _id: 1 },
    });

    /**
     * Found a charge -> send content.
     */
    if (contentWallCharge) {
      return sendContent(this.connection, wall, product);
    }

    const subscription = Subscriptions.findOne({
      userId: this.userId,
      productId: product._id,
      beginAt: { $lte: now },
      endAt: { $gte: now },
    }, {
      fields: { _id: 1 },
    });

    /**
     * Found the subscription -> send content.
     */
    if (subscription) {
      subscriberVisitedWall({ userId: this.userId, wall });
      return sendContent(this.connection, wall, product);
    }

    /**
     * User did not paid -> send error.
     */
    throw new Meteor.Error('not-paid', 'User has not paid');
  },
});

export const increaseWallViewCount = new ValidatedMethod({
  name: 'products.increaseWallViewCount',
  validate: new SimpleSchema({
    wallId: { type: String },
    unique: { type: Boolean },
  }).validator(),

  run({ wallId, unique }) {
    this.unblock();

    const conn = this.connection;
    const viewedWalls = conn.viewed_walls || {};
    if (!viewedWalls[wallId]) {
      const modifier = { viewCount: 1 };

      if (unique) {
        modifier.uniqueViewCount = 1;
      }

      ContentWalls.update(wallId, { $inc: modifier });
      viewedWalls[wallId] = 1;
      conn.viewed_walls = viewedWalls;
    }
  },
});

export const upvote = new ValidatedMethod({
  name: 'products.upvote',

  validate: new SimpleSchema({
    wallId: { type: String },
  }).validator(),

  run({ wallId }) {
    const wall = ContentWalls.findOne(wallId);

    if (!wall) {
      throw new Meteor.Error('not-found', 'Paywall not found');
    }

    if (!this.userId) {
      throw new Meteor.Error('login-required', 'Login required!');
    }

    const ch = ContentWallCharges.findOne({ userId: this.userId, wallId });

    const now = new Date();
    const subscription = Subscriptions.findOne(
      { userId: this.userId, productId: wall.productId,
        beginAt: { $lte: now }, endAt: { $gte: now } });

    const paid = !!ch || !!subscription;

    if (!paid) {
      throw new Meteor.Error('invalid-data', 'Pay or unlock in order to upvote');
    }

    const userId = this.userId;
    if (wall.upvotedUserIds && wall.upvotedUserIds.indexOf(userId) !== -1) {
      throw new Meteor.Error('invalid-data', 'Already recommended');
    }

    const score = getScore((wall.upvoteCount || 0) + 1, wall.createdAt);

    ContentWalls.update(wall._id,
      { $inc: { upvoteCount: 1 }, $addToSet: { upvotedUserIds: userId }, $set: { score } });

    if (wall.demo) {
      Meteor.setTimeout(function setTimeout() { // eslint-disable-line prefer-arrow-callback
        ContentWalls.update(wall._id,
          { $inc: { upvoteCount: -1 }, $pull: { upvotedUserIds: userId } });
      }, 30 * 1000);
    }
  },
});
