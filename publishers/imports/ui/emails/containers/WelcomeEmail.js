import { composeWithTracker } from 'react-komposer';

import { currentProduct } from '../../products/currentProduct';
import WelcomeEmail from '../components/WelcomeEmail.jsx';
import { configWelcomeEmail } from '../actions';


function composer(props, onData) {
  const product = currentProduct();
  if (!product) { return; }

  const config = product.welcomeEmail || {};

  onData(null, { saveConfig: configWelcomeEmail, config, product });
}

export default composeWithTracker(composer)(WelcomeEmail);
