import { Meteor } from 'meteor/meteor';
import { ReactiveVar } from 'meteor/reactive-var';

const currentUrl = new ReactiveVar(null);

export function set(url) {
  if (!url) {
    throw new Meteor.Error('error', 'Provide url!');
  }

  if (currentUrl.get() && currentUrl.get() !== url) {
    throw new Meteor.Error('error', 'Can not change url!');
  }

  currentUrl.set(url);

  Meteor.subscribe('widget.product', url);
  Meteor.subscribe('products/getContentWallByUrl', url);
}

export function get() {
  return currentUrl.get();
}

if (process.env.NODE_ENV === 'development') {
  // set('http://localhost:8060');
}
