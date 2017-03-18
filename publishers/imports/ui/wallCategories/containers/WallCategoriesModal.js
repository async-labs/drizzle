import { Meteor } from 'meteor/meteor';
import { composeWithTracker } from 'react-komposer';
import { Categories } from 'meteor/drizzle:models';
import { currentProduct } from '../../products/currentProduct';

import WallCategoriesModal from '../components/WallCategoriesModal.jsx';
import { remove } from '../actions.js';

function composer(props, onData) {
  const product = currentProduct();
  if (!product) { return; }

  if (!Meteor.subscribe('contentWalls.categories', product._id).ready()) {
    return;
  }

  onData(null, {
    product,
    remove,
    categories: Categories.find({ productId: product._id }).fetch(),
  });
}

export default composeWithTracker(composer)(WallCategoriesModal);
