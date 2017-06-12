import { error, success } from '../notifier';

import {
  toggleUpselling,
  configUpsellingItemCountToShow,
  configUpsellingPurchasedCount,
  configUpsellingUpvoteCount,
  configUpsellingUserCount,
} from '/imports/api/products/methods';

export function toggle({ productId, type, state }, callback) {
  toggleUpselling.call({ productId, type, state }, (err) => {
    if (err) {
      error(err);
    } else {
      success('Saved.');
    }

    if (callback) {
      callback(err);
    }
  });
}

export function saveItemCountToShow({ productId, count }, callback) {
  configUpsellingItemCountToShow.call({ productId, count }, err => {
    if (err) {
      error(err);
    } else {
      success('Saved.');
    }

    if (callback) {
      callback(err);
    }
  });
}

export function savePurchasedCount({ productId, count }, callback) {
  configUpsellingPurchasedCount.call({ productId, count }, err => {
    if (err) {
      error(err);
    } else {
      success('Saved.');
    }

    if (callback) {
      callback(err);
    }
  });
}

export function saveUpvoteCount({ productId, count }, callback) {
  configUpsellingUpvoteCount.call({ productId, count }, err => {
    if (err) {
      error(err);
    } else {
      success('Saved.');
    }

    if (callback) {
      callback(err);
    }
  });
}

export function saveUserCount({ productId, count }, callback) {
  configUpsellingUserCount.call({ productId, count }, err => {
    if (err) {
      error(err);
    } else {
      success('Saved.');
    }

    if (callback) {
      callback(err);
    }
  });
}
