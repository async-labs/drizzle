import { composeWithTracker } from 'react-komposer';

import { Meteor } from 'meteor/meteor';
import { ReactiveVar } from 'meteor/reactive-var';

import { currentProduct } from '../../products/currentProduct';

import Paywalls from '../components/Paywalls.jsx';


const countVar = new ReactiveVar(null);

function getCounts(product) {
  Meteor.call('contentWalls.getCounts', product._id, (err, counts) => {
    if (err) {
      console.error(err);
      return;
    }

    countVar.set(counts);
  });
}

function composer(props, onData) {
  const product = currentProduct();
  if (!product) { return null; }

  const counts = countVar.get();
  if (!counts) {
    getCounts(product);
    return null;
  }

  onData(null, { product, counts, categoryId: props.categoryId });

  return () => {
    countVar.set(null);
  };
}

export default composeWithTracker(composer)(Paywalls);
