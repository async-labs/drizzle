import React from 'react';
import { storiesOf } from '@kadira/storybook';
import centered from '@kadira/react-storybook-decorator-centered';

import WidgetHeader from './index';

storiesOf('WidgetHeader', module)
  .addDecorator(story => (
    <div style={{ width: 359 }}>
      {story()}
    </div>
  ))
  .addDecorator(centered)
  .add('default', () => (
    <WidgetHeader />
  ));
