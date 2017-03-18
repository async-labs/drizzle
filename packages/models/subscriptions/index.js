import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { ProductUsers, Products } from 'meteor/drizzle:models';
import schema from './schema';

const Subscriptions = new Mongo.Collection('product_subscriptions');

Subscriptions.schema = schema;
Subscriptions.attachSchema(schema);

Subscriptions.helpers({
  product() {
    return Products.findOne(this.productId);
  },

  user() {
    return ProductUsers.findOne({
      userId: this.userId,
      productId: this.productId,
    });
  },

  userName() {
    const user = Meteor.users.findOne(this.userId);
    return user && user.profile && user.profile.name || '';
  },
});

export default Subscriptions;
