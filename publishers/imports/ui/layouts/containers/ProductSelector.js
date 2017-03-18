import {
  composeWithTracker,
} from 'react-komposer';

import { currentProduct } from '../../products/currentProduct';

import ProductSelector from '../components/ProductSelector.jsx';

function composer(props, onData) {
  const { products } = props;

  let currentProductId = '';

  const product = currentProduct();

  if (product) {
    currentProductId = product._id;
  }

  onData(null, { products, currentProductId });
}

export default composeWithTracker(composer)(ProductSelector);
