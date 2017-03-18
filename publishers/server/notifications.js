import { _ } from 'meteor/underscore';
import { Email } from 'meteor/email';
import { Meteor } from 'meteor/meteor';

import { SyncedCron } from 'meteor/percolate:synced-cron';

import {
  Products,
  ProductUsers,
  Subscriptions,
  ContentWallCharges,
} from 'meteor/drizzle:models';

function vendorStat({ date, subject, notifName }) {
  const emailObj = {
    from: 'Drizzle <support@getdrizzle.com>',
    subject,
  };

  function sendEmailToUser(user) {
    const email = _.findWhere(user.emails, { verified: true });
    if (!email) { return; }

    if (Products.find({ vendorUserId: user._id }).count() === 0) {
      return;
    }

    let totalRegistered = 0;
    let newRegistered = 0;
    let totalFreeTrial = 0;
    let newFreeTrial = 0;
    let totalSinglePayment = 0;
    let newSinglePayment = 0;
    let totalSubscriber = 0;
    let newSubscriber = 0;

    Products.find({ vendorUserId: user._id }).forEach(product => {
      totalRegistered += ProductUsers.find({
        productId: product._id,
        isRegisteredAtIt: true,
      }).count();

      newRegistered += ProductUsers.find({
        productId: product._id,
        isRegisteredAtIt: true,
        createdAt: { $gte: date },
      }).count();

      totalFreeTrial += ProductUsers.find({
        productId: product._id,
        freeTrialBeginAt: { $exists: true },
      }).count();

      newFreeTrial += ProductUsers.find({
        productId: product._id,
        freeTrialBeginAt: { $gte: date },
      }).count();

      totalSinglePayment += ContentWallCharges.find({
        productId: product._id,
        amount: { $gt: 0 },
      }).count();

      newSinglePayment += ContentWallCharges.find({
        productId: product._id,
        amount: { $gt: 0 },
        createdAt: { $gte: date },
      }).count();

      totalSubscriber += product.subscribedUserCount || 0;

      newSubscriber += Subscriptions.find({
        productId: product._id,
        amount: { $gt: 0 },
        isRenewed: { $exists: false },
        createdAt: { $gte: date },
      }).count();
    });

    let html = `<p>total number of registered: ${totalRegistered} (+${newRegistered})</p>`;
    html += `<p>number of free trial users: ${totalFreeTrial} (+${newFreeTrial})</p>`;
    html += '<p>number of users who made single payment: ';
    html += `${totalSinglePayment} (+${newSinglePayment})</p>`;
    html += `<p>number of subscribers: ${totalSubscriber} (+${newSubscriber})</p>`;

    Email.send(_.extend({ to: email.address, html }, emailObj));
  }

  const filter = { vendorStatus: true };
  filter[`notifications.${notifName}`] = true;
  Meteor.users.find(filter).forEach((user) => {
    sendEmailToUser(user);
  });
}

SyncedCron.add({
  name: 'Weekly stats for your website',
  schedule(parser) {
    // return parser.text('every 30 seconds');
    return parser.text('at 08:59 am on Monday');
  },
  job() {
    const previousSunday = new Date();
    previousSunday.setDate(previousSunday.getDate() - 3);
    previousSunday.setDate(previousSunday.getDate() - previousSunday.getDay());
    previousSunday.setUTCHours(23, 59, 59, 0);

    const subject = 'Weekly stats for your website';
    const notifName = 'weekly_stat';
    vendorStat({ date: previousSunday, subject, notifName });
  },
});

SyncedCron.add({
  name: 'Daily stats for your website',
  schedule(parser) {
    // return parser.text('every 30 seconds');
    return parser.text('at 08:59 am');
  },
  job() {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const subject = 'Daily stats for your website';
    const notifName = 'daily_stat';
    vendorStat({ date: yesterday, subject, notifName });
  },
});
