import { readLater as readLaterMethod } from '../methods';

export function readLater(wallId, callback) {
  readLaterMethod.call({ wallId }, (err, result) => {
    if (callback) { callback(err, result); }
  });
}
