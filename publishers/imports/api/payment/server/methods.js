import moment from 'moment';
import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import { checkOwnerAndSetup } from 'meteor/drizzle:check-functions';
import {
  Products,
  MonthlyIncome,
} from 'meteor/drizzle:models';

import { getPeriodIncome } from 'meteor/drizzle:util';

Meteor.methods({
  'payment/getPeriodIncome'(productId, datePeriod) {
    check(productId, String);
    check(datePeriod, {
      beginDate: Date,
      endDate: Date,
    });

    const product = Products.findOne(productId);
    checkOwnerAndSetup({ product, user: Meteor.user() });

    const income = getPeriodIncome(productId, datePeriod);

    return income;
  },

  'payment/monthlyIncome'(productId, year) {
    check(productId, String);
    check(year, Number);

    const product = Products.findOne(productId);
    checkOwnerAndSetup({ product, user: Meteor.user() });

    const incomes = [];
    const currentYearAndMonth = Number(moment().format('YYYYMM'));

    for (let i = 0; i < 12; i++) {
      const beginDate = moment(new Date(year, i, 1)).startOf('day')._d;

      const datePeriod = {
        beginDate,
        endDate: moment(beginDate).endOf('month').endOf('day')._d,
      };

      const yearAndMonth = moment(beginDate).format('YYYYMM');
      if (currentYearAndMonth < Number(yearAndMonth)) {
        incomes.push(0);
        continue;
      }

      const monthlyIncome = MonthlyIncome.findOne({ productId: product._id, yearAndMonth });

      if (monthlyIncome) {
        incomes.push(monthlyIncome.totalIncome);
        continue;
      }

      const totalIncome = getPeriodIncome(product._id, datePeriod).periodIncome;

      if (currentYearAndMonth > Number(yearAndMonth)) {
        MonthlyIncome.insert({
          productId: product._id,
          yearAndMonth,
          totalIncome,
          createdAt: new Date(),
        });
      }

      incomes.push(totalIncome);
    }

    return incomes;
  },
});
