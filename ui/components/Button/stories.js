import React from 'react';
import { storiesOf } from '@kadira/storybook';
import centered from '@kadira/react-storybook-decorator-centered';
import Button from './index';

storiesOf('Button', module)
  .addDecorator(centered)
  .add('default', () => (
    <Button />
  ))
  .add('with label', () => (
    <Button label="Read More" />
  ))
  .add('with label and disabled', () => (
    <Button label="Read More" disabled />
  ))
  .add('with btnStyle wargning and label', () => (
    <Button label="Read More" btnStyle={'warning'} />
  ))

  .add('with btnStyle wargning, label and disabled', () => (
    <Button label="Read More" btnStyle={'warning'} disabled />
  ))
  .add('with icon', () => (
    <Button
      iconRight={
        <img
          src="https://s3-us-west-1.amazonaws.com/zenmarket/droplet20px.png"
          alt="Drizzle Logo"
        />
      }
    />
  ))
  .add('width label and left icon (img drizzle icon)', () => (
    <Button
      label="Read More"
      iconLeft={
        <img
          src="https://s3-us-west-1.amazonaws.com/zenmarket/droplet20px.png"
          alt="Drizzle Logo"
        />
      }
    />
  ))
  .add('with label and right icon (img drizzle icon)', () => (
    <Button
      label="Read More"
      iconRight={
        <img
          src="https://s3-us-west-1.amazonaws.com/zenmarket/droplet20px.png"
          alt="Drizzle Logo"
        />
      }
    />
  ))
  .add('with label and right icon (img loading gif)', () => (
    <Button
      label="Read More"
      iconRight={
        <img
          src="https://s3-us-west-1.amazonaws.com/zenmarket/loading.gif"
          alt="Drizzle Logo"
        />
      }
    />
  ))
  .add('with label and right icon (font awesome)', () => (
    <Button
      label="I recommend"
      iconRight={
        <i className="fa fa-heart" />
      }
    />
  ));
