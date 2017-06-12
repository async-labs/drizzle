import { Meteor } from 'meteor/meteor';
import { composeWithTracker } from 'react-komposer';

import { get } from '/imports/products/client/currentUrl';
import { getCurrentWall, getCurrentProduct } from '/imports/products/client/api';

import ReadLater from '../components/ReadLater.jsx';
import {
  ContentWalls,
  SavedWalls,
 } from 'meteor/drizzle:models';

function composer(props, onData) {
  const url = get();
  const product = getCurrentProduct();
  const wall = getCurrentWall();

  if (!url || !product || !wall) {
    return;
  }

  const offset = Number(props.offset) || 0;
  const limit = 10;

  const params = { offset, limit, productId: product._id };

  if (Meteor.subscribe('savedWalls.getByProduct', params).ready()) {
    const wallIds = SavedWalls.find(
      { productId: product._id, userId: Meteor.userId() },
      { limit, sort: { createdAt: -1 } }
    ).map(s => s.wallId);

    const walls = ContentWalls.find(
      { _id: { $in: wallIds } },
      { limit, sort: { createdAt: -1 } }
    ).fetch();

    onData(null, { walls, offset, limit });
  }
}

export default composeWithTracker(composer)(ReadLater);
