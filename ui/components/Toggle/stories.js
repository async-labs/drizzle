import React from 'react';
import { storiesOf, action } from '@kadira/storybook';

import Toggle from './index';

storiesOf('Toggle', module)
  .add('default', () => (
    <Toggle
      onToggle={action('toggled')}
    />
  ))
  .add('default true', () => (
    <Toggle
      toggled
      onToggle={action('toggled')}
    />
  ))
  .add('with label left', () => (
    <Toggle
      labelLeft={"No"}
      onToggle={action('toggled')}
    />
  ))
  .add('with label right', () => (
    <Toggle
      labelRight={"Yes"}
      onToggle={action('toggled')}
    />
  ))
  .add('with both sides labels', () => (
    <Toggle
      labelLeft={"No"}
      labelRight={"Yes"}
      onToggle={action('toggled')}
    />
  ));
