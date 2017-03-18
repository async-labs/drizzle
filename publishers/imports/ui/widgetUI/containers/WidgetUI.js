import { composeWithTracker } from 'react-komposer';

import { currentProduct } from '../../products/currentProduct';

import WidgetUI from '../components/WidgetUI.jsx';
import { saveImage, saveConfig } from '../actions';


function composer(props, onData) {
  const product = currentProduct();
  if (!product) { return; }

  const image = product.widgetUIImage();
  onData(null, { product, saveImage, saveConfig, image });
}

export default composeWithTracker(composer)(WidgetUI);
