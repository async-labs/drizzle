import React from 'react';
import { storiesOf } from '@kadira/storybook';
import centered from '@kadira/react-storybook-decorator-centered';
import PaywallCallToActionButton from './index';

const minProps = {
  product: {
    paygEnabled: true,
  },
  wall: {
    donationEnabled: false,
    isVideo: false,
    price: 25,
    disableMicropayment: false,
  },
};

storiesOf('PaywallCallToActionButton', module)
  .addDecorator(centered)
  .add('default', () => (
    <PaywallCallToActionButton {...minProps} />
  ))
  .addWithInfo('with donation text',
  `
    The donation text requires:
    - wall with donationEnabled={true} and price.
    - product with paygEnabled={true}
  `,
  () => (
    <PaywallCallToActionButton
      {...minProps}
      wall={{
        donationEnabled: true,
        isVideo: false,
        price: 25,
        disableMicropayment: false,
      }}
    />
  ))
  .addWithInfo('with video text',
    `
      The video text requires:
      - wall with isVideo={true} and donationEnabled={false}
    `,
    () => (
      <PaywallCallToActionButton
        {...minProps}
        wall={{
          isVideo: true,
        }}
      />
    ));
