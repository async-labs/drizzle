import mailgun from 'mailgun-js';

import { Meteor } from 'meteor/meteor';
import { Email } from 'meteor/email';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { Accounts } from 'meteor/accounts-base';
import { check, Match } from 'meteor/check';
import { _ } from 'meteor/underscore';
import { checkOwnerAndSetup } from 'meteor/drizzle:check-functions';
import { Products, Subscriptions, ProductUsers } from 'meteor/drizzle:models';
import { unsubscribed } from 'meteor/drizzle:user-functions';
import { buildFilterQuery } from '/imports/api/users/lib/query-builder';
import { getFilterName } from '/imports/api/users/lib/get-filter-name';
import { FilterQuerySchema } from '/imports/api/users/lib/shared-schemas';

// TODO: Move this to mixin
const validateMailgunSetup = (product) => {
  if (!product.mailgunConfig) {
    throw new Meteor.Error('not-found', 'Mailgun setup not found');
  }

  if (!product.mailgunConfig.fromName) {
    throw new Meteor.Error('invalid-data', 'Mailgun setup is missing "fromName" field');
  }

  if (!product.mailgunConfig.fromEmail) {
    throw new Meteor.Error('invalid-data', 'Mailgun setup is missing "fromEmail" field');
  }

  if (!product.mailgunConfig.apiKey) {
    throw new Meteor.Error('invalid-data', 'Mailgun setup is missing "apiKey" field');
  }

  if (!product.mailgunConfig.domain) {
    throw new Meteor.Error('invalid-data', 'Mailgun setup is missing "domain" apiKey field');
  }
};

export const sendEmailToUser = new ValidatedMethod({
  name: 'productUsers.sendEmailToUser',
  validate: new SimpleSchema({
    productId: {
      type: String,
    },
    productUserId: {
      type: String,
    },
    subject: {
      type: String,
    },
    body: {
      type: String,
    },
  }).validator(),
  run({ productId, productUserId, subject, body }) {
    const product = Products.findOne(productId, {
      fields: {
        mailgunConfig: 1,
        vendorUserId: 1,
        isScriptInstalled: 1,
        wpPlugin: 1,
      },
    });

    if (!product) {
      throw new Meteor.Error('not-found', 'Product not found');
    }

    checkOwnerAndSetup({ product, user: Meteor.user() });
    validateMailgunSetup(product);

    const { domain, fromName, apiKey, fromEmail } = product.mailgunConfig;
    const mailgunClient = mailgun({ apiKey, domain });
    const sendEmailSync = Meteor.wrapAsync(
      mailgunClient.messages().send,
      mailgunClient.messages()
    );

    const productUser = ProductUsers.findOne(productUserId, {
      fields: {
        email: 1,
      },
    });

    try {
      sendEmailSync({
        from: `${fromName} via Drizzle <${fromEmail}>`,
        to: productUser.email,
        html: body.replace(/\n/g, '<br/>'),
        subject,
      });
    } catch (err) {
      console.error(err);
    }
  },
});

export const sendEmailToUsers = new ValidatedMethod({
  name: 'productUsers.sendEmailToUsers',
  validate: new SimpleSchema({
    params: {
      type: FilterQuerySchema,
    },
    subject: {
      type: String,
    },
    body: {
      type: String,
    },
  }).validator(),
  run({ params, subject, body }) {
    const product = Products.findOne(params.productId, {
      fields: {
        domain: 1,
        mailgunConfig: 1,
        vendorUserId: 1,
        isScriptInstalled: 1,
        wpPlugin: 1,
      },
    });

    if (!product) {
      throw new Meteor.Error('not-found', 'Product not found');
    }

    const user = Meteor.user();
    checkOwnerAndSetup({ product, user });

    validateMailgunSetup(product);

    const { domain, fromName, apiKey, fromEmail } = product.mailgunConfig;
    const mailgunClient = mailgun({ apiKey, domain });
    const sendEmailSync = Meteor.wrapAsync(
      mailgunClient.messages().send,
      mailgunClient.messages()
    );

    const query = buildFilterQuery(params);
    const productUsers = ProductUsers.find(query, {
      fields: {
        email: 1,
      },
    }).fetch();

    if (product.domain === 'localhost:8060') {
      productUsers.push({ email: 'dudeness101@gmail.com' });
      productUsers.push({ email: 'tima@getdrizzle.com' });
    }

    Meteor.defer(() => {
      productUsers.forEach((productUser) => {
        try {
          sendEmailSync({
            from: `${fromName} via Drizzle <${fromEmail}>`,
            to: productUser.email,
            html: body.replace(/\n/g, '<br/>'),
            subject,
          });
        } catch (err) {
          console.error(err);
        }
      });

      const email = user.emails && user.emails[0] && user.emails[0].address;

      if (email) {
        Email.send({
          subject: 'Group email was successfully sent',
          text: `Your group email "${getFilterName(params)}" was successfully sent.`,
          from: 'Drizzle <support@getdrizzle.com>',
          to: email,
        });
      }
    });
  },
});

