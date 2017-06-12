import { _ } from 'meteor/underscore';
import { SyncedCron } from 'meteor/percolate:synced-cron';

import {
  KeyValues,
  SubscriberVisitedWalls,
  ContentWallCharges,
  ContentWalls,
 } from 'meteor/drizzle:models';

import { RelatedUrls } from '../collections';

function createRelatedUrls() {
  RelatedUrls.remove({});

  const config = KeyValues.findOne({ key: 'upsellingConfig' }) || {};

  const walls = ContentWalls.find(
    {
      disabled: false,
      $or: [
        { sellCount: { $gt: 4 } },
        { subscriberVisitedCount: { $gt: 4 } },
      ],
    },
    {
      sort: { createdAt: -1 },
      fields: { url: 1, createdAt: 1, title: 1, productId: 1, description: 1, thumbnailUrl: 1 },
    }
  ).fetch();

  for (let i = 0; i < walls.length - 1; i++) {
    for (let j = i + 1; j < walls.length; j++) {
      const first = walls[i];
      const second = walls[j];

      let firstUserIds = ContentWallCharges.find(
        { url: first.url }, { $fields: { userId: 1 } }).map((ch) => ch.userId);

      firstUserIds = firstUserIds.concat(SubscriberVisitedWalls.find(
        { wallId: first._id }, { $fields: { userId: 1 } }).map((ch) => ch.userId));

      let secondUserIds = ContentWallCharges.find(
        { url: second.url }, { $fields: { userId: 1 } }).map((ch) => ch.userId);

      secondUserIds = secondUserIds.concat(SubscriberVisitedWalls.find(
        { wallId: second._id }, { $fields: { userId: 1 } }).map((ch) => ch.userId));

      const userIds = _.uniq(_.intersection(firstUserIds, secondUserIds));
      if (userIds.length < (config.userCount || 5)) {
        continue;
      }

      RelatedUrls.insert({
        urlA: first.url, urlB: second.url,
        titleA: first.title, titleB: second.title,
        wallIdA: first._id, wallIdB: second._id,
        productIdA: first.productId, productIdB: second.productId,
        descriptionA: first.description, descriptionB: second.description,
        thumbnailUrlA: first.thumbnailUrl, thumbnailUrlB: second.thumbnailUrl,
        userCount: userIds.length,
      });
    }
  }
}

SyncedCron.add({
  name: 'Create related urls',
  schedule(parser) {
    // return parser.text('every 50 seconds');
    return parser.text('at 12:00 and 00:00');
  },
  job() {
    createRelatedUrls();
  },
});
