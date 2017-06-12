import { composeWithTracker } from 'react-komposer';

import { Meteor } from 'meteor/meteor';

import { Plans } from 'meteor/drizzle:models';
import { currentProduct } from '../../products/currentProduct';

import PlanList from '../components/PlanList';
import { deletePlan } from '../actions.js';

function composer(props, onData) {
  const product = currentProduct();
  if (!product) { return; }

  if (!Meteor.subscribe('subscriptions.plansByProductId', { productId: product._id }).ready()) {
    return;
  }

  onData(null, {
    product,
    deletePlan,
    plans: Plans.find({ productId: product._id }).fetch(),
  });
}

export default composeWithTracker(composer)(PlanList);