export const giveFreeAccess = new ValidatedMethod({
  name: 'productUsers.giveFreeAccess',
  validate({ productUserId, hasFreeAccess }) {
    check(productUserId, String);
    check(hasFreeAccess, Boolean);
  },
  run({ productUserId, hasFreeAccess }) {
    const productUser = ProductUsers.findOne(productUserId);
    if (!productUser) {
      throw new Meteor.Error('invalid-data', 'Product user not found');
    }

    const product = Products.findOne(productUser.productId);

    checkOwnerAndSetup({ product, user: Meteor.user() });

    ProductUsers.update(productUserId, { $set: { hasFreeAccess } });
  },
});

Meteor.methods({
  'auth/sendEnrollmentEmail'() {
    if (!this.userId) {
      throw new Meteor.Error('login-required', 'Login required');
    }

    const user = Meteor.users.findOne(this.userId);
    const emails = user.emails;
    if (!emails || emails.length === 0) { return false; }

    Accounts.sendVerificationEmail(this.userId);
    // return addToMailChimpList(emails[0].address, false, user.vendorStatus);
    return true;
  },

  'auth/sendVerificationEmail'(emailAddress) {
    check(emailAddress, Match.Optional(String)); // eslint-disable-line new-cap

    if (!this.userId) {
      throw new Meteor.Error('login-required', 'Login required');
    }

    const user = Meteor.users.findOne(this.userId);

    let email;
    if (emailAddress) {
      email = _.find(user.emails, (e) => e.address === emailAddress);
    } else {
      email = user && _.last(user.emails);
    }

    if (!email) {
      throw new Meteor.Error('invalid-data', 'Theres is no email');
    }

    if (email.verified) {
      throw new Meteor.Error('invalid-data', 'Email is already verified');
    }

    Accounts.sendVerificationEmail(this.userId, email.address);
  },

  'auth/recoverPassword'(email) {
    check(email, String);

    const user = Accounts.findUserByEmail(email);

    if (!user) {
      return;
    }

    Accounts.sendResetPasswordEmail(user._id, email);
  },

  'productUsers.getTotalCount'(productId, startDate, endDate) {
    check(productId, String);
    check(startDate, Date);
    check(endDate, Date);

    const product = Products.findOne(productId, { fields: { vendorUserId: 1 } });

    checkOwnerAndSetup({ product, user: Meteor.user(), checkSetup: false });

    const count = ProductUsers.find(
      { productId, createdAt: { $gte: startDate, $lte: endDate } }
    ).count();

    return count;
  },

  'productUsers.unsubscribe'(productUserId) {
    check(productUserId, String);

    const productUser = ProductUsers.findOne(productUserId);
    if (!productUser) {
      throw new Meteor.Error('invalid-data', 'Invalid data');
    }

    const product = Products.findOne(productUser.productId,
      { fields: {
        isScriptInstalled: 1,
        wpPlugin: 1,
        vendorUserId: 1,
      } });

    checkOwnerAndSetup({ product, user: Meteor.user() });

    const user = Meteor.users.findOne(productUser.userId);
    if (!user) {
      throw new Meteor.Error('invalid-data', 'Invalid data');
    }

    const modifier = { $pull: {}, $unset: { imported: 1 } };

    if (user.subscribedProducts && user.subscribedProducts.indexOf(product._id) !== 1) {
      modifier.$pull.subscribedProducts = product._id;
      unsubscribed({ userId: user._id, productId: product._id });
    }

    if (!_.isEmpty(modifier.$pull)) {
      Meteor.users.update(user._id, modifier);
    } else {
      Meteor.users.update(user._id, { $unset: { imported: 1 } });
    }

    ProductUsers.update(productUserId,
      { $set: { isSubscribed: false } }
    );

    const now = new Date();
    Subscriptions.remove({
      userId: user._id,
      productId: product._id,
      beginAt: { $lte: now },
      endAt: { $gte: now },
    });
  },
});
