import { composeWithTracker } from 'react-komposer';
import { currentProduct } from '../../products/currentProduct';
import MonthlySubscriptionToggle from '../components/MonthlySubscriptionToggle';

import {
  toggleMonthlySubscription,
  configMonthlySubscription,
} from '../actions';

function composer(props, onData) {
  const product = currentProduct();

  if (!product) {
    return null;
  }

  return onData(null, {
    toggled: product.subscriptionEnabled,
    amount: product.subscription && (product.subscription.amount / 100).toFixed(2) || 0,
    stripePlanId: product.subscription && product.subscription.stripePlanId || '',
    onToggle: (toggled) => toggleMonthlySubscription({
      productId: product._id,
      state: toggled,
    }),
    onSubmit: ({ amount, stripePlanId }) => configMonthlySubscription({
      productId: product._id,
      amount: parseFloat(amount),
      stripePlanId,
    }),
  });
}

export default composeWithTracker(composer)(MonthlySubscriptionToggle);
