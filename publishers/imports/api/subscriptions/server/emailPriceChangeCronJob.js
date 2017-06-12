import moment from 'moment';

import { Meteor } from 'meteor/meteor';
import { Email } from 'meteor/email';
import { _ } from 'meteor/underscore';
import { SyncedCron } from 'meteor/percolate:synced-cron';

import { Products, Plans } from 'meteor/drizzle:models';

function emailPriceChange() {
  const beginAt = moment().startOf('month');
  beginAt.date(25);
  beginAt.subtract(1, 'M');

  Meteor.users.find({
    $or: [
      { subscribedProducts: { $exists: true } },
      { weeklySubscribedProducts: { $exists: true } },
      { subscribedPlans: { $exists: true } },
    ] }
  ).forEach((user) => {
    const email = _.findWhere(user.emails, { verified: true });

    if (!email) {
      return;
    }

    let text = '';

    if (user.subscribedProducts) {
      Products.find({ _id: { $in: user.subscribedProducts } }).forEach((product) => {
        if (!product.subscription) { return; }

        const oldAmount = product.subscription.oldAmount;
        const amount = product.subscription.amount;

        if (!oldAmount || !product.subscription.changedAt ||
            !amount || !product.vendorUserId) {
          return;
        }

        if (product.subscription.changedAt.getTime() < beginAt._d.getTime()) {
          return;
        }

        text += `\n${product.title} (${product.url})'s monthly subscription fee `;
        text += `changed from ${oldAmount / 100} to ${amount / 100}`;
      });
    }

    if (user.weeklySubscribedProducts) {
      Products.find({ _id: { $in: user.weeklySubscribedProducts } }).forEach((product) => {
        if (!product.weeklySubscription) { return; }

        const oldAmount = product.weeklySubscription.oldAmount;
        const amount = product.weeklySubscription.amount;

        if (!oldAmount || !product.weeklySubscription.changedAt ||
            !amount || !product.vendorUserId) {
          return;
        }

        if (product.weeklySubscription.changedAt.getTime() < beginAt._d.getTime()) {
          return;
        }

        text += `\n${product.title} (${product.url})'s weekly subscription fee `;
        text += `changed from ${oldAmount / 100} to ${amount / 100}`;
      });
    }

    if (user.subscribedPlans) {
      Plans.find({ _id: { $in: user.subscribedPlans } }).forEach((plan) => {
        const oldPrice = plan.oldPrice;
        const price = plan.price;

        if (!oldPrice || !plan.priceChangedAt || !price) {
          return;
        }

        if (plan.priceChangedAt.getTime() < beginAt._d.getTime()) {
          return;
        }

        const product = Products.findOne(plan.productId);
        if (!product) { return; }

        text += `\n ${product.title} (${product.url}) - ${plan.name}'s subscription fee `;
        text += `changed from ${oldPrice / 100} to ${price / 100}`;
      });
    }

    if (text) {
      Email.send({
        from: 'Drizzle <support@getdrizzle.com>',
        to: email.address,
        subject: 'Subscriptions fee changes',
        text: `${text}\n\nThanks for buying premium content and supporting premium content creators!`,
      });
    }
  });
}


SyncedCron.add({
  name: 'Send email to users about subscription fee change',
  schedule(parser) {
    // return parser.text('every 20 seconds');
    return parser.text('on the 25th day of the month');
  },
  job() {
    emailPriceChange();
  },
});
