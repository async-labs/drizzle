import React from 'react';
import { storiesOf } from '@kadira/storybook';
import centered from '@kadira/react-storybook-decorator-centered';

import PaywallVideoThumbnail from './index';

storiesOf('PaywallVideoThumbnail', module)
  .addDecorator(story => (
    <div style={{ width: 600 }}>
      {story()}
    </div>
  ))
  .addDecorator(centered)
  .add('default', () => (
    <PaywallVideoThumbnail />
  ));
