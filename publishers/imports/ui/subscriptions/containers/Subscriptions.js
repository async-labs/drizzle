import { composeWithTracker } from 'react-komposer';
import moment from 'moment';

import { Meteor } from 'meteor/meteor';
import { ReactiveVar } from 'meteor/reactive-var';

import { currentProduct } from '../../products/currentProduct';
import {
  getMonthlyDatePeriod,
  changePeriod,
  periodVar,
} from '../../common/chart/datePeriod';

import Subscriptions from '../components/Subscriptions.jsx';

const subscriberCountVar = new ReactiveVar(undefined);
const unsubscriberCountVar = new ReactiveVar(undefined);
const paywallCountVar = new ReactiveVar(undefined);

function getSelectedPlan({ product }) {
  if (product.isMonthlySubscriptionEnabled()) {
    return {
      _id: '',
      price: product.subscription.amount,
    };
  }

  return {};
}

function composer(props, onData) {
  const product = currentProduct();
  if (!product) { return null; }

  const selectedId = props.id;
  const selectedPlan = getSelectedPlan({ product, selectedId });
  const isVerified = product.claimStatus === 'verified';

  if (!selectedPlan) {
    onData(null, { product, selectedPlan, isVerified });
    return null;
  }

  const period = periodVar.get();
  const datePeriod = getMonthlyDatePeriod(period);

  if (subscriberCountVar.get() === undefined) {
    Meteor.call('subscriptions/getCounts', product._id, (err, res) => {
      if (err) {
        console.log(err); // eslint-disable-line no-console
      }

      subscriberCountVar.set(res.subscriberCounts || {});
      unsubscriberCountVar.set(res.unsubscriberCounts || {});
      paywallCountVar.set(res.paywallCounts || {});
    });

    return null;
  }

  const plans = [];

  if (product.isMonthlySubscriptionEnabled()) {
    plans.splice(0, 0, {
      name: 'Site-wide monthly',
      _id: '',
      price: product.subscription.amount,
    });
  }

  onData(null, {
    product,
    period,
    datePeriod,
    changePeriod,
    plans,
    selectedPlan,
    paywallCounts: paywallCountVar.get(),
    subscriberCounts: subscriberCountVar.get(),
    unsubscriberCounts: unsubscriberCountVar.get(),
    isVerified,
  });

  Meteor.call('subscriptions/stats', product._id, selectedId, datePeriod, (err, stats) => {
    if (err) {
      console.log(err); // eslint-disable-line no-console
      return;
    }

    selectedPlan.totalEarned = stats.totalEarned;
    selectedPlan.totalEarnedMonth = stats.daily.incomes.reduce(
      (previousValue, currentValue) => previousValue + currentValue);

    const labels = [];
    for (let i = 0; i < moment(datePeriod.endDate).date(); i++) {
      labels.push(moment(datePeriod.beginDate).add(i, 'days').format('MMMM D'));
    }

    const chartData = {
      labels,
      datasets: [
        {
          label: selectedPlan && selectedPlan.name || 'Site-wide subscriptions',
          borderWidth: 1,
          backgroundColor: 'rgba(151,187,205,0.7)',
          borderColor: 'rgba(151,187,205,0.7)',
          hoverBackgroundColor: 'rgba(151,187,205,1)',
          hoverBorderColor: 'rgba(151,187,205,1)',
          data: stats.daily.incomes,
        },
      ],
    };

    const dailyCounts = stats.daily.counts;
    const chartOptions = {
      tooltips: {
        callbacks: {
          label(tooltipItem) {
            let tooltip = `Income: $${tooltipItem.yLabel.toFixed(2)},`;
            tooltip += ` Number of subscribers: ${dailyCounts[tooltipItem.index]}`;
            return tooltip;
          },
        },
      },
    };

    onData(null, {
      product,
      period,
      datePeriod,
      changePeriod,
      chartData,
      chartOptions,
      plans,
      selectedPlan,
      paywallCounts: paywallCountVar.get(),
      subscriberCounts: subscriberCountVar.get(),
      unsubscriberCounts: unsubscriberCountVar.get(),
      isVerified,
    });
  });

  return () => {
    periodVar.set(0);
    subscriberCountVar.set(undefined);
    paywallCountVar.set(undefined);
  };
}

export default composeWithTracker(composer)(Subscriptions);
