import { composeWithTracker } from 'react-komposer';
import { Meteor } from 'meteor/meteor';

import { getCurrentProduct } from '/imports/products/client/api';
import DailyAccess from '../components/DailyAccess';

function composer(props, onData) {
  const user = Meteor.user();
  const product = getCurrentProduct();

  Meteor.subscribe('dailyAccess.activeAccess', product._id);

  const dailyAccess = user.getActiveDailyAccess(product._id);

  onData(null, {
    dailyAccess,
  });
}

export default composeWithTracker(composer)(DailyAccess);
