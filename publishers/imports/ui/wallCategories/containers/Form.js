import { composeWithTracker } from 'react-komposer';

import { currentProduct } from '../../products/currentProduct';

import Form from '../components/Form.jsx';
import { save } from '../actions.js';

function composer(props, onData) {
  const product = currentProduct();
  if (!product) { return; }

  onData(null, {
    product,
    category: props.category,
    save,
  });
}

export default composeWithTracker(composer)(Form);
