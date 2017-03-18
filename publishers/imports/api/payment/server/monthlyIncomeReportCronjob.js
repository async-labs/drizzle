import moment from 'moment';

import { Products, MonthlyIncome } from 'meteor/drizzle:models';
import { getPeriodIncome } from 'meteor/drizzle:util';

import { SyncedCron } from 'meteor/percolate:synced-cron';

function createMonthlyReport() {
  const beginDate = moment().subtract(1, 'months').startOf('month')._d;
  const endDate = moment(beginDate).endOf('month')._d;

  Products.find().forEach(product => {
    if (!product.isSetupDone()) {
      return;
    }

    const yearAndMonth = moment(beginDate).format('YYYYMM');

    if (MonthlyIncome.find({ productId: product._id, yearAndMonth }).count()) { return; }

    const totalIncome = getPeriodIncome(product._id, { beginDate, endDate }).periodIncome;

    MonthlyIncome.insert({
      productId: product._id,
      yearAndMonth: moment(beginDate).format('YYYYMM'),
      totalIncome,
      createdAt: new Date(),
    });
  });
}

SyncedCron.add({
  name: 'Monthly Income report',
  schedule(parser) {
    // return parser.text('every 2 minutes');
    return parser.text('on the first day of the month');
  },
  job() {
    createMonthlyReport();
  },
});
