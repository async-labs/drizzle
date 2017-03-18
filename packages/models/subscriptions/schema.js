import { SimpleSchema } from 'meteor/aldeed:simple-schema';

export default new SimpleSchema({
  userId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },
  productId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },
  vendorId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },
  createdAt: {
    type: Date,
  },
  amount: {
    type: Number,
  },
  amountToCharge: {
    type: Number,
    optional: true,
  },
  beginAt: {
    type: Date,
  },
  endAt: {
    type: Date,
  },
  isRenewed: {
    type: Boolean,
    optional: true,
  },
  paid: {
    type: Boolean,
    optional: true,
  },
  chargeId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    optional: true,
  },
  imported: {
    type: Boolean,
    optional: true,
  },
  monthly: {
    type: Boolean,
    optional: true,
  },
  isFreeTrial: {
    type: Boolean,
    optional: true,
  },
  subscribedWallId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
    optional: true,
  },
  stripeSubscriptionId: {
    type: String,
    optional: true,
  },
  stripeInvoiceId: {
    type: String,
    optional: true,
  },
});
