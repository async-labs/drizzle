import React from 'react';
import { storiesOf } from '@kadira/storybook';
import centered from '@kadira/react-storybook-decorator-centered';
import PaywallLayout from './index';

storiesOf('PaywallLayout', module)
  .addDecorator(story => (
    <div style={{ width: '690px' }}>
      {story()}
    </div>
  ))
  .addDecorator(centered)
  .add('default', () => (
    <PaywallLayout />
  ))
  .add('with 5 upvoteCount', () => (
    <PaywallLayout
      wall={{
        upvoteCount: 5,
      }}
    />
  ))
  .add('with enabled metered paywall', () => (
    <PaywallLayout
      isMeteredPaywall
    />
  ))
  .add('with enabled metered paywall and 5 remainingFreeCount', () => (
    <PaywallLayout
      isMeteredPaywall
      remainingFreeCount={5}
    />
  ))
  .add('with video', () => (
    <PaywallLayout
      wall={{
        isVideo: true,
      }}
    />
  ))
  .add('with video with thumbnail', () => (
    <PaywallLayout
      wall={{
        isVideo: true,
        content: {
          thumbnail: 'http://placehold.it/500x300',
        },
      }}
    />
  ));
