import { composeWithTracker } from 'react-komposer';
import { currentProduct } from '../../products/currentProduct';

import MeteredPaywallToggle from '../components/MeteredPaywallToggle';

import {
  configFreeArticleCount,
  disableFreeArticle,
} from '../actions';


function composer(props, onData) {
  const product = currentProduct();

  if (!product) {
    return null;
  }

  return onData(null, {
    toggled: !!product.freeArticleCount,
    value: product.freeArticleCount || 0,
    onToggle: (toggled) => {
      if (toggled) {
        return configFreeArticleCount({
          productId: product._id,
          count: 1,
        });
      }
      return disableFreeArticle({ productId: product._id });
    },
    onSubmit: (count) => configFreeArticleCount({
      productId: product._id,
      count: parseInt(count, 10),
    }),
  });
}

export default composeWithTracker(composer)(MeteredPaywallToggle);
