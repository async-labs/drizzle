import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import {
  ContentWalls,
  SavedWalls,
} from 'meteor/drizzle:models';

Meteor.publish('savedWalls.getByProduct', function getByProduct(params) {
  check(params, {
    productId: String,
    offset: Number,
    limit: Number,
  });

  if (!this.userId) {
    return this.ready();
  }

  const { limit, productId, offset } = params;

  const wallIds = SavedWalls.find(
    { productId, userId: this.userId },
    { limit, skip: offset, sort: { createdAt: -1 } }
  ).map(s => s.wallId);

  return [
    SavedWalls.find(
      { productId, userId: this.userId },
      { limit, skip: offset, sort: { createdAt: -1 } }
    ),
    ContentWalls.find({ _id: { $in: wallIds } }, { limit }),
  ];
});

Meteor.publish('savedWalls.getByWallId', function getByWallId(wallId) {
  check(wallId, String);

  if (!this.userId) {
    return this.ready();
  }

  return SavedWalls.find({ wallId, userId: this.userId });
});
