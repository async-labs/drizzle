import React, { PropTypes, Component } from 'react';

import Toggle from 'react-toggle';

export default class ToggleMicropayment extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
  }

  toggle(event) {
    const state = !event.target.checked;
    const { wall, toggleMicropayment } = this.props;

    toggleMicropayment({ wallId: wall._id, state });
  }

  render() {
    const { wall } = this.props;

    if (!wall) {
      return <span></span>;
    }

    return (
      <div style={{ backgroundColor: '#f9f9f9' }}>
        <h3 className="text-center pad20">Single Payment</h3>
        <p className="text-center">
          Learn more about our
          <a href="http://publishers.getdrizzle.com/" target="_blank"> single payment</a>.
        </p>
        <table className="margin-auto">
          <tbody>
            <tr>
              <td>No</td>
              <td className="text-center">
                <Toggle
                  defaultChecked={!wall.disableMicropayment}
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

ToggleMicropayment.propTypes = {
  wall: PropTypes.object.isRequired,
  toggleMicropayment: PropTypes.func.isRequired,
};
