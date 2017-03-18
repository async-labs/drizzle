import { composeWithTracker } from 'react-komposer';

import { currentProduct } from '../../products/currentProduct';

import WordpressSetup from '../components/WordpressSetup.jsx';
import { deleteKey, generateKey } from '../actions';

function composer(props, onData) {
  const product = currentProduct();
  if (!product) { return; }

  const apiKey = product.wpPlugin && product.wpPlugin.apiKey;
  const isKeyInstalled = product.wpPlugin && product.wpPlugin.isKeyInstalled;
  let { isGuiding } = props;
  isGuiding = !isKeyInstalled && isGuiding;

  onData(null, { product, apiKey, isKeyInstalled, deleteKey, generateKey, isGuiding });
}

export default composeWithTracker(composer)(WordpressSetup);
