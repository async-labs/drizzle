import { composeWithTracker } from 'react-komposer';

import { KeyValues } from 'meteor/drizzle:models';

import { currentProduct } from '../../products/currentProduct';
import { configStripe } from '../actions';
import StripeForm from '../components/StripeForm';

function composer(props, onData) {
  const product = currentProduct();

  if (!product) {
    return null;
  }

  const secretKeyObj = KeyValues.findOne({ key: 'stripeSecretKey' });
  const publishableKeyObj = KeyValues.findOne({ key: 'stripePublishableKey' });

  return onData(null, {
    secretKey: secretKeyObj && secretKeyObj.value || '',
    publishableKey: publishableKeyObj && publishableKeyObj.value || '',

    onSubmit: ({ secretKey, publishableKey }) => configStripe({
      productId: product._id,
      secretKey,
      publishableKey,
    }),
  });
}

export default composeWithTracker(composer)(StripeForm);
