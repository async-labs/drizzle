import React, { PropTypes, Component } from 'react';
import { FlowRouter } from 'meteor/kadira:flow-router';
import { Button } from '/imports/ui/components';

const styles = {
  button: {
    marginTop: 10,
  },
};

class ReferralButton extends Component {
  render() {
    const {
      product,
      ...props
    } = this.props;

    const { referralConfig } = product;

    if (!referralConfig || !referralConfig.isEnabled ||
        !referralConfig.giveNumber || !referralConfig.condition) {
      return null;
    }

    let text;

    if (referralConfig.earnType === 'dollars') {
      text = `Earn $${referralConfig.earnNumber} by referring friend`;
    } else if (referralConfig.earnType === 'days') {
      const days = referralConfig.earnNumber > 1 ? 'days' : 'day';
      text = `Earn ${referralConfig.earnNumber} ${days} of free access by referring friend`;
    }

    if (!text) {
      return null;
    }

    return (
      <div style={{ textAlign: 'center' }}>
        <Button
          label={text}
          onClick={() => FlowRouter.go('/referral')}
          btnSize={'small'}
          fullWidth
          style={styles.button}
          {...props}
        />
      </div>
    );
  }
}

ReferralButton.propTypes = {
  product: PropTypes.object.isRequired,
};

export default ReferralButton;
