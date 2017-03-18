import { composeWithTracker } from 'react-komposer';
import { ReactiveVar } from 'meteor/reactive-var';

import { Meteor } from 'meteor/meteor';

import { Subscriptions } from 'meteor/drizzle:models';
import { error, success } from '/imports/ui/notifier';

import SubscriptionList from '../components/SubscriptionList';

const offsetVar = new ReactiveVar(0);
function changeOffset(val) {
  offsetVar.set(val);
}

function composer(props, onData) {
  const limit = 10;
  const offset = offsetVar.get();

  const { product, monthPeriod } = props;

  if (!Meteor.subscribe('subscriptionCharges', {
    limit,
    offset,
    productId: product._id,
    datePeriod: monthPeriod,
  }).ready()) { return null; }

  const subscriptionCharges = Subscriptions.find({
    productId: product._id,
    createdAt: { $gte: monthPeriod.beginDate, $lte: monthPeriod.endDate },
    amount: { $gt: 0 },
  }, {
    sort: { createdAt: -1 },
    limit,
  }).fetch();

  const data = {
    subscriptionCharges,
    offset,
    changeOffset,
    limit,
    refundSubscription(subId) {
      if (!confirm('Are you sure?')) {
        return;
      }

      Meteor.call('subscriptions.refund', subId, (err) => {
        if (err) {
          error(err);
        } else {
          success('Successfully refunded.');
        }
      });
    },
  };

  onData(null, data);

  return () => {
    offsetVar.set(0);
  };
}

export default composeWithTracker(composer)(SubscriptionList);
