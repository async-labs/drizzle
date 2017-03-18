import React from 'react';
import { composeWithTracker } from 'react-komposer';
import { toggleAutoDecryption, saveAutoDecryptionConfig } from '../actions';
import ToggleAutoDecryption from '../components/ToggleAutoDecryption';

function composer(props, onData) {
  const { wall } = props;

  onData(null, {
    toggled: wall.autoDecryption,
    cpm: wall.autoDecryptionConfig && wall.autoDecryptionConfig.cpm,
    viewCountLimit: wall.autoDecryptionConfig && wall.autoDecryptionConfig.viewCountLimit,
    helpElement: (
      <span>
        Learn more about our&nbsp;
        <a
          href="http://publishers.getdrizzle.com/article/24-i-m-not-sure-if-my-users-will-pay-for-my-content-how-can-i-find-out"
          target="blank"
        >
          automatic paywall removal
        </a>
      </span>
    ),
    onToggle: (toggled) => toggleAutoDecryption({
      wallId: wall._id,
      state: toggled,
    }),
    onSubmit: ({ cpm, viewCountLimit }) => {
      saveAutoDecryptionConfig({
        wallId: wall._id,
        cpm,
        viewCountLimit,
      });
    },
  });
}

export default composeWithTracker(composer)(ToggleAutoDecryption);
