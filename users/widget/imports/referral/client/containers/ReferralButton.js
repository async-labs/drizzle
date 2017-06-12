import { Meteor } from 'meteor/meteor';

import { composeWithTracker } from 'react-komposer';

import ReferralButton from '../components/ReferralButton';
import { getCurrentProduct } from '/imports/products/client/api';


function composer(props, onData) {
  const user = Meteor.user();
  const product = getCurrentProduct();

  if (!user || !product) {
    return;
  }

  const data = {
    product,
  };

  onData(null, data);
}

export default composeWithTracker(composer)(ReferralButton);
