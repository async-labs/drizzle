import { composeWithTracker } from 'react-komposer';

import { currentProduct } from '../../products/currentProduct';

import Config from '../components/Config';
import {
  toggle,
  saveItemCountToShow,
  savePurchasedCount,
  saveUpvoteCount,
} from '../actions';


function composer(props, onData) {
  const product = currentProduct();

  if (!product) {
    return null;
  }

  return onData(null, {
    upsellingConfig: product.upsellingConfig,
    onChangeUpsellingCount: (number) => saveItemCountToShow({
      productId: product._id,
      count: parseInt(number, 10),
    }),
    onChangePurchasedCount: (number) => savePurchasedCount({
      productId: product._id,
      count: parseInt(number, 10),
    }),
    onChangeUpvoteCount: (number) => saveUpvoteCount({
      productId: product._id,
      count: parseInt(number, 10),
    }),
    onToggle: ({ type, toggled }) => toggle({
      productId: product._id,
      state: toggled,
      type,
    }),
  });
}

export default composeWithTracker(composer)(Config);
