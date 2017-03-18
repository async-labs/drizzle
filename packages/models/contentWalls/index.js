import { Meteor } from 'meteor/meteor';
import { Mongo } from 'meteor/mongo';
import schema from './schema';

const ContentWalls = new Mongo.Collection('payg_content_walls');

ContentWalls.schema = schema;
ContentWalls.attachSchema(schema);

if (Meteor.isServer) {
  ContentWalls._ensureIndex({
    url: 1,
  }, {
    unique: 1,
  });
}

export default ContentWalls;
