import { composeWithTracker } from 'react-komposer';

import { currentProduct } from '../../products/currentProduct';

import WallSettings from '../components/WallSettings';

function composer(props, onData) {
  const product = currentProduct();
  if (!product) {
    return;
  }

  onData(null, { });
}

export default composeWithTracker(composer)(WallSettings);
