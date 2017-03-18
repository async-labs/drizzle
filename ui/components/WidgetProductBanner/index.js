import React, { PropTypes } from 'react';

import './style.scss';

const WidgetProductBanner = ({ imageSrc }) => (
  <div className={'drizzle-product-banner'}>
    <img src={imageSrc} alt="Product Banner" />
  </div>
);

WidgetProductBanner.propTypes = {
  imageSrc: PropTypes.string,
};

WidgetProductBanner.defaultProps = {
  imageSrc: 'https://zenmarket.s3-us-west-1.amazonaws.com/widget-images/xWPM58b6wFaWYkRBm/custom-widget.png',
};

export default WidgetProductBanner;
