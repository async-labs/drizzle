import { composeWithTracker } from 'react-komposer';
import { currentProduct } from '../../products/currentProduct';

import FreeTrialToggle from '../components/FreeTrialToggle';
import {
  toggleFreeTrial,
  configFreeTrial,
} from '../actions';

function composer(props, onData) {
  const product = currentProduct();

  if (!product) {
    return null;
  }

  return onData(null, {
    toggled: product.isFreeTrialEnabled,
    value: product.freeTrialDayCount,
    onToggle: (toggled) => toggleFreeTrial({
      productId: product._id,
      state: toggled,
    }),
    onSubmit: (freeTrialDayCount) => configFreeTrial({
      productId: product._id,
      freeTrialDayCount: parseInt(freeTrialDayCount, 10),
    }),
  });
}

export default composeWithTracker(composer)(FreeTrialToggle);
