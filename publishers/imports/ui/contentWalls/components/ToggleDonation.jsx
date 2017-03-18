import React, { PropTypes, Component } from 'react';

import Toggle from 'react-toggle';

export default class ToggleDonation extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.saveConfig = this.saveConfig.bind(this);

    const { wall } = props;

    this.state = {
      enabled: !!wall.donationEnabled,
    };
  }

  toggle(event) {
    const donationEnabled = event.target.checked;
    this.setState({ enabled: donationEnabled });

    const { wall, configDonation } = this.props;
    configDonation({
      wallId: wall._id,
      donationEnabled,
      donationThankYouMessage: wall.donationThankYouMessage || '',
      donationMessage: wall.donationMessage || '',
    });
  }

  saveConfig(event) {
    event.preventDefault();
    const donationMessage = event.target.message.value;
    const donationThankYouMessage = event.target.thankYouMessage.value;

    const { wall, configDonation } = this.props;

    configDonation({
      wallId: wall._id,
      donationEnabled: wall.donationEnabled,
      donationMessage,
      donationThankYouMessage,
    });
  }

  render() {
    const { wall } = this.props;
    const { enabled } = this.state;

    if (!wall) {
      return <span></span>;
    }

    let form = null;
    if (enabled) {
      form = (
        <form onSubmit={this.saveConfig}>
          <table className="margin-auto">
            <tbody>
              <tr>
                <td>
                  Call To Action Text:
                </td>
                <td>
                  <input name="message" type="text" defaultValue={wall.donationMessage} />
                </td>
              </tr>
              <tr>
                <td>
                  Thank you message:
                </td>
                <td>
                  <input
                    name="thankYouMessage"
                    type="text"
                    defaultValue={wall.donationThankYouMessage}
                  />
                </td>
              </tr>
              <tr>
                <td></td>
                <td>
                  <button className="btn btn-primary" type="submit">Save</button>
                </td>
              </tr>
            </tbody>
          </table>
        </form>
      );
    }

    return (
      <div style={{ backgroundColor: '#f9f9f9' }}>
        <h3 className="text-center pad20">Donation</h3>
        <table className="margin-auto">
          <tbody>
            <tr>
              <td>No</td>
              <td className="text-center">
                <Toggle
                  defaultChecked={enabled}
                  onChange={this.toggle}
                />
              </td>
              <td>Yes</td>
            </tr>
          </tbody>
        </table>
        {form}
      </div>
    );
  }
}

ToggleDonation.propTypes = {
  wall: PropTypes.object.isRequired,
  configDonation: PropTypes.func.isRequired,
};
