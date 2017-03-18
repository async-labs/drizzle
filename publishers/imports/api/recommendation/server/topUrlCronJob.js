/* globals WeeklyTopURLs */

import moment from 'moment';

import { Meteor } from 'meteor/meteor';
import { Email } from 'meteor/email';
import { _ } from 'meteor/underscore';
import { Mongo } from 'meteor/mongo';
import { SyncedCron } from 'meteor/percolate:synced-cron';

import { ContentWallCharges } from 'meteor/drizzle:models';

function createTopUrl() {
  const paidCount = Meteor.settings.private.popularUrlPaidCount || 5;

  const now = new Date();
  const sevenDaysAgo = moment(now).subtract(7, 'days')._d;

  const urls = new Mongo.Collection(null);

  ContentWallCharges.find(
    { createdAt: { $gte: sevenDaysAgo, $lte: now } },
    { fields: { url: 1, createdAt: 1 } }
  ).forEach((charge) => {
    urls.upsert({ url: charge.url }, { $inc: { count: 1 } });
  });

  urls.find({ count: { $gte: paidCount } }, { limit: 8 }).forEach((u) => {
    WeeklyTopURLs.insert(u);
  });
}

function sendTopUrl() {
  const emailObj = {
    from: 'Drizzle <support@getdrizzle.com>',
    subject: 'Top url of this week',
  };

  let text = '';
  WeeklyTopURLs.find({}, { sort: { count: -1 } }).forEach((u) => {
    text += `<a href="${u.url}">${u.title || u.url}</a>\n`;
  });

  if (!text) { return; }

  WeeklyTopURLs.remove({});
  emailObj.html = text;

  function sendEmailToUser(user) {
    const email = _.findWhere(user.emails, { verified: true });
    if (!email) { return; }

    Email.send(_.extend({ to: email.address }, emailObj));
  }

  Meteor.users.find({ 'notifications.weekly_popular_content': true }).forEach((user) => {
    sendEmailToUser(user);
  });
}


SyncedCron.add({
  name: 'create weekly top urls',
  schedule(parser) {
    // return parser.text('every 1 mins');
    return parser.text('at 04:00 pm on Friday');
  },
  job() {
    createTopUrl();
  },
});

SyncedCron.add({
  name: 'send weekly top urls',
  schedule(parser) {
    // return parser.text('every 1 mins');
    return parser.text('at 04:00 pm on Friday');
  },
  job() {
    sendTopUrl();
  },
});
