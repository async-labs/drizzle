import './methods';
import './publications';

import {
  SubscriberVisitedWalls,
  ContentWalls,
} from 'meteor/drizzle:models';

export function subscriberVisitedWall({ userId, wall }) {
  if (SubscriberVisitedWalls.findOne({ userId, wallId: wall._id })) {
    SubscriberVisitedWalls.update(
      { userId, wallId: wall._id },
      {
        $set: { productId: wall.productId, lastVisitedAt: new Date() },
        $inc: { visitedCount: 1 },
      }
    );
  } else {
    ContentWalls.update(wall._id, { $inc: { subscriberVisitedCount: 1 } });

    SubscriberVisitedWalls.insert({
      userId,
      wallId: wall._id,
      productId: wall.productId,
      lastVisitedAt: new Date(),
      visitedCount: 1,
    });
  }
}
