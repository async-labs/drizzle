import { composeWithTracker } from 'react-komposer';
import moment from 'moment';

import { Meteor } from 'meteor/meteor';
import { ReactiveVar } from 'meteor/reactive-var';

import { currentProduct } from '../../products/currentProduct';
import { getMonthlyDatePeriod, changePeriod, periodVar } from '../../common/chart/datePeriod';

import DailyAccessChart from '../components/DailyAccessChart';


const totalEarnedTodayVar = new ReactiveVar(null);

function composer(props, onData) {
  const product = currentProduct();
  if (!product) { return null; }

  const totalEarned = product.dailyAccessIncome || 0;
  const totalEarnedToday = totalEarnedTodayVar.get();
  const isVerified = product.claimStatus === 'verified';

  if (totalEarnedToday === null) {
    const beginDate = moment().startOf('day')._d; // eslint-disable-line
    const endDate = moment().endOf('day')._d; // eslint-disable-line

    Meteor.call('dailyAccess.dailyStats', product._id, { beginDate, endDate }, (err, data) => {
      if (err) {
        console.log(err); // eslint-disable-line no-console
        totalEarnedTodayVar.set(0);
      } else {
        totalEarnedTodayVar.set(data[0]);
      }
    });

    return null;
  }

  const period = periodVar.get();
  const datePeriod = getMonthlyDatePeriod(period);

  onData(null, {
    product, datePeriod, totalEarned,
    totalEarnedToday, period: periodVar.get(),
    changePeriod,
    isVerified,
  });

  Meteor.call('dailyAccess.dailyStats', product._id, datePeriod, (err, data) => {
    if (err) {
      console.log(err); // eslint-disable-line no-console
      return;
    }

    const totalEarnedMonth = data.reduce(
      (previousValue, currentValue) => previousValue + currentValue);

    const labels = [];
    for (let i = 0; i < moment(datePeriod.endDate).date(); i++) {
      labels.push(moment(datePeriod.beginDate).add(i, 'days').format('MMMM D'));
    }

    const chartData = {
      labels,
      datasets: [
        {
          label: 'Daily Pass',
          borderWidth: 1,
          backgroundColor: 'rgba(151,187,205,0.7)',
          borderColor: 'rgba(151,187,205,0.7)',
          hoverBackgroundColor: 'rgba(151,187,205,1)',
          hoverBorderColor: 'rgba(151,187,205,1)',
          data,
        },
      ],
    };

    onData(null, {
      product, datePeriod, totalEarned, totalEarnedMonth,
      totalEarnedToday, period: periodVar.get(),
      changePeriod, chartData,
      isVerified,
    });
  });

  return () => {
    periodVar.set(0);
    totalEarnedTodayVar.set(null);
  };
}

export default composeWithTracker(composer)(DailyAccessChart);
