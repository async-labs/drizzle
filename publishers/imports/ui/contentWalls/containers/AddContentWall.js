import { composeWithTracker } from 'react-komposer';

import { currentProduct } from '../../products/currentProduct';

import AddContentWall from '../components/AddContentWall.jsx';
import { addWall } from '../actions';


function composer(props, onData) {
  const product = currentProduct();
  if (!product) {
    return;
  }

  onData(null, { addWall, product });
}

export default composeWithTracker(composer)(AddContentWall);
