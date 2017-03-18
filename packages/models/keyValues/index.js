import { Mongo } from 'meteor/mongo';

const KeyValues = new Mongo.Collection('key_values');

export default KeyValues;
