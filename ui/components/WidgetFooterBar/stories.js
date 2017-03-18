import React from 'react';
import { storiesOf } from '@kadira/storybook';

import WidgetFooterBar from './index';

storiesOf('WidgetFooterBar', module)
  .addDecorator(story => (
    <div style={{ width: '100%', position: 'absolute', bottom: 0 }}>
      {story()}
    </div>
  ))
  .add('default', () => (
    <WidgetFooterBar
      buttonLabel={'Join FTA+'}
      callToActionText={'Manage your subscription and payments.'}
    />
  ));
