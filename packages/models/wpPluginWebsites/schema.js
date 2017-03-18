import { SimpleSchema } from 'meteor/aldeed:simple-schema';

export default new SimpleSchema({
  url: {
    type: String,
  },
  domain: {
    type: String,
  },
  activated: {
    type: Boolean,
    optional: true,
  },
  activatedAt: {
    type: Date,
    optional: true,
  },
  deactivated: {
    type: Boolean,
    optional: true,
  },
  deactivatedAt: {
    type: Date,
    optional: true,
  },
});
