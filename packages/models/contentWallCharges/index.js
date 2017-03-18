import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { ProductUsers } from 'meteor/drizzle:models';

const ContentWallCharges = new Mongo.Collection('payg_charges');

ContentWallCharges.helpers({
  user() {
    return ProductUsers.findOne({
      userId: this.userId,
      productId: this.productId,
    });
  },
});

if (Meteor.isServer) {
  ContentWallCharges._ensureIndex({
    userId: 1,
    wallId: 1,
  }, { unique: 1 });
}

export default ContentWallCharges;
