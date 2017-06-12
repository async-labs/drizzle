import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import {
  Products,
  ContentWalls,
} from 'meteor/drizzle:models';
import charge from './charge';

export const buyDailyAccess = new ValidatedMethod({
  name: 'dailyAccess.buy',

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
