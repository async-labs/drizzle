import { composeWithTracker } from 'react-komposer';
import { ConfigurationInput } from '/imports/ui/components';
import { configGuestButtonText } from '../actions';
import { currentProduct } from '../../products/currentProduct';

function composer(props, onData) {
  const product = currentProduct();

  if (!product) {
    return null;
  }

  return onData(null, {
    name: 'Call-to-action button label for guest users',
    value: product.guestButtonText || 'Join us',
    nameStyle: { fontWeight: 700 },
    onSubmit: (value) => {
      configGuestButtonText({
        productId: product._id,
        guestButtonText: value,
      });
    },
  });
}

export default composeWithTracker(composer)(ConfigurationInput);
