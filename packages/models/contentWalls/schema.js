import { SimpleSchema } from 'meteor/aldeed:simple-schema';

export default new SimpleSchema({
  url: {
    type: String,
  },
  title: {
    type: String,
  },
  description: {
    type: String,
    optional: true,
  },
  thumbnailUrl: {
    type: String,
    optional: true,
  },
  price: {
    type: Number,
  },
  productId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },
  createdAt: {
    type: Date,
  },
  totalIncome: {
    type: Number,
  },
  sellCount: {
    type: Number,
  },
  content: {
    type: new SimpleSchema({
      original: {
        type: String,
        optional: true,
      },
      thumbnail: {
        type: String,
        optional: true,
      },
      thumbnails: {
        type: [String],
        optional: true,
      },
    }),
    optional: true,
  },
  disabled: {
    type: Boolean,
    defaultValue: false,
  },
  isActive: {
    type: Boolean,
    defaultValue: true,
  },
  isEncryptedContentIntalled: {
    type: Boolean,
    defaultValue: false,
  },
  autoDecryption: {
    type: Boolean,
    defaultValue: false,
  },
  autoDecryptionConfig: {
    type: new SimpleSchema({
      cpm: {
        type: Number,
      },
      viewCountLimit: {
        type: Number,
      },
    }),
    optional: true,
  },
  sharingDisabled: {
    type: Boolean,
    optional: true,
  },
  fixedPricing: {
    type: Boolean,
    optional: true,
  },
  isVideo: {
    type: Boolean,
    optional: true,
  },
  viewCount: {
    type: Number,
    defaultValue: 0,
  },
  uniqueViewCount: {
    type: Number,
    defaultValue: 0,
  },
  callToActionClickedCount: {
    type: Number,
    defaultValue: 0,
  },
  footerButtonClickedCount: {
    type: Number,
    defaultValue: 0,
  },
  upvoteCount: {
    type: Number,
    defaultValue: 0,
  },
  upvotedUserIds: {
    type: [String],
    optional: true,
  },
  score: {
    type: Number,
    decimal: true,
  },
  disableMicropayment: {
    type: Boolean,
    optional: true,
  },
  externalId: {
    type: String,
    optional: true,
  },
  expirationEnabled: {
    type: Boolean,
    optional: true,
  },
  expirationHours: {
    type: Number,
    optional: true,
  },
  donationEnabled: {
    type: Boolean,
    optional: true,
  },
  donationMessage: {
    type: String,
    optional: true,
  },
  donationThankYouMessage: {
    type: String,
    optional: true,
  },
  guestButtonText: {
    type: String,
    optional: true,
  },
  categoryIds: {
    type: [String],
    optional: true,
  },
  viewportConfig: {
    type: new SimpleSchema({
      disabled: {
        type: Boolean,
        defaultValue: true,
      },
      width: {
        type: Number,
        defaultValue: 360,
      },
    }),
  },
  /**
   * Number of users who registered on this wall
   */
  registeredUserCount: {
    type: Number,
    defaultValue: 0,
  },
  /**
   * Number of users who bought subscription on this wall
   */
  subscribedUserCount: {
    type: Number,
    defaultValue: 0,
  },
  /**
   * Number of users who signed up for free trial on this wall
   */
  freeTrialSubscribedUserCount: {
    type: Number,
    defaultValue: 0,
  },
  subscriberVisitedCount: {
    type: Number,
    defaultValue: 0,
  },
  upsellingClickedCount: {
    type: Number,
    defaultValue: 0,
  },
  visitedCountViaUpselling: {
    type: Number,
    defaultValue: 0,
  },
  hideUpsellingList: {
    type: Boolean,
    defaultValue: false,
  },
});
