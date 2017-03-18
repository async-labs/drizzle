import React from 'react';
import { storiesOf } from '@kadira/storybook';
import centered from '@kadira/react-storybook-decorator-centered';

import WidgetProductBanner from './index';

storiesOf('WidgetProductBanner', module)
  .addDecorator(centered)
  .add('default', () => (
    <WidgetProductBanner />
  ));
