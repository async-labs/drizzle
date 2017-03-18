import { Meteor } from 'meteor/meteor';
import { Accounts } from 'meteor/accounts-base';
import { Random } from 'meteor/random';
import { HTTP } from 'meteor/http';
import { _ } from 'meteor/underscore';
import cheerio from 'cheerio';

import { getSlug } from 'meteor/ongoworks:speakingurl';

import { Products } from 'meteor/drizzle:models';

function vendorUser(params) {
  let { url } = params;
  const { user } = params;

  if (!url) {
    throw new Meteor.Error('invalid-data', 'URL is required');
  }

  if (!url.startsWith('http://') && !url.startsWith('https://')) {
    url = `http://${url}`;
  }

  const email = _.last(user.emails);
  if (!email || !email.address) {
    throw new Meteor.Error('invalid-data', 'Email is required');
  }

  const parse = Meteor.npmRequire('url').parse;

  const productDomain = parse(url).host;

  if (Products.findOne({ domain: productDomain })) {
    throw new Meteor.Error('invalid-data', 'This website has been already added.');
  } else {
    const data = {
      vendorUserId: user._id,
      claimStatus: 'pending',
      url,
      domain: productDomain,
      verifyKey: Random.secret(),
      createdAt: new Date,
    };

    try {
      const res = HTTP.get(url);
      if (res.statusCode !== 200) {
        throw new Meteor.Error('');
      }

      const $ = cheerio.load(res.content);

      data.description = $('meta[name=description]').attr('content');
      data.title = $('title').text() || productDomain;
    } catch (e) {
      // throw new Meteor.Error('wrong-url', `Error while trying access to "${url}"`);
    }

    if (!data.title) {
      data.title = productDomain;
    }

    let slug = getSlug(data.title);
    let count = 1;
    const originalSlug = slug;

    while (Products.find({ slug }).count() > 0) {
      count += 1;
      slug = `${originalSlug}-${count}`;
    }

    data.slug = slug;


    try {
      Products.insert(data);
    } catch (err) {
      if (err.code === 11000) {
        return console.log('Duplicated product not added.', data);
      }
      throw err;
    }
  }

  user.vendorStatus = true;

  user.notifications = {
    daily_stat: false,
    weekly_stat: false,
  };

  return user;
}

Accounts.onCreateUser((options, user) => {
  if (options.isAdmin) {
    return user;
  }

  const vendorFields = _.pick(options.profile || {}, 'vendorStatus', 'url');

  if (vendorFields.vendorStatus) {
    return vendorUser({ user, url: vendorFields.url });
  }

  throw new Meteor.Error('invalid-data', 'Invalid user');
});


Accounts.onLogin((info) => {
  const email = info.user && _.last(info.user.emails);
  if (email && email.verified) {
    return;
  }

  const verificationTokens = (info.user.services &&
    info.user.services.email && info.user.services.email.verificationTokens);

  const alreadySentEmail = _.some(verificationTokens, (token) => token.address === email.address);

  if (!alreadySentEmail) {
    Meteor.call('auth/sendEnrollmentEmail');
  }
});
