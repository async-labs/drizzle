import { Mongo } from 'meteor/mongo';

import schema from './schema';
const MonthlyIncome = new Mongo.Collection('monthly_income_report');

MonthlyIncome.schema = schema;
MonthlyIncome.attachSchema(schema);

export default MonthlyIncome;
