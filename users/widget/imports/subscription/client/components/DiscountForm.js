import React, { PropTypes, Component } from 'react';
import { Button, Input } from '/imports/ui/components';

const styles = {
  root: {
    marginBottom: '5px',
    padding: '5px',
    backgroundColor: 'rgba(240, 173, 78, 0.11)',
    display: 'flex',
    alignItems: 'center',
    fontSize: '13px',
  },
  verificationMessage: {
    flex: 1,
  },
};

class DiscountForm extends Component {
  renderDiscountNotice() {
    const { discountConfig } = this.props;

    return (
      <div style={styles.root}>
        <span style={styles.verificationMessage}>
          {discountConfig.discountPercent}% OFF of your first payment.
        </span>
      </div>
    );
  }

  render() {
    const { onSubmit, isAppliedDiscount, currentSubscription } = this.props;
    if (isAppliedDiscount) {
      return this.renderDiscountNotice();
    }

    if (currentSubscription) {
      return null;
    }

    return (
      <div style={{ marginBottom: '20px' }} >
        <p> Discount code: </p>
        <hr style={{ marginTop: 0 }} />
        <form onSubmit={onSubmit}>
          <Input
            name="discountCode"
          />

          <Button
            label="Submit"
            btnSize={'small'}
            style={{ float: 'right' }}
          />
        </form>
      </div>
    );
  }
}

DiscountForm.propTypes = {
  discountConfig: PropTypes.object.isRequired,
  currentSubscription: PropTypes.object,
  isAppliedDiscount: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired,
};

export default DiscountForm;
