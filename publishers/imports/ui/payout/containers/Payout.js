import moment from 'moment';
import { composeWithTracker } from 'react-komposer';
import { ReactiveVar } from 'meteor/reactive-var';

import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';

import { currentProduct } from '../../products/currentProduct';

import Payout from '../components/Payout.jsx';

const monthPeriodVar = new ReactiveVar({
  beginDate: moment().startOf('month')._d,
  endDate: moment().endOf('month')._d,
});

function changeMonth(date) {
  monthPeriodVar.set({
    beginDate: moment(date).startOf('month')._d,
    endDate: moment(date).endOf('month')._d,
  });
}

function composer(props, onData) {
  const product = currentProduct();
  if (!product) { return null; }

  const subscriptionIncome = product.subscriptionIncome || 0;
  const wallIncome = product.paygIncome || 0;
  const totalIncome = product.totalIncome || 0;

  const monthPeriod = monthPeriodVar.get();
  const isVerified = product.claimStatus === 'verified';

  const data = {
    product,
    monthPeriod,
    changeMonth,
    subscriptionIncome,
    wallIncome,
    totalIncome,
    isVerified,
  };

  onData(null, data);

  Meteor.call('payment/getPeriodIncome', product._id, monthPeriod, (err, res) => {
    if (err) {
      console.log(err); // eslint-disable-line no-console
    }

    const monthIncome = res.periodIncome || 0;
    const incomeAfterStripeFee = monthIncome - (res.stripeFee || 0);

    onData(null, _.extend({
      monthIncome,
      incomeAfterStripeFee,
    }, data));
  });

  return () => {
    monthPeriodVar.set({
      beginDate: moment().startOf('month')._d,
      endDate: moment().endOf('month')._d,
    });
  };
}

export default composeWithTracker(composer)(Payout);
