import { composeWithTracker } from 'react-komposer';

import { Meteor } from 'meteor/meteor';

import AddProduct from '../components/AddProduct.jsx';
import { addProduct } from '../actions';


function composer(props, onData) {
  if (!Meteor.userId()) { return; }

  onData(null, { addProduct });
}

export default composeWithTracker(composer)(AddProduct);
