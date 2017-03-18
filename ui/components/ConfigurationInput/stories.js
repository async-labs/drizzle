import React from 'react';
import { storiesOf } from '@kadira/storybook';
import centered from '@kadira/react-storybook-decorator-centered';

import ConfigurationInput from './index';

storiesOf('ConfigurationInput', module)
  .addDecorator(story => (
    <div style={{ width: 400 }}>
      {story()}
    </div>
  ))
  .addDecorator(centered)
  .add('default', () => (
    <ConfigurationInput
      name={'Pricing'}

    />
  ));
