import { composeWithTracker } from 'react-komposer';

import { Meteor } from 'meteor/meteor';

import { Products } from 'meteor/drizzle:models';

import Verify from '../components/Verify.jsx';
import { verify } from '../actions';


function composer(props, onData) {
  if (!Meteor.userId()) {
    return;
  }

  Meteor.subscribe('myProductById', props.productId, () => {
    const filter = { _id: props.productId, vendorUserId: Meteor.userId() };
    const product = Products.findOne(filter);

    if (!product) { return; }

    onData(null, { product, verify });
  });
}

export default composeWithTracker(composer)(Verify);
