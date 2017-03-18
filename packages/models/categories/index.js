import { Mongo } from 'meteor/mongo';
import schema from './schema';

const Categories = new Mongo.Collection('wall_categories');

Categories.schema = schema;
Categories.attachSchema(schema);

export default Categories;
