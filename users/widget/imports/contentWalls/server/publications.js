import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { ContentWallCharges } from 'meteor/drizzle:models';

Meteor.publish('contentWalls.getWallChargeByWallId', function userPaygCharges(wallId) {
  check(wallId, String);

  if (!this.userId) { return this.ready(); }

  const filter = {
    wallId,
    userId: this.userId,
    $or: [
      { expiredAt: { $exists: false } },
      { expiredAt: { $gt: new Date() } },
    ],
  };

  return ContentWallCharges.find(filter);
});
