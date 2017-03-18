import { SimpleSchema } from 'meteor/aldeed:simple-schema';

export const subscriptionSchema = new SimpleSchema({
  amount: {
    type: Number,
  },
  stripePlanId: {
    type: String,
    optional: true,
  },
  changedAt: {
    type: Date,
    optional: true,
  },
  oldAmount: {
    type: Number,
    optional: true,
  },
});

export default new SimpleSchema({
  title: {
    type: String,
  },
  description: {
    type: String,
    optional: true,
  },
  url: {
    type: String,
    optional: true,
  },
  domain: {
    type: String,
    optional: true,
  },
  claimStatus: {
    type: String,
    optional: true,
  },
  isScriptInstalled: {
    type: Boolean,
    optional: true,
    defaultValue: false,
  },
  createdAt: {
    type: Date,
  },
  userId: {
    type: String,
    optional: true,
  },
  vendorUserId: {
    type: String,
    optional: true,
  },
  wpPlugin: {
    type: new SimpleSchema({
      apiKey: {
        type: String,
        optional: true,
      },
      isKeyInstalled: {
        type: Boolean,
        optional: true,
      },
    }),
    optional: true,
  },
  mailchimpConfig: {
    type: new SimpleSchema({
      apiKey: {
        type: String,
        optional: true,
      },
      listId: {
        type: String,
        optional: true,
      },
    }),
    optional: true,
  },
  mailgunConfig: {
    type: new SimpleSchema({
      apiKey: {
        type: String,
        optional: true,
      },
      domain: {
        type: String,
        optional: true,
      },
      fromName: {
        type: String,
        optional: true,
      },
      fromEmail: {
        type: String,
        optional: true,
      },
    }),
    optional: true,
  },
  widgetUI: {
    type: new SimpleSchema({
      image: {
        type: String,
      },
    }),
    optional: true,
  },
  usingWordpress: {
    type: Boolean,
    optional: true,
    defaultValue: false,
  },
  paygEnabled: {
    type: Boolean,
    defaultValue: true,
  },
  defaultWallPrice: {
    type: Number,
    optional: true,
  },
  subscriptionEnabled: {
    type: Boolean,
    optional: true,
  },
  subscription: {
    type: subscriptionSchema,
    optional: true,
  },
  asDefault: {
    type: Boolean,
    optional: true,
  },
  sharingDisabled: {
    type: Boolean,
    optional: true,
  },
  numberVisitors: {
    type: Number,
    optional: true,
  },
  isWallSetupDone: {
    type: Boolean,
    defaultValue: false,
  },
  totalIncome: {
    type: Number,
    defaultValue: 0,
  },
  subscriptionIncome: {
    type: Number,
    defaultValue: 0,
  },
  subscribedUserCount: {
    type: Number,
    defaultValue: 0,
  },
  paygIncome: {
    type: Number,
    defaultValue: 0,
  },
  upsellingConfig: {
    type: new SimpleSchema({
      popular: {
        type: Boolean,
        optional: true,
      },
      newest: {
        type: Boolean,
        optional: true,
      },
      itemCountToShow: {
        type: Number,
        optional: true,
      },
      purchasedCount: {
        type: Number,
        optional: true,
      },
      upvoteCount: {
        type: Number,
        optional: true,
      },
    }),
    optional: true,
  },
  ispAPI: {
    type: new SimpleSchema({
      key: {
        type: String,
        optional: true,
      },
      url: {
        type: String,
        optional: true,
      },
      emailSubject: {
        type: String,
        optional: true,
      },
      emailContent: {
        type: String,
        optional: true,
      },
    }),
    optional: true,
  },
  welcomeEmail: {
    type: new SimpleSchema({
      subject: {
        type: String,
        optional: true,
      },
      body: {
        type: String,
        optional: true,
      },
    }),
    optional: true,
  },
  isFreeTrialEnabled: {
    type: Boolean,
    optional: true,
  },
  freeTrialDayCount: {
    type: Number,
    optional: true,
  },
  socialProof: {
    type: new SimpleSchema({
      isEnabled: {
        type: Boolean,
      },
      message: {
        type: String,
        optional: true,
      },
    }),
    optional: true,
  },
  isClientSide: {
    type: Boolean,
    defaultValue: false,
  },
  guestButtonText: {
    type: String,
    optional: true,
  },
  guestMessageText: {
    type: String,
    optional: true,
  },
  isFooterBarEnabled: {
    type: Boolean,
    optional: true,
  },
  isFooterBarEnabledOnAllPages: {
    type: Boolean,
    optional: true,
  },
  disabled: {
    type: Boolean,
    optional: true,
    defaultValue: false,
  },
});
