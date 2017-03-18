import { composeWithTracker } from 'react-komposer';
import { ConfigurationInput } from '/imports/ui/components';
import { configGuestMessageText } from '../actions';
import { currentProduct } from '../../products/currentProduct';

function composer(props, onData) {
  const product = currentProduct();

  if (!product) {
    return null;
  }

  return onData(null, {
    name: 'Call-to-action message for guest users',
    value: product.guestMessageText || 'Become a member to access premium content.',
    nameStyle: { fontWeight: 700 },
    onSubmit: (value) => {
      configGuestMessageText({
        productId: product._id,
        guestMessageText: value,
      });
    },
  });
}

export default composeWithTracker(composer)(ConfigurationInput);
