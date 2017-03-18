import { composeWithTracker } from 'react-komposer';

import { Meteor } from 'meteor/meteor';
import { ReactiveVar } from 'meteor/reactive-var';

import { Products } from 'meteor/drizzle:models';

import ProductsComponent from '../components/Products.jsx';


const offsetVar = new ReactiveVar(0);

function changeOffset(val) {
  offsetVar.set(val);
}

function composer(props, onData) {
  if (!Meteor.userId()) { return null; }

  const filter = {};
  if (!Meteor.user().isAdmin()) {
    filter.vendorUserId = Meteor.userId();
  }

  const limit = 10;
  const offset = offsetVar.get();

  const options = {
    sort: { postedAt: -1 },
    skip: offset,
    limit,
  };

  const products = Products.find(filter, options).fetch();

  onData(null, {
    products,
    limit,
    changeOffset,
    offset,
    totalCount: Products.find(filter).count(),
  });

  return () => {
    offsetVar.set(0);
  };
}

export default composeWithTracker(composer)(ProductsComponent);
