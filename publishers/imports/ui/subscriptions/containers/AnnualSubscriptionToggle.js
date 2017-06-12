import { composeWithTracker } from 'react-komposer';
import { currentProduct } from '../../products/currentProduct';

import {
  toggleAnnualSubscription,
  configAnnualSubscription,
} from '../actions';

import AnnualSubscriptionToggle from '../components/AnnualSubscriptionToggle';

function composer(props, onData) {
  const product = currentProduct();

  if (!product) {
    return null;
  }

  return onData(null, {
    toggled: product.annualSubscriptionEnabled,
    amount: product.annualSubscription && (product.annualSubscription.amount / 100).toFixed(2) || 0,
    stripePlanId: product.annualSubscription && product.annualSubscription.stripePlanId || '',
    onToggle: (toggled) => toggleAnnualSubscription({
      productId: product._id,
      state: toggled,
    }),
    onSubmit: ({ amount, stripePlanId }) => configAnnualSubscription({
      productId: product._id,
      amount: parseFloat(amount),
      stripePlanId,
    }),
  });
}

export default composeWithTracker(composer)(AnnualSubscriptionToggle);
