import { Meteor } from 'meteor/meteor';

import { FlowRouter } from 'meteor/kadira:flow-router';
import { Slingshot } from 'meteor/edgee:slingshot';

import { error, success } from '../notifier';

const handleCallback = (err ) => {
  if (err) {
    return error(err.reason || err);
  }

  success('Saved!');
};

import {
  changeCategory as changeCategoryMethod,
  toggleMicropayment as toggleMicropaymentMethod,
  configExpiration as configExpirationMethod,
  configDonation as configDonationMethod,
  configGuestButtonText as configGuestButtonTextMethod,
  toggleUpselling as toggleUpsellingMethod,
} from '/imports/api/contentWalls/methods';

export const toggleMicropayment = ({ wallId, state }) =>
  toggleMicropaymentMethod.call({ wallId, state }, handleCallback);

export const toggleUpselling = ({ wallId, isHidden }) =>
  toggleUpsellingMethod.call({ wallId, isHidden }, handleCallback);

export const toggleAutoDecryption = ({ wallId, state }) =>
  Meteor.call('contentWall/toggleAutoDecryption', wallId, state, handleCallback);

export const toggleViewportConfig = ({ wallId, state, width }) =>
  Meteor.call('contentWall/toggleViewportConfig', wallId, state, width, handleCallback);


export function addWall({ productId, url }, callback) {
  Meteor.call('contentWall/addUrl', productId, url, (err, wallId) => {
    if (err) {
      error(err.reason || err);
    } else {
      success('Saved');
      FlowRouter.go(`/paywalls/manage/${wallId}`);
    }

    if (callback) {
      callback(err, wallId);
    }
  });
}

export function toggleDisabled({ id, state }, callback) {
  Meteor.call('contentWall/toggleDisabled', id, state, (err) => {
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


export function toggleFixedPricing({ id, state }, callback) {
  Meteor.call('contentWall/toggleFixedPricing', id, state, (err) => {
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

export function toggleVideo({ id, state }, callback) {
  Meteor.call('contentWall/toggleVideo', id, state, (err) => {
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

export function saveImage({ id, file }, callback) {
  const uploader = new Slingshot.Upload('uploadContentWallThumbnail');
  uploader.send(file, (err, downloadUrl) => {
    if (err) {
      error(err);
      console.error(err); // eslint-disable-line no-console
      if (uploader.xhr && uploader.xhr.response) {
        console.error('Error uploading', uploader.xhr.response); // eslint-disable-line no-console
      }

      return;
    }

    Meteor.call('contentWall/saveWallThumbnail', id, downloadUrl, (err2) => {
      if (err2) {
        error(err2.reason || err2);
      } else {
        success('Saved');
      }

      if (callback) {
        callback(err2);
      }
    });
  });
}

export function saveContent({ id, content }, callback) {
  Meteor.call('contentWall/saveWallContent', id, content, (err) => {
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

// TODO: Validations must be on server side too
export function saveAutoDecryptionConfig({ wallId, cpm, viewCountLimit }) {
  if (!cpm) {
    error('Select CPM');
    return;
  }

  if (cpm < 1 || cpm > 5) {
    error('CPM must be between 1 and 5 dollars');
    return;
  }

  if (!viewCountLimit) {
    error('Select number of impressions for experiment');
    return;
  }

  if (viewCountLimit < 1000 || viewCountLimit > 10000) {
    error('Number of impressions for experiment must be between 1000 and 10000');
    return;
  }

  Meteor.call(
    'contentWall/saveAutoDecryptionConfig',
    wallId,
    { cpm, viewCountLimit },
    handleCallback
  );
}

export function saveFixedPrice({ id, price }, callback) {
  if (!price) {
    error('Enter price');
    return;
  }

  if (price < 25 || price > 1000) {
    error('Price must be between $0.25 and $10.00');
    return;
  }

  Meteor.call('contentWall/saveFixedPrice', id, price, (err) => {
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

export function configExpiration({ wallId, numberOfdays, expirationEnabled }, callback) {
  configExpirationMethod.call({ wallId, numberOfdays, expirationEnabled }, (err) => {
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

export function configGuestButtonText({ wallId, guestButtonText }, callback) {
  if (guestButtonText && guestButtonText.length > 25) {
    error('Text can not be longer than 25 characters');
    return;
  }

  configGuestButtonTextMethod.call({ wallId, guestButtonText }, (err) => {
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

export function configDonation(
  { wallId, donationEnabled, donationMessage, donationThankYouMessage },
  callback
) {
  configDonationMethod.call(
    { wallId, donationEnabled, donationThankYouMessage, donationMessage },
    (err) => {
      if (err) {
        error(err.reason || err);
      } else {
        success('Saved');
      }

      if (callback) {
        callback(err);
      }
    }
  );
}

export function changeCategory({ wallId, categoryIds }, callback) {
  changeCategoryMethod.call({ wallId, categoryIds }, (err) => {
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
