import React from 'react';
import { storiesOf } from '@kadira/storybook';
import centered from '@kadira/react-storybook-decorator-centered';

import WidgetSubscriptionPlan from './index';

storiesOf('WidgetSubscriptionPlan', module)
  .addDecorator(story => (
    <div style={{ width: 360 }}>{story()}</div>
  ))
  .addDecorator(centered)
  .add('default', () => (
    <WidgetSubscriptionPlan
      name={'Monthly'}
      price={600}
    />
  ));
