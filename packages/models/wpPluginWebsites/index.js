import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import { Products } from 'meteor/drizzle:models';
import schema from './schema';

const WpPluginWebsites = new Mongo.Collection('wp_plugin_websites');

WpPluginWebsites.schema = schema;
WpPluginWebsites.attachSchema(schema);

WpPluginWebsites.helpers({
  isRegistered() {
    return Products.find({
      domain: this.domain,
    }).count() > 0;
  },
});

if (Meteor.isServer) {
  WpPluginWebsites._ensureIndex({
    url: 1,
  }, { unique: 1 });
}

export default WpPluginWebsites;
