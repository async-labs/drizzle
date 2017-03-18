import { Meteor } from 'meteor/meteor';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { check } from 'meteor/check';
import { Accounts } from 'meteor/accounts-base';
import { ContentWalls } from 'meteor/drizzle:models';
import { create } from 'meteor/drizzle:user-functions';

export const registerUserToProduct = new ValidatedMethod({
  name: 'users.registered',
  validate: new SimpleSchema({
    url: { type: String },
    productId: { type: String },
    wallId: { type: String, optional: true },
  }).validator(),
  run({ url, productId, wallId }) {
    this.unblock();

    const userData = {};
    const user = Meteor.users.findOne(this.userId);

    // Facebook login calls this method everytime user login
    // so we need to check.
    // already registered user.
    if (user.registeredAt) {
      return;
    }

    Meteor.users.update({
      _id: this.userId,
      registeredAt: {
        $exists: false,
      },
    }, {
      $set: {
        registeredAt: url,
      },
    });

    if (wallId) {
      ContentWalls.update(wallId, { $inc: { registeredUserCount: 1 } });
    }

    create({ userId: this.userId, productId }, userData);
  },
});

Meteor.methods({
  'users.sendVerifyEmail'(url) {
    check(url, String);

    if (!this.userId) {
      throw new Meteor.Error('login-required', 'Login required');
    }

    Meteor.users.update(this.userId, { $set: { resetPasswordRequestedUrl: url } });

    Accounts.sendVerificationEmail(this.userId);
  },

  'auth/recoverPassword'(email, url) {
    check(email, String);
    check(url, String);

    const user = Accounts.findUserByEmail(email);

    if (!user) {
      throw new Meteor.Error('user-not-found', 'User not found, check if email is right.');
    }

    Meteor.users.update(user._id, { $set: { resetPasswordRequestedUrl: url } });

    Accounts.sendResetPasswordEmail(user._id, email);
  },
});
