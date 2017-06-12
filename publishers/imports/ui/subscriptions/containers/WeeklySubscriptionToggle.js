import { composeWithTracker } from 'react-komposer';
import { currentProduct } from '../../products/currentProduct';
import WeeklySubscription from '../components/WeeklySubscription';

import {
  toggleWeeklySubscription,
  configWeeklySubscription,
} from '../actions';

function composer(props, onData) {
  const product = currentProduct();

  if (!product) {
    return null;
  }

  return onData(null, {
    toggled: product.weeklySubscriptionEnabled,
    amount: product.weeklySubscription && (product.weeklySubscription.amount / 100).toFixed(2) || 0,
    stripePlanId: product.weeklySubscription && product.weeklySubscription.stripePlanId || '',

    onToggle: (toggled) => toggleWeeklySubscription({
      productId: product._id,
      state: toggled,
    }),
    onSubmit: ({ amount, stripePlanId }) => configWeeklySubscription({
      productId: product._id,
      amount: parseFloat(amount),
      stripePlanId,
    }),
  });
}

export default composeWithTracker(composer)(WeeklySubscription);
