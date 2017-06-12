import { composeWithTracker } from 'react-komposer';
import { currentProduct } from '../../products/currentProduct';

import DailyAccessToggle from '../components/DailyAccessToggle';

import {
  toggleDailyAccess,
  updateDailyAccessPrice,
} from '../actions';


function composer(props, onData) {
  const product = currentProduct();

  if (!product) {
    return null;
  }

  return onData(null, {
    toggled: product.dailyAccessConfig && product.dailyAccessConfig.isEnabled,
    value: product.dailyAccessConfig && (product.dailyAccessConfig.price / 100 || 0).toFixed(2),
    onToggle: (toggled) => toggleDailyAccess({
      productId: product._id,
      state: toggled,
    }),
    onSubmit: (price) => updateDailyAccessPrice({
      productId: product._id,
      price: Number(price) * 100,
    }),
  });
}

export default composeWithTracker(composer)(DailyAccessToggle);
