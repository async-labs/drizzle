import React from 'react';
import { storiesOf } from '@kadira/storybook';
import centered from '@kadira/react-storybook-decorator-centered';

import WidgetTabs from './index';

storiesOf('WidgetTabs', module)
  .addDecorator(story => (
    <div style={{ width: 360 }}>
      {story()}
    </div>
  ))
  .addDecorator(centered)
  .add('default', () => (
    <WidgetTabs
      tabs={[{
        path: '#',
        faIcon: 'fa-user',
        isActive: true,
        label: 'Users',
      }, {
        path: '#',
        faIcon: 'fa-money',
        label: 'Wallet',
      }]}
    />
  ));
