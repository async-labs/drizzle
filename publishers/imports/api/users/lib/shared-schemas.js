import { SimpleSchema } from 'meteor/aldeed:simple-schema';

export const FilterQuerySchema = new SimpleSchema({
  productId: {
    type: String,
  },
  offset: {
    type: Number,
    optional: true,
  },
  limit: {
    type: Number,
    optional: true,
  },
  startDate: {
    type: String,
    optional: true,
  },
  endDate: {
    type: String,
    optional: true,
  },
  searchQuery: {
    type: String,
    optional: true,
  },
  filter: {
    optional: true,
    type: new SimpleSchema({
      isRegisteredAtIt: {
        type: Boolean,
        optional: true,
      },
      isUnlockedFreeContent: {
        type: Boolean,
        optional: true,
      },
      isSubscribed: {
        type: Boolean,
        optional: true,
      },
      isUnsubscribed: {
        type: Boolean,
        optional: true,
      },
      isMicropaid: {
        type: Boolean,
        optional: true,
      },
      isBoughtDailyAccess: {
        type: Boolean,
        optional: true,
      },
      isUsedFreeTrial: {
        type: Boolean,
        optional: true,
      },
      isReferrer: {
        type: Boolean,
        optional: true,
      },
      isReferred: {
        type: Boolean,
        optional: true,
      },
      isCancelledFreeTrial: {
        type: Boolean,
        optional: true,
      },
    }),
  },
});
