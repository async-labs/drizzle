import { Vimeo } from 'vimeo';

import { Meteor } from 'meteor/meteor';
import { Random } from 'meteor/random';
import { check } from 'meteor/check';
import { checkOwnerAndSetup } from 'meteor/drizzle:check-functions';

import {
  Products,
} from 'meteor/drizzle:models';

Meteor.methods({
  'vimeo.getAuthorizationEndpoint'(productId) {
    check(productId, String);

    const product = Products.findOne(productId);
    checkOwnerAndSetup({ product, user: Meteor.user() });

    const lib = new Vimeo(
      Meteor.settings.Vimeo.clientId,
      Meteor.settings.Vimeo.clientSecret
    );

    const redirectUri = `${Meteor.absoluteUrl()}vimeo/connect`;
    const scopes = ['public', 'private', 'upload'];
    const state = `${productId}|${Random.id()}`;

    const url = lib.buildAuthorizationEndpoint(redirectUri, scopes, state);

    Products.update(productId, { $set: { vimeoAuthState: state } });

    return url;
  },

  'vimeo.getAccessToken'(params) {
    check(params, {
      state: String,
      code: String,
    });

    const { state, code } = params;

    const productId = state.split('|')[0];

    const product = Products.findOne(productId);
    checkOwnerAndSetup({ product, user: Meteor.user() });

    if (product.vimeoAuthState !== state) {
      throw new Meteor.Error('invalid-data', 'State is wrong');
    }

    const lib = new Vimeo(
      Meteor.settings.Vimeo.clientId,
      Meteor.settings.Vimeo.clientSecret
    );

    const redirectUri = `${Meteor.absoluteUrl()}vimeo/connect`;

    const syncAccessToken = Meteor.wrapAsync(lib.accessToken, lib);

    let token;
    try {
      token = syncAccessToken(code, redirectUri);
    } catch (err) {
      throw new Meteor.Error('invalid-data', err.message || err);
    }

    if (!token || !token.access_token) {
      throw new Meteor.Error('invalid-data', 'Have not received access token');
    }

    const scopes = token.scope;
    if (scopes.indexOf('upload') === -1) {
      throw new Meteor.Error('invalid-data', 'You must give us "upload" permission');
    }

    Products.update(productId, {
      $unset: { vimeoAuthState: 1 },
      $set: { vimeoToken: { isConnected: true, accessToken: token.access_token } },
    });
  },
});
