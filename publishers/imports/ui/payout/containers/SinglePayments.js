import { Meteor } from 'meteor/meteor';
import { composeWithTracker } from 'react-komposer';
import { ReactiveVar } from 'meteor/reactive-var';
import { ContentWallCharges } from 'meteor/drizzle:models';

import SinglePayments from '../components/SinglePayments.jsx';

const offsetVar = new ReactiveVar(0);
function changeOffset(val) {
  offsetVar.set(val);
}

function composer(props, onData) {
  const { product, monthPeriod } = props;

  const limit = 10;
  const offset = offsetVar.get();

  if (!Meteor.subscribe('contentWallCharges', {
    offset,
    limit,
    productId: product._id,
    datePeriod: monthPeriod,
  }).ready()) { return null; }

  const wallCharges = ContentWallCharges.find({
    productId: product._id,
    createdAt: { $gte: monthPeriod.beginDate, $lte: monthPeriod.endDate },
    amount: { $gt: 0 },
  }, {
    sort: { createdAt: -1 },
    limit,
  }).fetch();

  const data = {
    wallCharges,
    offset,
    changeOffset,
    limit,
  };

  onData(null, data);

  return () => {
    offsetVar.set(0);
  };
}

export default composeWithTracker(composer)(SinglePayments);
