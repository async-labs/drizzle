import React from 'react';
import { storiesOf } from '@kadira/storybook';
import centered from '@kadira/react-storybook-decorator-centered';

import CreditCardIcon from './index';

storiesOf('CreditCardIcon', module)
  .addDecorator(centered)
  .add('visa', () => (
    <CreditCardIcon type={'visa'} />
  ))
  .add('mastercard', () => (
    <CreditCardIcon type={'mastercard'} />
  ))
  .add('american-express', () => (
    <CreditCardIcon type={'amex'} />
  ))
  .add('jcb', () => (
    <CreditCardIcon type={'jcb'} />
  ))
  .add('discover', () => (
    <CreditCardIcon type={'discover'} />
  ))
  .add('dinners-club', () => (
    <CreditCardIcon type={'dinersclub'} />
  ))
  .add('cvc', () => (
    <CreditCardIcon type={'cvc'} />
  ));
