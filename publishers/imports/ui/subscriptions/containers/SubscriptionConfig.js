import { composeWithTracker } from 'react-komposer';

import { currentProduct } from '../../products/currentProduct';

import SubscriptionConfig from '../components/SubscriptionConfig.jsx';
import {
  toggleSubscription,
  configSubscription,
} from '../actions';

function composer(props, onData) {
  const product = currentProduct();
  if (!product) { return; }

  const { freeTrialDayCount } = product;

  onData(null, {
    product,
    freeTrialDayCount,
    toggleSubscription,
    configSubscription,
  });
}

export default composeWithTracker(composer)(SubscriptionConfig);
