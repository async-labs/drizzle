import { composeWithTracker } from 'react-komposer';

import { sendVerifyEmail as sendVerifyEmailMethod } from '../actions';
import { error, success } from '/imports/notifier';

import VerifyEmail from '../components/VerifyEmail';

function composer(props, onData) {
  // const email = _.find(user.emails, (e) => e.verified) || _.last(user.emails);

  onData(null, {
    sendVerifyEmail: () => {
      sendVerifyEmailMethod((err) => {
        if (err) {
          error(err);
        } else {
          success('Email sent. Check your inbox!');
        }
      });
    },
  }
  );
}

export default composeWithTracker(composer)(VerifyEmail);
