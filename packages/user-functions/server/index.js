import { Meteor } from 'meteor/meteor';
import { _ } from 'meteor/underscore';
import { Random } from 'meteor/random';
import { HTTP } from 'meteor/http';
import { Email } from 'meteor/email';
import { ProductUsers, Products } from 'meteor/drizzle:models';
import { MailchimpAdapter } from 'meteor/drizzle:integrations';

export function exportToISP({ product, user }) {
  const { ispAPI } = product;
  if (!ispAPI) { return; }

  const { url, key, emailSubject, emailContent } = ispAPI;
  if (!url || !key) { return; }

  if (!user.email) { return; }

  const name = `${user.email.split('@')[0]}${Math.floor(Math.random() * 1000)}`;

  const password = Random.id();

  try {
    HTTP.post(`${url}/core/members`, {
      auth: `${key}:`,
      params: {
        name,
        password,
        email: user.email,
      },
    });
  } catch (e) {
    if (!e.response ||
        !e.response.data ||
        e.response.data.errorMessage !== 'Undefined index: pp_gravatar') {
      return;
    }
  }

  ProductUsers.update(user._id, { $set: { exported: true } });

  const subject = emailSubject || 'Created account fantasyteamadvice.com/forums/';
  const body = emailContent || '';
  Email.send({
    from: 'Drizzle <support@getdrizzle.com>',
    to: user.email,
    subject,
    html: `${body}<p>Username: ${name}<br>Password: ${password}</p>`,
  });
}

export function create({ userId, productId }, data) {
  const user = Meteor.users.findOne(userId);
  const product = Products.findOne(productId);

  if (!user || !product || ProductUsers.findOne({ userId, productId })) {
    return false;
  }

  const doc = {
    userId,
    productId,
    productTitle: product.title,
    productDomain: product.domain,
    createdAt: new Date(),
    registeredAt: user.registeredAt,
    isRegisteredAtIt: user.registeredAt && user.registeredAt.startsWith(product.url) || false,
  };

  const profile = user.profile;
  if (profile) {
    _.extend(doc, _.pick(profile, 'firstName', 'lastName', 'name'));
  }

  const email = user.emails && user.emails[0];
  if (email) {
    doc.email = email.address;
  }

  try {
    doc._id = ProductUsers.insert(_.extend(doc, data));

    MailchimpAdapter.addToList({ user, product });

    Meteor.defer(() => {
      exportToISP({ product, user: doc });
    });

    // sending welcome email
    const welcomeEmail = product.welcomeEmail || {};
    const { subject, body } = welcomeEmail;

    if (doc.email && subject && body) {
      const emailObj = {
        from: 'Drizzle <support@getdrizzle.com>',
        subject,
        html: body.replace(/\n/g, '<br/>'),
        to: doc.email,
      };

      Meteor.defer(() => {
        Email.send(emailObj);
      });
    }

    return doc;
  } catch (err) {
    if (err.code === 11000) {
      return console.log('Duplicated product_user not added.', doc);
    }
    throw err;
  }
}

export function addTotalSpent({ userId, productId }, { amount }, modifier = {}) {
  const productUser = ProductUsers.findOne({ userId, productId });

  if (!productUser) {
    create(
      { userId, productId },
      _.extend({ totalSpent: amount }, modifier)
    );

    return;
  }

  ProductUsers.update(
    productUser._id,
    { $set: modifier, $inc: { totalSpent: amount } }
  );
}

export function subscribed({
  userId,
  productId,
  monthly,
  freeTrial,
  subscriptionObject,
}) {
  if (!userId || !productId || !subscriptionObject) { return; }

  let productUser = ProductUsers.findOne({ userId, productId });
  if (!productUser) {
    productUser = create({ userId, productId });
  }

  const modifier = { $set: {
    stripeSubscriptionId: subscriptionObject.stripeSubscriptionId,
    isSubscribed: true,
    isUnsubscribed: false,
  } };

  if (freeTrial) {
    modifier.$set.freeTrialEndAt = subscriptionObject.endAt;
    modifier.$set.freeTrialBeginAt = subscriptionObject.beginAt;
  } else if (!monthly) {
    return;
  }

  if (!freeTrial) {
    modifier.$set.subscribedDate = new Date();
  }

  ProductUsers.update(productUser._id, modifier);
}

export function unsubscribed({ userId, productId, monthly, freeTrial }) {
  if (!userId || !productId) { return; }

  let productUser = ProductUsers.findOne({ userId, productId });
  if (!productUser) {
    productUser = create({ userId, productId });
  }

  let modifier;
  if (monthly) {
    modifier = { $set: { isUnsubscribed: true, isSubscribed: false } };
  } else if (freeTrial) {
    modifier = { $set: {
      isUnsubscribed: true, isSubscribed: false,
      freeTrialEndAt: new Date(),
      isCancelledFreeTrial: true,
    } };
  } else {
    return;
  }

  if (!freeTrial) {
    modifier.$set = modifier.$set || {};
    modifier.$set.unsubscribedDate = new Date();
  }

  modifier.$unset = { stripeSubscriptionId: 1 };

  ProductUsers.update(productUser._id, modifier);
}

export function removeProductUser({ userId, productId }) {
  if (!userId || !productId) { return; }

  ProductUsers.remove({ userId, productId });
}
