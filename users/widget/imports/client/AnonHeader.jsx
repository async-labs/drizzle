import React, { PropTypes } from 'react';
import { composeWithTracker } from 'react-komposer';

import { getCurrentProduct } from '/imports/products/client/api';
import { WidgetProductBanner } from '/imports/ui/components';

const styles = {
  divider: {
    marginTop: 0,
    marginBottom: 0,
  },
};

const AnonHeader = ({ image }) => (
  <div>
    <WidgetProductBanner imageSrc={image} />
    <hr style={styles.divider} />
  </div>
);

AnonHeader.propTypes = {
  image: PropTypes.string.isRequired,
};

function anonHeaderComposer(props, onData) {
  const product = getCurrentProduct();
  if (!product) { return; }

  onData(null, {
    image: product.widgetUIImage(),
  });
}


const Loading = () => (<div></div>);
export default composeWithTracker(anonHeaderComposer, Loading)(AnonHeader);
