import { composeWithTracker } from 'react-komposer';

import { currentProduct } from '../../products/currentProduct';

import PlanForm from '../components/PlanForm';
import { savePlan } from '../actions.js';

function composer(props, onData) {
  const product = currentProduct();
  if (!product) { return; }

  onData(null, {
    product,
    plan: props.plan,
    savePlan,
  });
}

export default composeWithTracker(composer)(PlanForm);
