import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';

const TYPES = [
  'daily_stat',
  'weekly_stat',

  // 'weekly_recommendation',
  // 'weekly_popular_content',
];

Meteor.methods({
  'notifications/change'(name, state) {
    check(name, String);
    check(state, Boolean);

    if (!this.userId) {
      throw new Meteor.Error('login-required', 'Login required');
    }

    if (TYPES.indexOf(name) === -1) {
      throw new Meteor.Error('invalid-data', 'Invalid data');
    }

    const modifier = {
      $set: {},
    };

    modifier.$set[`notifications.${name}`] = state;
    Meteor.users.update(this.userId, modifier);
  },
});
