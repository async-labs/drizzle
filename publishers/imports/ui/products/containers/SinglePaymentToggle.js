import { composeWithTracker } from 'react-komposer';
import { currentProduct } from '../../products/currentProduct';
import SinglePaymentToggle from '../components/SinglePaymentToggle';

import {
  togglePAYG,
  configDefaultPrice,
} from '../actions';

function composer(props, onData) {
  const product = currentProduct();

  if (!product) {
    return null;
  }

  return onData(null, {
    toggled: product.paygEnabled,
    value: ((product.defaultWallPrice || 0) / 100).toFixed(2),
    onToggle: (toggled) => togglePAYG({
      productId: product._id,
      state: toggled,
    }),
    onSubmit: (price) => configDefaultPrice({
      productId: product._id,
      price: parseFloat(price) * 100,
    }),
  });
}

export default composeWithTracker(composer)(SinglePaymentToggle);
