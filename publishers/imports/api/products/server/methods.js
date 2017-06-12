import { parse } from 'url';
import cheerio from 'cheerio';
import { Meteor } from 'meteor/meteor';
import { SimpleSchema } from 'meteor/aldeed:simple-schema';
import { ValidatedMethod } from 'meteor/mdg:validated-method';
import { Mongo } from 'meteor/mongo';
import { Random } from 'meteor/random';
import { HTTP } from 'meteor/http';
import { check, Match } from 'meteor/check';
import { _ } from 'meteor/underscore';
import { getSlug } from 'meteor/ongoworks:speakingurl';
import { checkSetup, checkOwnerAndSetup } from 'meteor/drizzle:check-functions';
import {
  Products,
  ProductUsers,
  Subscriptions,
  ContentWallCharges,
  KeyValues,
} from 'meteor/drizzle:models';

import { MailchimpAdapter } from 'meteor/drizzle:integrations';
import { deleteObject } from 'meteor/drizzle:s3';

Meteor.methods({
  'products/configWidgetUI'(productId, data) {
    check(productId, String);
    check(data, {
      image: String,
    });

    const product = Products.findOne(productId);
    checkOwnerAndSetup({ product, user: Meteor.user() });

    const oldImage = product.widgetUI && product.widgetUI.image;
    Products.update(productId, { $set: { widgetUI: data } });

    if (oldImage) {
      try {
        deleteObject(oldImage);
      } catch (e) {
        console.log(e); // eslint-disable-line no-console
      }
    }
  },

  'products/downloadUserInfo'(productId, limit) {
    check(productId, String);// eslint-disable-line new-cap
    check(limit,
      Match.Where((t) => ['all', 'month'].indexOf(t) !== -1) // eslint-disable-line new-cap
    );

    const product = Products.findOne(productId);
    checkOwnerAndSetup({ product, user: Meteor.user() });

    const users = new Mongo.Collection(null);
    const filter = { productId };
    if (limit === 'month') {
      const date = new Date();
      date.setDate(1);
      date.setHours(0, 0, 0, 0);

      filter.createdAt = { $gte: date };
    }

    let res;
    let user;
    let email;
    let name;

    ContentWallCharges.find(filter).forEach((charge) => {
      user = Meteor.users.findOne(charge.userId);
      if (!user) {
        return;
      }

      res = users.upsert({ _id: user._id }, { $inc: { amount: charge.amount } });
      if (res.insertedId) {
        email = _.last(_.filter(user.emails, (e) => e.verified));
        name = user.profile && user.profile.name || '';

        if (email) {
          users.update(user._id, { $set: { email: email.address, name } });
        }
      }
    });

    Subscriptions.find(filter).forEach((sub) => {
      user = Meteor.users.findOne(sub.userId);
      if (!user) {
        return;
      }

      name = user.profile && user.profile.name;
      res = users.upsert({ _id: user._id }, { $inc: { amount: sub.amount }, $set: { name } });
      if (res.insertedId) {
        email = _.last(_.filter(user.emails, (e) => e.verified));

        if (email) {
          users.update(user._id, { $set: { email: email.address, name } });
        }
      }
    });

    let csv = 'name,email,amount ($)';
    users.find({}, { sort: { amount: -1 } }).forEach((c) => {
      csv += `\n${c.name},${c.email},${c.amount / 100}`;
    });

    return csv;
  },

  'products/add'(params) {
    check(params, {
      url: String,
      numberVisitors: Number,
    });

    const data = params;
    if (!this.userId) {
      throw new Meteor.Error('permission-denied', 'Permission denied');
    }

    if (!data.url.startsWith('http://') && !data.url.startsWith('https://')) {
      data.url = `http://${data.url}`;
    }

    if (!data.numberVisitors || data.numberVisitors < 1) {
      throw new Meteor.Error('invalid-data', 'Number of Visitors is required');
    }

    const obj = {
      vendorUserId: this.userId,
      claimStatus: 'pending',
      website: true,
      verifyKey: Random.secret(),
      createdAt: new Date(),
      numberVisitors: data.numberVisitors,
    };

    try {
      let tryCount = 0;
      let url = data.url;
      let res = HTTP.get(url, { followRedirects: false });

      while (tryCount < 10 && (res.statusCode === 301 || res.statusCode === 302)) {
        url = res.headers && res.headers.location;
        if (!url) {
          break;
        }

        res = HTTP.get(url, { followRedirects: false });
        tryCount++;
      }

      if (res.statusCode !== 200) {
        throw new Error();
      }

      const $ = cheerio.load(res.content);

      obj.description = $('meta[name=description]').attr('content');
      obj.title = $('title').text() || url;
      obj.url = url;
    } catch (e) {
      throw new Meteor.Error('wrong-url', `Error while trying access to "${data.url}"`);
    }

    const productDomain = parse(obj.url).host;

    if (!productDomain) {
      throw new Meteor.Error('invalid-data', 'Invalid URL.');
    }

    if (Products.findOne({ domain: productDomain })) {
      throw new Meteor.Error('invalid-data', 'This website has been already claimed.');
    }

    obj.domain = productDomain;

    let slug = getSlug(obj.title);
    let count = 1;
    const originalSlug = slug;

    while (Products.find({ slug }).count() > 0) {
      count += 1;
      slug = `${originalSlug}-${count}`;
    }

    obj.slug = slug;

    try {
      return Products.insert(obj);
    } catch (err) {
      if (err.code === 11000) {
        return console.log('Duplicated product not added.', obj);
      }
      throw err;
    }
  },

  'products.checkScriptInstallation'(productId) {
    check(productId, String);

    const product = Products.findOne(productId);
    checkOwnerAndSetup({ product, user: Meteor.user(), checkSetup: false });

    const { installed, verified } = checkSetup(product);

    const modifier = {
      $set: {
        isScriptInstalled: installed,
      },
    };

    if (product.claimStatus !== 'verified' && verified) {
      modifier.$set.claimStatus = 'verified';
    }

    Products.update(productId, modifier);

    return installed ? 'installed' : 'not-installed';
  },

  'products.generateVerifyKey'(productId) {
    check(productId, String);

    const product = Products.findOne(productId);
    if (!product || product.verifyKey) {
      return;
    }

    if (!this.userId || !product.isOwner(this.userId)) {
      return;
    }

    Products.update(productId, { $set: { verifyKey: Random.secret() } });
  },

  'products.setDefault'(productId, checked) {
    check(productId, String);
    check(checked, Boolean);

    const product = Products.findOne(productId);
    checkOwnerAndSetup({ product, user: Meteor.user(), checkSetup: false });

    Products.update({ vendorUserId: product.vendorUserId, asDefault: true }, {
      $set: {
        asDefault: false,
      },
    }, { multi: true });

    Products.update(productId, {
      $set: {
        asDefault: checked,
      },
    });
  },

  'products.usingWordpress'(productId, checked) {
    check(productId, String);
    check(checked, Boolean);

    const product = Products.findOne(productId);
    checkOwnerAndSetup({ product, user: Meteor.user(), checkSetup: false });

    Products.update(productId, {
      $set: {
        usingWordpress: checked,
      },
    });
  },
});

