import { Mongo } from 'meteor/mongo';
import schema from './schema';

const SubscriberVisitedWalls = new Mongo.Collection('subscriber_visited_walls');

SubscriberVisitedWalls.schema = schema;
SubscriberVisitedWalls.attachSchema(schema);

export default SubscriberVisitedWalls;
