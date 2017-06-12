import { Meteor } from 'meteor/meteor';
import { composeWithTracker } from 'react-komposer';
import { ReactiveVar } from 'meteor/reactive-var';
import { DailyAccessCharges } from 'meteor/drizzle:models';

import ChargeListComp from '../components/DailyAccessCharges';

const offsetVar = new ReactiveVar(0);
function changeOffset(val) {
  offsetVar.set(val);
}

function composer(props, onData) {
  const { product, monthPeriod } = props;

  const limit = 10;
  const offset = offsetVar.get();

  if (!Meteor.subscribe('dailyAccessCharges', {
    offset,
    limit,
    productId: product._id,
    datePeriod: monthPeriod,
  }).ready()) { return null; }

  const charges = DailyAccessCharges.find({
    productId: product._id,
    createdAt: { $gte: monthPeriod.beginDate, $lte: monthPeriod.endDate },
    amount: { $gt: 0 },
  }, {
    sort: { createdAt: -1 },
    limit,
  }).fetch();

  const data = {
    charges,
    offset,
    changeOffset,
    limit,
  };

  onData(null, data);

  return () => {
    offsetVar.set(0);
  };
}

export default composeWithTracker(composer)(ChargeListComp);
