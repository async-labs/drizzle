import { composeWithTracker } from 'react-komposer';
import { currentProduct } from '../../products/currentProduct';

import SocialProofToggle from '../components/SocialProofToggle';

import {
  toggleSocialProof,
  updateSocialProofMessage,
} from '../actions';

function composer(props, onData) {
  const product = currentProduct();

  if (!product) {
    return null;
  }

  return onData(null, {
    toggled: product.socialProof && product.socialProof.isEnabled,
    value: product.socialProof && product.socialProof.message,
    onToggle: (toggled) => toggleSocialProof({
      productId: product._id,
      state: toggled,
    }),
    onSubmit: (message) => updateSocialProofMessage({
      productId: product._id,
      message,
    }),
  });
}

export default composeWithTracker(composer)(SocialProofToggle);
