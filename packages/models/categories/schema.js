import { SimpleSchema } from 'meteor/aldeed:simple-schema';

export default new SimpleSchema({
  productId: {
    type: String,
    regEx: SimpleSchema.RegEx.Id,
  },
  name: {
    type: String,
  },
  createdAt: {
    type: Date,
  },
});
