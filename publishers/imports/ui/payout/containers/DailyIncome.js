import moment from 'moment';
import { composeWithTracker } from 'react-komposer';
import { ReactiveVar } from 'meteor/reactive-var';

import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';

import { currentProduct } from '../../products/currentProduct';

import DailyIncome from '../components/DailyIncome.jsx';

const selectedDateVar = new ReactiveVar(new Date());
function changeSelectedDate(date) {
  selectedDateVar.set(date);
}

function composer(props, onData) {
  const product = currentProduct();
  if (!product) { return null; }

  const selectedDate = selectedDateVar.get();

  const data = {
    selectedDate,
    changeSelectedDate,
  };

  onData(null, data);

  const dayPeriod = {
    beginDate: moment(selectedDate, 'DD/MM/YYYY').startOf('day')._d,
    endDate: moment(selectedDate, 'DD/MM/YYYY').endOf('day')._d,
  };

  Meteor.call('payment/getPeriodIncome', product._id, dayPeriod, (err, res) => {
    if (err) {
      console.log(err); // eslint-disable-line no-console
    }

    onData(null, _.extend({
      income: res.periodIncome,
    }, data));
  });

  return () => {
    selectedDateVar.set(new Date());
  };
}

export default composeWithTracker(composer)(DailyIncome);
