import { Meteor } from 'meteor/meteor';
import { composeWithTracker } from 'react-komposer';

import { ProductUsers } from 'meteor/drizzle:models';
import { error, success } from '/imports/ui/notifier';
import SubscribeModal from '../components/SubscribeModal';

function compose(props, onData) {
  const { productUserId } = props;

  let hasFreeAccess = false;

  if (productUserId) {
    const productUser = ProductUsers.findOne(productUserId);
    hasFreeAccess = !!(productUser && productUser.hasFreeAccess);
  }

  return onData(null, {
    toggled: hasFreeAccess,
    onToggle(toggled) {
      if (!productUserId) {
        return;
      }

      Meteor.call(
        'productUsers.giveFreeAccess',
        { productUserId, hasFreeAccess: toggled },
        (err) => {
          if (err) {
            error(err);
          } else {
            success('Saved');
          }
        }
      );
    },
  });
}

export default composeWithTracker(compose)(SubscribeModal);
