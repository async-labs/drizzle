import React, { PropTypes, Component } from 'react';

export default class ConfigGuestButtonText extends Component {
  constructor(props) {
    super(props);

    this.saveConfig = this.saveConfig.bind(this);
  }

  saveConfig(event) {
    event.preventDefault();
    const guestButtonText = event.target.guestButtonText.value;
    const { wall, configGuestButtonText } = this.props;

    configGuestButtonText({ wallId: wall._id, guestButtonText });
  }

  render() {
    const { wall } = this.props;

    if (!wall) {
      return <span></span>;
    }

    return (
      <div style={{ backgroundColor: '#f9f9f9' }}>
        <h3 className="text-center pad20">Call-to-action text for guest users</h3>
        <form onSubmit={this.saveConfig}>
          <table className="margin-auto">
            <tbody>
              <tr>
                <td>
                  Text:
                </td>
                <td>
                  <input
                    name="guestButtonText"
                    type="text"
                    maxLength="25"
                    defaultValue={wall.guestButtonText || 'Read more'}
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
      </div>
    );
  }
}

ConfigGuestButtonText.propTypes = {
  wall: PropTypes.object.isRequired,
  configGuestButtonText: PropTypes.func.isRequired,
};
