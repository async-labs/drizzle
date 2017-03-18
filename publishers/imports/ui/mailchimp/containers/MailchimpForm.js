import { composeWithTracker } from 'react-komposer';
import { currentProduct } from '../../products/currentProduct';
import { configMailchimp } from '../actions';
import MailchimpForm from '../components/MailchimpForm';

function composer(props, onData) {
  const product = currentProduct();

  if (!product) {
    return null;
  }

  return onData(null, {
    listId: product.mailchimpConfig && product.mailchimpConfig.listId,
    apiKey: product.mailchimpConfig && product.mailchimpConfig.apiKey,

    onSubmit: ({ listId, apiKey }) => configMailchimp({
      productId: product._id,
      listId,
      apiKey,
    }),
  });
}

export default composeWithTracker(composer)(MailchimpForm);
