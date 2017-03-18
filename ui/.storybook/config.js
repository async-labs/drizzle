/* eslint-disable global-require */

import { configure, setAddon } from '@kadira/storybook';
import infoAddon from '@kadira/react-storybook-addon-info';
setAddon(infoAddon);

require('bootstrap-loader');
require('font-awesome-webpack');
require('../stylesheet/main.scss');

configure(() => {
  require('../components/Input/stories');
  require('../components/Button/stories');
  require('../components/Select/stories');
  require('../components/MonthYearSelect/stories');
  require('../components/SubmitButton/stories');
  require('../components/ApplePayButton/stories');
  require('../components/PaywallPlaceholder/stories');
  require('../components/Toggle/stories');
  require('../components/CardForm/stories');
  require('../components/CardInfo/stories');
  require('../components/RegisterForm/stories');
  require('../components/LoginForm/stories');
  require('../components/RecoverPasswordForm/stories');
  require('../components/FacebookButton/stories');
  require('../components/PaywallUserView/stories');
  require('../components/PaywallCallToActionButton/stories');
  require('../components/PaywallLayout/stories');
  require('../components/ContentPlaceholder/stories');
  require('../components/FormFooterLinks/stories');
  require('../components/CreditCardIcon/stories');
  require('../components/Table/stories');
  require('../components/ProductUsersFilterTabs/stories');
  require('../components/DatePickerInput/stories');
  require('../components/ConfigurationToggle/stories');
  require('../components/ConfigurationInput/stories');
  require('../components/WidgetTabs/stories');
  require('../components/WidgetHeader/stories');
  require('../components/WidgetProductBanner/stories');
  require('../components/WidgetFooterBar/stories');
}, module);
