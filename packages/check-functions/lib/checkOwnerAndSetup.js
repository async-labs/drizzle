import { Meteor } from 'meteor/meteor';

export default ({ product, user, checkSetup = true }) => {
  if (!product) {
    throw new Meteor.Error('invalid-data', 'Invalid data');
  }

  if (!product.isOwner(user)) {
    throw new Meteor.Error('permission-denied', 'Permission denied');
  }

  if (checkSetup && !product.isSetupDone()) {
    throw new Meteor.Error(
      'setup-not-done',
      'Please complete setup. Go to <a href="/setup">setup</a>'
    );
  }
};
