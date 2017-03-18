import {
  Subscriptions,
  ContentWallCharges,
} from 'meteor/drizzle:models';

export default function getPeriodIncome(productId, datePeriod) {
  let periodIncome = 0;
  let chargeCount = 0;

  Subscriptions.find({
    productId,
    createdAt: { $gte: datePeriod.beginDate, $lte: datePeriod.endDate },
    amount: { $gt: 0 },
  }, {
    fields: { amount: 1 },
  }).forEach(s => {
    periodIncome += s.amount || 0;
    if (s.amount) {
      chargeCount += 1;
    }
  });

  let singlePaymentIncome = 0;
  ContentWallCharges.find({
    productId,
    createdAt: { $gte: datePeriod.beginDate, $lte: datePeriod.endDate },
    amount: { $gt: 0 },
  }, {
    fields: { amount: 1 },
  }).forEach(s => {
    periodIncome += s.amount || 0;
    singlePaymentIncome += s.amount || 0;
  });

  chargeCount += Math.floor(singlePaymentIncome / 100);

  const stripeFee = (periodIncome * 0.02 + 30 * chargeCount) / 100;

  return { periodIncome: periodIncome / 100, stripeFee };
}
