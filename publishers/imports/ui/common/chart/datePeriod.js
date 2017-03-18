import moment from 'moment';
import { ReactiveVar } from 'meteor/reactive-var';

export const periodVar = new ReactiveVar(0);

export function getMonthlyDatePeriod(period) {
  /* eslint-disable no-underscore-dangle */

  const date = moment().subtract(period, 'months')._d;
  const beginDate = moment(date).startOf('month')._d;
  const endDate = moment(date).endOf('month')._d;

  /* eslint-enable no-underscore-dangle */

  return { beginDate, endDate };
}

export function changePeriod(val) {
  let period = periodVar.get() + val;

  if (period < 0) {
    period = 0;
  }

  periodVar.set(period);
}
