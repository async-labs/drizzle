import { Meteor } from 'meteor/meteor';
import { composeWithTracker } from 'react-komposer';

import { getCurrentWall, getCurrentProduct } from '/imports/products/client/api';
import { error, success } from '/imports/notifier';

import InvitationForm from '../components/InvitationForm';

function composer(props, onData) {
  const product = getCurrentProduct();
  const wall = getCurrentWall();

  onData(null, {
    onSubmit: ({ target } = event) => {
      const email = target.email;

      Meteor.call('referral.sendInvite', {
        productId: product._id,
        email: email.value,
        url: `http://${wall.url}`,
      }, (err) => {
        if (err) {
          return error(err);
        }

        email.value = '';
        return success('Email sent!');
      });
    },
  });
}

export default composeWithTracker(composer)(InvitationForm);
