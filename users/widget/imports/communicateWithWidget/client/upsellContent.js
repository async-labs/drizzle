import ReactDOMServer from 'react-dom/server';
import React from 'react';

import { Meteor } from 'meteor/meteor';
import { Tracker } from 'meteor/tracker';
import { _ } from 'meteor/underscore';

import { get as getCurrentUrl } from '/imports/products/client/currentUrl';
import { getCurrentWall, getCurrentProduct } from '/imports/products/client/api';
import { ContentWalls } from 'meteor/drizzle:models';
import { RelatedUrls } from '/imports/recommendation/collections';

import sendCommand from './sendCommand';
import UpsellContent from './components/UpsellContent.jsx';

function subscriptions({ product, wall }) {
  const config = product.upsellingConfig || {};

  const subs = [];

  if (config.popular) {
    subs.push(Meteor.subscribe('recommendation/topUrls', {
      productId: product._id,
      all: false,
      limit: config.itemCountToShow || 5,
      wallId: wall._id,
    }).ready());
  }

  if (config.related) {
    subs.push(Meteor.subscribe('recommendation/relatedUrls', {
      all: false,
      offset: 0,
      limit: config.itemCountToShow || 5,
      productId: product._id,
      wallId: wall._id,
    }).ready());
  }

  if (config.trending) {
    subs.push(Meteor.subscribe('recommendation/trending', {
      all: false,
      limit: config.itemCountToShow || 5,
      productId: product._id,
      wallId: wall._id,
    }).ready());
  }

  if (config.newest) {
    subs.push(Meteor.subscribe('recommendation/newest', {
      all: false,
      limit: config.itemCountToShow || 5,
      productId: product._id,
      wallId: wall._id,
    }).ready());
  }

  return _.every(subs);
}

function getPopularWalls({ wall, product }) {
  const { upsellingConfig = {} } = product;

  const filter = {
    _id: { $ne: wall._id },
    productId: product._id,
    disabled: false,
    sellCount: { $gte: upsellingConfig.purchasedCount || 0 },
    upvoteCount: { $gte: upsellingConfig.upvoteCount || 0 },
  };

  const options = {
    limit: upsellingConfig.itemCountToShow || 5,
    sort: { popularity: -1 },
  };

  return ContentWalls.find(filter, options).fetch();
}

function getTrendingWalls({ wall, product }) {
  const { upsellingConfig = {} } = product;

  const filter = {
    _id: { $ne: wall._id },
    productId: product._id,
    disabled: false,
    sellCount: { $gte: upsellingConfig.purchasedCount || 0 },
    upvoteCount: { $gte: upsellingConfig.upvoteCount || 0 },
  };

  const options = {
    limit: upsellingConfig.itemCountToShow || 5,
    sort: { score: -1 },
  };

  return ContentWalls.find(filter, options).fetch();
}

function getNewestUrls({ wall, product }) {
  const { upsellingConfig = {} } = product;

  const filter = {
    _id: { $ne: wall._id },
    productId: product._id,
    disabled: false,
  };

  const options = {
    limit: upsellingConfig.itemCountToShow || 5,
    sort: { createdAt: -1 },
  };

  return ContentWalls.find(filter, options).fetch();
}

function getRelatedUrls({ wall, product }) {
  const { upsellingConfig = {} } = product;

  const filter = {
    $and: [
      { $or: [{ wallIdA: wall._id }, { wallIdB: wall._id }] },
      { $or: [{ productIdB: wall.productId }, { productIdA: wall.productId }] },
    ],
    userCount: { $gte: upsellingConfig.userCount || 5 },
  };

  const options = {
    limit: upsellingConfig.itemCountToShow || 5,
    sort: { userCount: -1 },
  };

  return RelatedUrls.find(
    filter,
    options,
  ).fetch();
}

export function renderUpsellContent() {
  Tracker.autorun(() => {
    const url = getCurrentUrl();
    const product = getCurrentProduct();
    const wall = getCurrentWall();

    if (!url || !wall || !product) {
      return;
    }

    if (wall.hideUpsellingList) {
      return;
    }

    if (!subscriptions({ product, wall })) {
      return;
    }

    const props = { wall };

    const config = product.upsellingConfig || {};
    if (config.popular) {
      props.popularWalls = getPopularWalls({ product, wall });
    }

    if (config.trending) {
      props.trendingWalls = getTrendingWalls({ product, wall });
    }

    if (config.related) {
      props.relatedUrls = getRelatedUrls({ wall, product });
    }

    if (config.newest) {
      props.newestWalls = getNewestUrls({ wall, product });
    }

    const html = ReactDOMServer.renderToStaticMarkup(<UpsellContent {...props} />);
    sendCommand({ name: 'renderUpsellContent', url, data: { html } });
  });
}
