import { composeWithTracker } from 'react-komposer';
import moment from 'moment';

import { Meteor } from 'meteor/meteor';

import { currentProduct } from '../../products/currentProduct';
import { changePeriod, periodVar } from '../../common/chart/datePeriod';

import MonthlyIncomeGraph from '../components/MonthlyIncomeGraph';

function composer(props, onData) {
  const product = currentProduct();
  if (!product) { return null; }

  const period = periodVar.get();
  const isVerified = product.claimStatus === 'verified';

  onData(null, {
    period,
    changePeriod,
    isVerified,
  });

  const year = (new Date()).getFullYear() - period;
  Meteor.call('payment/monthlyIncome', product._id, year, (err, data) => {
    if (err) {
      console.log(err); // eslint-disable-line no-console
      return;
    }

    const labels = [];
    for (let i = 0; i < 12; i++) {
      labels.push(moment(new Date(year, i, 1)).format('MMM YYYY'));
    }

    const chartData = {
      labels,
      datasets: [
        {
          label: 'Monthly Income',
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
      isVerified,
      period: periodVar.get(),
      changePeriod,
      chartData,
    });
  });

  return () => {
    periodVar.set(0);
  };
}

export default composeWithTracker(composer)(MonthlyIncomeGraph);
