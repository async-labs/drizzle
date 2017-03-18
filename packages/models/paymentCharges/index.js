import { Mongo } from 'meteor/mongo';

const PaymentCharges = new Mongo.Collection('payment_charges');

export default PaymentCharges;
