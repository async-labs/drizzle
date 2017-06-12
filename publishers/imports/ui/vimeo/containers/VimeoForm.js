import { composeWithTracker } from 'react-komposer';

import { Meteor } from 'meteor/meteor';

import { currentProduct } from '../../products/currentProduct';
import { error } from '../../notifier';

import VimeoForm from '../components/VimeoForm';


function composer(props, onData) {
  const product = currentProduct();

  if (!product) {
    return null;
  }

  return onData(null, {
    isConnected: !!product.vimeoToken && product.vimeoToken.isConnected,
    connect() {
      Meteor.call('vimeo.getAuthorizationEndpoint', product._id, (err, url) => {
        if (err) {
          error(err);
          return;
        }

        location.href = url;
      });
    },
  });
}

export default composeWithTracker(composer)(VimeoForm);
