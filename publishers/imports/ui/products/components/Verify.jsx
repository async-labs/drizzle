import React, { PropTypes, Component } from 'react';

import CopyButton from '../../common/copyButton/components/CopyButton.jsx';
import Toggle from 'react-toggle';

export default class Verify extends Component {
  constructor(props) {
    super(props);

    this.toggleWordpressUsage = this.toggleWordpressUsage.bind(this);
    this.verify = this.verify.bind(this);

    this.state = {
      usingWordpress: true,
    };
  }

  toggleWordpressUsage(event) {
    const checked = event.target.checked;
    this.setState({ usingWordpress: checked });
  }

  verify(e) {
    e.preventDefault();

    const { product, verify } = this.props;

    return verify(product._id);
  }

  renderWordpress() {
    return (
      <p className="margin-b-20 pad-t-20">
        We will verify your ownership, once you add API key to your
        Wordpress dashboard at Settings > Simple paywall
      </p>
    );
  }

  renderTxtRecord() {
    const { product } = this.props;

    return (
      <div>
        <h3 className="margin-b-20">Verify instruction</h3>
        <p>Add the TXT record below to the DNS configuration for "{product.domain}".</p>

        <input
          type="text"
          name="key"
          value={`drizzle-verification=${product.verifyKey}`}
          id="product-verifykey"
          style={{ width: '450px' }} readOnly
        />
        <div className="text-center pad10">
          <CopyButton
            target="#product-verifykey"
            text="Copy"
          />

          <button
            type="button"
            className="btn btn-primary"
            onClick={this.verify}
          >
            Verify
          </button>
        </div>
      </div>
    );
  }

  render() {
    const { product } = this.props;
    const { usingWordpress } = this.state;

    if (!product) {
      return <span></span>;
    }

    if (product.claimStatus === 'verified') {
      return (
        <div className="tab-content package1">
          <h3 className="margin-b-20">Ownership verified.</h3>
        </div>
      );
    }

    return (
      <div className="tab-content package1">
        <div style={{ backgroundColor: '#f9f9f9' }}>
          <h3 className="text-center pad20">Are you using Wordpress for your website?</h3>
          <table className="margin-auto">
            <tbody>
              <tr>
                <td>No</td>
                <td className="text-center">
                  <Toggle
                    id="verify-usingWordpress-switch"
                    name="usingWordpress"
                    checked={usingWordpress}
                    onChange={this.toggleWordpressUsage}
                  />
                </td>
                <td>Yes</td>
              </tr>
            </tbody>
          </table>
        </div>

        {usingWordpress ? this.renderWordpress() : this.renderTxtRecord()}
      </div>
    );
  }
}

Verify.propTypes = {
  product: PropTypes.object.isRequired,
  verify: PropTypes.func.isRequired,
};
