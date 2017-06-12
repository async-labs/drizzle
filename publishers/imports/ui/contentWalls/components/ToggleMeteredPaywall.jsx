import React, { PropTypes, Component } from 'react';

import Toggle from 'react-toggle';

export default class ToggleMeteredPaywall extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
  }

  toggle(event) {
    const state = !event.target.checked;
    const { wall, toggleMeteredPaywall } = this.props;

    toggleMeteredPaywall({ wallId: wall._id, state });
  }

  render() {
    const { wall } = this.props;

    if (!wall) {
      return <span></span>;
    }

    return (
      <div style={{ backgroundColor: '#f9f9f9' }}>
        <h3 className="text-center pad20">Metered Paywall</h3>
        <p className="text-center">
          Enable/disable "free unlocks" for this paywall.
        </p>
        <table className="margin-auto">
          <tbody>
            <tr>
              <td>No</td>
              <td className="text-center">
                <Toggle
                  defaultChecked={!wall.disableMeteredPaywall}
                  onChange={this.toggle}
                />
              </td>
              <td>Yes</td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}

ToggleMeteredPaywall.propTypes = {
  wall: PropTypes.object.isRequired,
  toggleMeteredPaywall: PropTypes.func.isRequired,
};
