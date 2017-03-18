import { composeWithTracker } from 'react-komposer';
import { Meteor } from 'meteor/meteor';

import Bank from '../components/Bank';

function composer(props, onData) {
  const user = Meteor.user();
  const bankAccount = user && user.stripeBankCustomer && user.stripeBankCustomer.bankAccount || null;

  onData(null, { bankAccount });
}

export default composeWithTracker(composer)(Bank);
