import React, { PropTypes } from 'react';
import Button from '/imports/ui/components/Button';

import { FlowRouter } from 'meteor/kadira:flow-router';

export default React.createClass({
  propTypes: {
    isOwner: PropTypes.bool.isRequired,
    subscriptionEnabled: PropTypes.bool.isRequired,
    userSubscribed: PropTypes.bool.isRequired,

    isSubscribedFreeTrial: PropTypes.bool.isRequired,
    isFreeTrialEnabled: PropTypes.bool,
    isPaid: PropTypes.bool,
    freeTrialDayCount: PropTypes.number,
  },


  render() {
    const {
      subscriptionEnabled,
      userSubscribed,
      isOwner,
      freeTrialDayCount,
      isSubscribedFreeTrial,
      isFreeTrialEnabled,
      isPaid,
      ...props
    } = this.props;

    if (isOwner || !subscriptionEnabled || userSubscribed) {
      return null;
    }

    let text = 'Get unlimited access';
    const days = freeTrialDayCount > 1 ? 'days' : 'day';

    if (isFreeTrialEnabled && freeTrialDayCount && !isSubscribedFreeTrial && !isPaid) {
      text = `Get free access for ${freeTrialDayCount} ${days}`;
    }

    return (
      <Button
        label={text}
        onClick={() => FlowRouter.go('/')}
        btnSize={'small'}
        fullWidth
        {...props}
      / >
    );
  },
});
