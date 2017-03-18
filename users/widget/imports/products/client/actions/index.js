import { Meteor } from 'meteor/meteor';

export function buy(wallId, callback) {
  Meteor.call('products.chargePAYG', { wallId }, (err, result) => {
    if (callback) { callback(err, result); }
  });
}

export function unlock(wallId, callback) {
  Meteor.call('products.unlock', { wallId }, (err, result) => {
    if (callback) { callback(err, result); }
  });
}

export function upvote(wallId, callback) {
  Meteor.call('products.upvote', { wallId }, (err, result) => {
    if (callback) { callback(err, result); }
  });
}

export function readLater(wallId, callback) {
  Meteor.call('products.readLater', { wallId }, (err, result) => {
    if (callback) { callback(err, result); }
  });
}
