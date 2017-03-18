import React from 'react';
import { storiesOf, action } from '@kadira/storybook';

import ApplePayButton from './index';

storiesOf('ApplePayButton', module)
  .add('default', () => (
    <ApplePayButton
      onClick={action('onClick')}
    />
  ))
  .add('disabled', () => (
    <ApplePayButton
      onClick={action('onClick')}
      disabled
    />
  ));
