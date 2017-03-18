import { Meteor } from 'meteor/meteor';

import { FlowRouter } from 'meteor/kadira:flow-router';

import { error, success } from '../notifier';

import { changeProduct } from './currentProduct';

import {
  togglePAYG as togglePAYGMethod,
  configDefaultPrice as configDefaultPriceMethod,
} from '/imports/api/products/methods';

const handleCallback = (err) => {
  if (err) {
    return error(err.reason || err);
  }

  return success('Saved.');
};


export const togglePAYG = ({ productId, state }) =>
  togglePAYGMethod.call({ productId, state }, handleCallback);

export const configDefaultPrice = ({ productId, price }) =>
  configDefaultPriceMethod.call({ productId, price }, handleCallback);

export const configGuestButtonText = ({ productId, guestButtonText }) =>
  Meteor.call('products.configGuestButtonText', { productId, guestButtonText }, handleCallback);

export const configGuestMessageText = ({ productId, guestMessageText }) =>
  Meteor.call('products.configGuestMessageText', { productId, guestMessageText }, handleCallback);


export const toggleSocialProof = ({ productId, state }) =>
  Meteor.call('products.toggleSocialProof', { productId, isEnabled: state }, handleCallback);

export const updateSocialProofMessage = ({ productId, message }) =>
  Meteor.call('products.updateSocialProofMessage', { productId, message }, handleCallback);

export const toggleFooterBar = ({ productId, state }) =>
  Meteor.call('products.toggleFooterBar', { productId, state }, handleCallback);

export const toggleFooterBarOnAllPages = ({ productId, state }) =>
  Meteor.call('products.toggleFooterBarOnAllPages', { productId, state }, handleCallback);

export function addProduct(data, callback) {
  Meteor.call('products/add', data, (err, productId) => {
    if (err) {
      error(err.reason);
    } else {
      success('Saved.');
      changeProduct({ id: productId });
      FlowRouter.go('/setup');
    }

    if (callback) {
      callback(err, productId);
    }
  });
}

export function verify(productId, callback) {
  Meteor.call('products.verify', productId, (err) => {
    if (err) {
      error(err.reason);
    } else {
      success('Verified.');
      FlowRouter.go('/websites');
    }

    if (callback) {
      callback(err);
    }
  });
}
