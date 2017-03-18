import { composeWithTracker } from 'react-komposer';

import { currentProduct } from '../../products/currentProduct';
import MailgunConfig from '../components/MailgunConfig.jsx';
import { configMailgun } from '../actions';


function composer(props, onData) {
  const product = currentProduct();
  if (!product) { return; }

  const configuration = product.mailgunConfig || {};

  onData(null, { configMailgun, configuration, product });
}

export default composeWithTracker(composer)(MailgunConfig);
