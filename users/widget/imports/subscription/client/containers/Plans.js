import { Meteor } from 'meteor/meteor';

import { composeWithTracker } from 'react-komposer';

import { Subscriptions, Plans } from 'meteor/drizzle:models';

import PlansComp from '../components/Plans';
import { getCurrentWall, getCurrentProduct } from '/imports/products/client/api';


function composer(props, onData) {
  const user = Meteor.user();
  const product = getCurrentProduct();
  const wall = getCurrentWall();

  if (!wall) {
    return;
  }

  const now = new Date();

  let plan;
  let planSubscription;
  if (wall.subscriptionPlanIds) {
    plan = Plans.findOne({
      productId: product._id,
      _id: wall.subscriptionPlanIds[0],
      type: { $ne: 'singlePayment' },
    });

    if (plan) {
      planSubscription = Subscriptions.findOne({
        userId: user._id, productId: product._id, planId: plan._id,
        beginAt: { $lte: now }, endAt: { $gte: now },
      });
    }
  }

  const data = {
    product,
    wall,
    plan,
    planSubscription,
    user,
  };

  onData(null, data);
}

export default composeWithTracker(composer)(PlansComp);
