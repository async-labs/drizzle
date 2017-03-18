import {
  saveCategory,
  removeCategory,
} from '/imports/api/contentWalls/methods';

import { error, success } from '../notifier';


export function save({ productId, id, name }, callback) {
  saveCategory.call({ productId, id, name }, (err) => {
    if (err) {
      error(err.reason || err);
    } else {
      success('Saved');
    }

    if (callback) {
      callback(err);
    }
  });
}

export function remove({ id }, callback) {
  removeCategory.call({ id }, (err) => {
    if (err) {
      error(err.reason || err);
    } else {
      success('Deleted');
    }

    if (callback) {
      callback(err);
    }
  });
}
