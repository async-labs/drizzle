import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

import { KeyValues } from 'meteor/drizzle:models';

Meteor.publish('keyValues/getByKey', (key) => {
  check(key, String);

  return KeyValues.find({ key });
});
