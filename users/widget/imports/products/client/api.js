import { parse } from 'url';

import {
  Products,
  ContentWalls,
 } from 'meteor/drizzle:models';

import { getPath } from '/imports/products';
import { get } from './currentUrl';

export function getCurrentProduct() {
  const url = get();
  if (!url) { return null; }

  const domain = parse(url).host;
  return Products.findOne({ domain, vendorUserId: { $exists: true } });
}

export function getCurrentWall() {
  const url = get();
  if (!url) { return null; }

  const path = getPath(url);
  const fullUrl = `${parse(url).host}${path}`;
  return ContentWalls.findOne({ url: fullUrl });
}
