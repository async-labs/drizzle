import { SimpleSchema } from 'meteor/aldeed:simple-schema';

export default new SimpleSchema({
  productId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },
  yearAndMonth: { // YYYYMM format
    type: String,
  },
  createdAt: {
    type: Date,
  },
  totalIncome: {
    type: Number,
    decimal: true,
  },
});
