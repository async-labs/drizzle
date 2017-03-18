import React from 'react';
import { storiesOf } from '@kadira/storybook';
import centered from '@kadira/react-storybook-decorator-centered';

import PaywallUserView from './index';

storiesOf('PaywallUserView', module)
  .addDecorator(centered)
  .add('default', () => (
    <PaywallUserView />
  ));
