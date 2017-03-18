import React from 'react';
import { storiesOf } from '@kadira/storybook';

import PaywallHeader from './index';
import centered from '@kadira/react-storybook-decorator-centered';

class Wrapper extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      enabled: false,
    };

    this.toggleEnablePaywall = this.toggleEnablePaywall.bind(this);
  }

  toggleEnablePaywall() {
    this.setState({ enabled: !this.state.enabled });
  }

  render() {
    return (
      <PaywallHeader
        enabled={this.state.enabled}
        onEnableToggle={this.toggleEnablePaywall}
        {...this.props}
      />
    );
  }
 }


storiesOf('PaywallHeader', module)
  .addDecorator(centered)
  .add('default', () => {
    return (
      <Wrapper
        title={'5 Factors that Affect the Economic Growth of a Country'}
        url={'www.economicsdiscussion.net/economic-growth/5-factors-that-affect-the-economic-growth-of-a-country/4199/'}
      />
    );
  });
