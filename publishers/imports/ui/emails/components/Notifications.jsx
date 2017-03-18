import React, { PropTypes, Component } from 'react';

import Toggle from 'react-toggle';

import WelcomeEmail from '../containers/WelcomeEmail';
import MailgunConfig from '../../mailgun/containers/MailgunConfig';


export default class Notifications extends Component {
  constructor(props) {
    super(props);

    this.toggleConfig = this.toggleConfig.bind(this);
  }

  isChecked(name) {
    const { notifications } = this.props;

    return !!notifications[name];
  }

  toggleConfig(event) {
    const { toggleConfig } = this.props;

    const state = event.target.checked;
    const name = event.target.name;

    toggleConfig({ name, state });
  }

  render() {
    const { notifications } = this.props;

    if (!notifications) {
      return <span></span>;
    }

    return (
      <div className="tab-content package1">
        <WelcomeEmail />

        <h2 className="margin-b-20 text-center gray-title">
          Email notifications
        </h2>

        <table id="profile">
          <tbody>
            <tr>
              <td>Email me a daily summary with my website stats</td>
              <td className="text-center">
                <Toggle
                  id="daily_stat"
                  name="daily_stat"
                  defaultChecked={this.isChecked('daily_stat')}
                  onChange={this.toggleConfig}
                />
              </td>
            </tr>
            <tr>
              <td>Email me a weekly summary with my website stats</td>
              <td className="text-center">
                <Toggle
                  id="weekly_stat"
                  name="weekly_stat"
                  defaultChecked={this.isChecked('weekly_stat')}
                  onChange={this.toggleConfig}
                />
              </td>
            </tr>
          </tbody>
        </table>

        <MailgunConfig />
      </div>
    );
  }
}

Notifications.propTypes = {
  notifications: PropTypes.object.isRequired,
  toggleConfig: PropTypes.func.isRequired,
};
