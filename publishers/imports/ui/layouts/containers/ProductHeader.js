import React from 'react';
import {
  setDefaultLoadingComponent,
  composeWithTracker,
} from 'react-komposer';

const LoadingComponent = () => (
  <div className="cssload-container">
    <div className="cssload-loading"><i></i><i></i><i></i><i></i></div>
  </div>
);

setDefaultLoadingComponent(LoadingComponent);

import { currentProduct } from '../../products/currentProduct';

import ProductHeader from '../components/ProductHeader.jsx';

let product;
let isScriptInstalled;

function composer(props, onData) {
  const cProduct = currentProduct();
  if (!cProduct) {
    return;
  }

  if (!product || product._id !== cProduct._id ||
      product.claimStatus !== cProduct.claimStatus || !isScriptInstalled) {
    product = cProduct;

    isScriptInstalled = product.isScriptInstalled ? 'installed' : 'not-installed';
    onData(null, { product, isScriptInstalled });
  } else {
    onData(null, { product, isScriptInstalled });
  }
}

export default composeWithTracker(composer)(ProductHeader);
