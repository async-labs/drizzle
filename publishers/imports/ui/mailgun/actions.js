import { error, success } from '../notifier';

import {
  configMailgun as configMailgunMethod,
} from '/imports/api/products/methods';

export function configMailgun(data, callback) {
  configMailgunMethod.call(data, (err) => {
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
