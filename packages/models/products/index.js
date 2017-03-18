import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import schema from './schema';

export const Products = new Mongo.Collection('products');

Products.schema = schema;
Products.attachSchema(schema);

Products.helpers({
  isSetupDone() {
    return true;
  },

  widgetUIImage() {
    return ((this.widgetUI && this.widgetUI.image) ||
      'https://zenmarket.s3-us-west-1.amazonaws.com/widget-images/xWPM58b6wFaWYkRBm/custom-widget.png'
    );
  },

  isOwner(user) {
    if (typeof user === 'string') {
      user = Meteor.users.findOne(user); // eslint-disable-line no-param-reassign
    } else if (!user) {
      user = Meteor.user(); // eslint-disable-line no-param-reassign
    }

    return user && this.vendorUserId === user._id || user.isAdmin();
  },

  isMonthlySubscriptionEnabled() {
    return !!(this.subscriptionEnabled && this.subscription &&
              this.subscription.amount && this.subscription.stripePlanId);
  },
});

if (Meteor.isServer) {
  Products._ensureIndex({
    url: 1,
  }, { unique: 1 });

  Products._ensureIndex({
    domain: 1,
  }, { unique: 1 });
}

export default Products;
