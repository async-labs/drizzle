import React, { PropTypes } from 'react';
import classnames from 'classnames';

import './style.scss';

const CreditCardIcon = ({ type, style }) => (
  <i
    className={classnames('drizzle-credit-card-icon', type)}
    style={style}
  />
);

CreditCardIcon.propTypes = {
  type: PropTypes.oneOf([
    'visa',
    'mastercard',
    'amex',
    'jcb',
    'discover',
    'dinersclub',
  ]).isRequired,
  style: PropTypes.object,
};

export default CreditCardIcon;
