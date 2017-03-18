import { Meteor } from 'meteor/meteor';

import { Slingshot } from 'meteor/edgee:slingshot';

import { error, success } from '/imports/ui/notifier';


export function saveImage({ file }, cb) {
  const URL = window.URL || window.webkitURL;
  const img = new Image();

  img.onload = function onload() {
    const { width, height } = this;

    if (width !== 300 || height !== 120) {
      return error('Please use a logo that is 300x120 pixels.');
    }

    const uploader = new Slingshot.Upload('uploadWidgetUIImage', { width, height });
    uploader.send(file, (err, downloadUrl) => {
      if (err) {
        console.error(err); // eslint-disable-line no-console
        if (uploader.xhr && uploader.xhr.response) {
          console.error('Error uploading', uploader.xhr.response); // eslint-disable-line no-console
        }
      }

      return cb(err, downloadUrl);
    });

    return true;
  };

  img.src = URL.createObjectURL(file);
}

export function saveConfig({ productId, data }) {
  Meteor.call('products/configWidgetUI', productId, data, (err) => {
    if (err) {
      error(err.reason);
    } else {
      success('Success! Saved.');
    }
  });
}
