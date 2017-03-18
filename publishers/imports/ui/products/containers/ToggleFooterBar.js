import { composeWithTracker } from 'react-komposer';
import { currentProduct } from '../../products/currentProduct';
import ToggleFooterBar from '../components/ToggleFooterBar';

import {
  toggleFooterBar,
  toggleFooterBarOnAllPages,
} from '../actions';


function composer(props, onData) {
  const product = currentProduct();

  if (!product) {
    return null;
  }

  return onData(null, {
    toggled: product.isFooterBarEnabled,
    enabledOnAllPages: product.isFooterBarEnabledOnAllPages,
    onToggle: (toggled) => toggleFooterBar({
      productId: product._id,
      state: toggled,
    }),
    onToggleEnableOnAllPages: (toggled) => toggleFooterBarOnAllPages({
      productId: product._id,
      state: toggled,
    }),
  });
}

export default composeWithTracker(composer)(ToggleFooterBar);
