import React, { PropTypes } from 'react';

import {
  ConfigurationToggle,
  ConfigurationBox,
} from '/imports/ui/components';

import GuestButtonInput from '../containers/GuestButtonInput';
import GuestMessageInput from '../containers/GuestMessageInput';


const ToggleFooterBar = ({
  toggled,
  onToggle,
  enabledOnAllPages,
  onToggleEnableOnAllPages,
}) => (
  <ConfigurationToggle
    name={'Enable call to action footer bar'}
    toggled={toggled}
    onToggle={onToggle}
  >
    <ConfigurationBox
      title="Add link or button so your users can easily access
        Drizzle dashboard from anywhere on your website."
      collapsed
    >
      <p>
        Link:
        <pre>
          &lt;a href="#" onclick="_Drizzle.showWidget(); return false;"&gt;My Account&lt;/a&gt;
        </pre>
      </p>
      <p>
        Button:
        <pre>
          &lt;button onclick="_Drizzle.showWidget();"&gt;My Account&lt;/button&gt;
        </pre>
      </p>
    </ConfigurationBox>

    <ConfigurationToggle
      name="Enable bar on all pages"
      onToggle={onToggleEnableOnAllPages}
      toggled={enabledOnAllPages}
    />

    <GuestButtonInput />
    <GuestMessageInput />
  </ConfigurationToggle>
);

ToggleFooterBar.propTypes = {
  toggled: PropTypes.bool,
  onToggle: PropTypes.func.isRequired,
  enabledOnAllPages: PropTypes.bool,
  onToggleEnableOnAllPages: PropTypes.func.isRequired,
};

export default ToggleFooterBar;
