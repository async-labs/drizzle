import { composeWithTracker } from 'react-komposer';
import { currentProduct } from '../../products/currentProduct';
import { configReferral } from '../actions';
import ReferralToggle from '../components/ReferralToggle';

function composer(props, onData) {
  const product = currentProduct();

  if (!product) {
    return null;
  }

  return onData(null, {
    toggled: product.referralConfig && product.referralConfig.isEnabled,
    referralConfig: product.referralConfig,
    onToggle: (toggled) => configReferral({
      productId: product._id,
      referralConfig: {
        isEnabled: toggled,
      },
    }),
    onSubmit: ({
      giveNumber,
      giveType,
      earnNumber,
      earnType,
      condition,
    }) => configReferral({
      productId: product._id,
      referralConfig: {
        isEnabled: product.referralConfig && product.referralConfig.isEnabled,
        giveNumber: parseFloat(giveNumber),
        earnNumber: parseFloat(earnNumber),
        earnType,
        giveType,
        condition,
      },
    }),
  });
}

export default composeWithTracker(composer)(ReferralToggle);