export const configGuestButtonText = new ValidatedMethod({
  name: 'products.configGuestButtonText',
  validate: new SimpleSchema({
    productId: { type: String },
    guestButtonText: { type: String },
  }).validator(),
  run({ productId, guestButtonText }) {
    const product = Products.findOne(productId);
    checkOwnerAndSetup({ product, user: Meteor.user() });

    return Products.update(productId, {
      $set: {
        guestButtonText,
      },
    });
  },
});

export const configGuestMessageText = new ValidatedMethod({
  name: 'products.configGuestMessageText',
  validate: new SimpleSchema({
    productId: { type: String },
    guestMessageText: { type: String },
  }).validator(),
  run({ productId, guestMessageText }) {
    const product = Products.findOne(productId);
    checkOwnerAndSetup({ product, user: Meteor.user() });


    return Products.update(productId, {
      $set: {
        guestMessageText,
      },
    });
  },
});

export const toggleFooterBar = new ValidatedMethod({
  name: 'products.toggleFooterBar',
  validate: new SimpleSchema({
    productId: { type: String },
    state: { type: Boolean },
  }).validator(),
  run({ productId, state }) {
    const product = Products.findOne(productId);
    checkOwnerAndSetup({ product, user: Meteor.user() });


    return Products.update(productId, {
      $set: {
        isFooterBarEnabled: state,
      },
    });
  },
});

export const toggleFooterBarOnAllPages = new ValidatedMethod({
  name: 'products.toggleFooterBarOnAllPages',
  validate: new SimpleSchema({
    productId: { type: String },
    state: { type: Boolean },
  }).validator(),
  run({ productId, state }) {
    const product = Products.findOne(productId);
    checkOwnerAndSetup({ product, user: Meteor.user() });


    return Products.update(productId, {
      $set: {
        isFooterBarEnabledOnAllPages: state,
      },
    });
  },
});

export const configMailchimp = new ValidatedMethod({
  name: 'products.configMailchimp',
  validate({ productId, apiKey, listId }) {
    check(productId, String);
    check(apiKey, String);
    check(listId, String);
  },

  run({ productId, apiKey, listId }) {
    const product = Products.findOne(productId);
    checkOwnerAndSetup({ product, user: Meteor.user() });

    Products.update(productId, { $set: {
      mailchimpConfig: { apiKey, listId },
    } });

    if (apiKey && listId) {
      const userIds = ProductUsers.find({ productId }, { $fields: { userId: 1 } }).map(u => u.userId);

      const users = Meteor.users.find(
        { _id: { $in: userIds } },
        { $fields: { emails: 1, profile: 1 } }
      ).fetch();

      Meteor.defer(() => {
        try {
          MailchimpAdapter.batchSubscribe({ product, users });
        } catch (ex) {
          console.log(ex);
        }
      });
    }
  },
});

export const configStripe = new ValidatedMethod({
  name: 'products.configStripe',
  validate({ productId, secretKey, publishableKey }) {
    check(productId, String);
    check(secretKey, String);
    check(publishableKey, String);
  },

  run({ productId, secretKey, publishableKey }) {
    const product = Products.findOne(productId);
    checkOwnerAndSetup({ product, user: Meteor.user() });

    KeyValues.upsert({ key: 'stripePublishableKey' }, { $set: { value: publishableKey } });
    KeyValues.upsert({ key: 'stripeSecretKey' }, { $set: { value: secretKey } });
  },
});
