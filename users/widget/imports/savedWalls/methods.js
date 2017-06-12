import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import {
   ContentWalls,
   SavedWalls,
 } from 'meteor/drizzle:models';

export const readLater = new ValidatedMethod({
  name: 'savedWalls.readLater',

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

    const userId = this.userId;
    if (SavedWalls.findOne({ wallId, userId })) {
      throw new Meteor.Error('invalid-data', 'Already saved');
    }

    return SavedWalls.insert({
      wallId,
      userId,
      productId: wall.productId,
      createdAt: new Date(),
    });
  },
});
