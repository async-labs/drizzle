import React from 'react';
import { storiesOf, action } from '@kadira/storybook';
import centered from '@kadira/react-storybook-decorator-centered';

import ConfigurationToggle from './index';

storiesOf('ConfigurationToggle', module)
  .addDecorator(story => (
    <div style={{ width: 400 }}>
      {story()}
    </div>
  ))
  .addDecorator(centered)
  .add('default', () => (
    <ConfigurationToggle
      name="Metered Paywall"
      onToggle={() => action('Toggled!')}
    />
  ))
  .add('toggled with children', () => (
    <ConfigurationToggle
      name="Metered Paywall"
      toggled
      onToggle={() => action('Toggled!')}
    >
      I am the children!
    </ConfigurationToggle>
  ));
