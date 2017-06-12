import { composeWithTracker } from 'react-komposer';
import { currentProduct } from '../../products/currentProduct';
import { configDiscount } from '../actions';
import PromoCodeToggle from '../components/PromoCodeToggle';


function composer(props, onData) {
  const product = currentProduct();

  if (!product) {
    return null;
  }

  return onData(null, {
    toggled: product.discountConfig && product.discountConfig.isEnabled,
    discountConfig: product.discountConfig,
    onToggle: (toggled) => configDiscount({
      productId: product._id,
      config: {
        isEnabled: toggled,
        activeDayCount: product.discountConfig && product.discountConfig.activeDayCount || 0,
        discountPercent: product.discountConfig && product.discountConfig.discountPercent || 0,
      },
    }),
    onSubmit: ({ activeDayCount, discountPercent }) => {
      configDiscount({
        productId: product._id,
        config: {
          isEnabled: product.discountConfig && product.discountConfig.isEnabled,
          activeDayCount: parseInt(activeDayCount, 10),
          discountPercent: parseInt(discountPercent, 10),
        },
      });
    },
  });
}

export default composeWithTracker(composer)(PromoCodeToggle);
