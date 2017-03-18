import React from 'react';
import { storiesOf } from '@kadira/storybook';
import centered from '@kadira/react-storybook-decorator-centered';
import PaywallPlaceholder from './index';

storiesOf('PaywallPlaceholder', module)
  .addDecorator(centered)
  .add('default', () => (
    <div style={{ width: '400px' }}>
      <PaywallPlaceholder />
    </div>
  ));
