import { SimpleSchema } from 'meteor/aldeed:simple-schema';

export default new SimpleSchema({
  productId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },
  productDomain: {
    type: String,
  },
  productTitle: {
    type: String,
  },
  createdAt: {
    type: Date,
  },
  userId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },
  name: {
    type: String,
    optional: true,
  },
  firstName: {
    type: String,
    optional: true,
  },
  lastName: {
    type: String,
    optional: true,
  },
  email: {
    type: String,
    regEx: SimpleSchema.RegEx.Email,
    optional: true,
  },
  isRegisteredAtIt: {
    type: Boolean,
  },
  isMicropaid: {
    type: Boolean,
    defaultValue: false,
  },
  totalSpent: {
    type: Number,
    defaultValue: 0,
  },
  totalVendorSpent: {
    type: Number,
    defaultValue: 0,
  },
  isUnlockedFreeContent: {
    type: Boolean,
    defaultValue: false,
  },
  isSubscribed: {
    type: Boolean,
    defaultValue: false,
  },
  isUnsubscribed: {
    type: Boolean,
    defaultValue: false,
  },
  subscribedDate: {
    type: Date,
    optional: true,
  },
  unsubscribedDate: {
    type: Date,
    optional: true,
  },
  isCancelledFreeTrial: {
    type: Boolean,
    defaultValue: false,
  },
  imported: {
    type: Boolean,
    optional: true,
  },
  exported: {
    type: Boolean,
    optional: true,
  },
  registeredAt: {
    type: String,
    optional: true,
  },
  purchasedCount: {
    type: Number,
    optional: true,
  },
  facebook: {
    type: String,
    optional: true,
  },
  freeTrialBeginAt: {
    type: Date,
    optional: true,
  },
  freeTrialEndAt: {
    type: Date,
    optional: true,
  },
  isRefunded: {
    type: Boolean,
    optional: true,
  },
  hasFreeAccess: {
    type: Boolean,
    defaultValue: false,
  },
  stripeSubscriptionId: {
    type: String,
    optional: true,
  },
});
