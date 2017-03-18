import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { _ } from 'meteor/underscore';
import schema from './schema';

class UsersCollection extends Mongo.Collection {
  insert(doc, callback) {
    const now = new Date();

    const user = _.extend({
      freeReadArticleCount: 0,
      freeQuotaTrackingDate: now.getFullYear() * 100 + now.getMonth(),
    }, doc);

    return super.insert(user, callback);
  }
}

const ProductUsers = new UsersCollection('product_users');

ProductUsers.schema = schema;
ProductUsers.attachSchema(schema);

ProductUsers.helpers({
  getFullName() {
    if (this.name) {
      return this.name;
    }

    if (this.firstName || this.lastName) {
      return `${this.firstName} ${this.lastName}`;
    }

    return '';
  },

  user() {
    return Meteor.users.findOne(this.userId);
  },

  isCurrentlySubscribed({ monthly }) {
    if (monthly) {
      return !!this.isSubscribed;
    }

    return false;
  },
});

if (Meteor.isServer) {
  ProductUsers._ensureIndex({
    userId: 1,
    productId: 1,
  }, { unique: 1 });

  ProductUsers._ensureIndex({
    createdAt: 1,
  });
}

export default ProductUsers;
