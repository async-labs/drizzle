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
  wallId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },
  visitedCount: {
    type: Number,
  },
  lastVisitedAt: {
    type: Date,
  },
});
