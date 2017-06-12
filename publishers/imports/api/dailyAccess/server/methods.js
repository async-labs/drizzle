import moment from 'moment';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { checkOwnerAndSetup } from 'meteor/drizzle:check-functions';

import {
  Products,
  DailyAccessCharges,
} from 'meteor/drizzle:models';

Meteor.methods({
  'dailyAccess.dailyStats'(productId, datePeriod) {
    check(productId, String);
    check(datePeriod, {
      beginDate: Date,
      endDate: Date,
    });

    const product = Products.findOne(productId);
    checkOwnerAndSetup({ product, user: Meteor.user(), checkSetup: false });

    const incomes = [];
    const dates = {};

    let beginAt = new Date(datePeriod.beginDate);
    let endAt = new Date(datePeriod.beginDate);

    while (moment(endAt).isBefore(datePeriod.endDate)) {
      endAt = moment(beginAt).add(1, 'days')._d; // eslint-disable-line no-underscore-dangle

      if (!moment(endAt).isBefore(datePeriod.endDate)) {
        endAt = moment(datePeriod.endDate).add(1, 'seconds')._d; // eslint-disable-line
      }

      incomes.push(0);
      dates[moment(beginAt).format('YYYYMMDD')] = incomes.length - 1;

      beginAt = moment(beginAt).add(1, 'days')._d; // eslint-disable-line no-underscore-dangle
    }

    const cursor = DailyAccessCharges.find({
      productId,
      createdAt: { $gte: datePeriod.beginDate, $lte: datePeriod.endDate },
      amount: { $gt: 0 },
    });

    cursor.forEach((charge) => {
      const index = dates[moment(charge.createdAt).format('YYYYMMDD')];

      if (index === undefined || incomes[index] === undefined) {
        return;
      }

      incomes[index] += (charge.amount / 100);
    });

    return incomes;
  },
});
