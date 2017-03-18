import React, { PropTypes } from 'react';
import Button from '../Button';

const styles = {
  root: {
    display: 'flex',
    padding: '3px 0px',
    alignItems: 'center',
    backgroundColor: 'rgb(247, 247, 247)',
    borderLeft: '5px solid #1088cc',
    borderRadius: '5px',
    paddingLeft: '5px',
  },
  name: {
    flex: 1,
  },
};

export const formatPrice = price => `${(price / 100).toFixed(2)}`;

const WidgetSubscriptionPlan = ({ name, price, onSubscribeButtonClick }) => (
  <div style={styles.root}>
    <span style={styles.name}>
      {price ? `${formatPrice(price)} / ${name}` : name}
    </span>
    &nbsp;
    <Button
      label={'Subscribe'}
      btnSize={'small'}
      onClick={onSubscribeButtonClick}
    />
  </div>
);

WidgetSubscriptionPlan.propTypes = {
  name: PropTypes.string.isRequired,
  price: PropTypes.number,
  onSubscribeButtonClick: PropTypes.func.isRequired,
};

export default WidgetSubscriptionPlan;
