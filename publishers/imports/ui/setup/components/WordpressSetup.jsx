import React, { Component, PropTypes } from 'react';

import { FlowRouter } from 'meteor/kadira:flow-router';

import CopyButton from '../../common/copyButton/components/CopyButton.jsx';

export default class WordpressSetup extends Component {
  constructor(props) {
    super(props);

    this.generateKey = this.generateKey.bind(this);
    this.deleteKey = this.deleteKey.bind(this);

    this.state = {
      buttonStyle: { border: '0px #888 solid' },
    };
  }

  componentDidUpdate(prevProps) {
    const { isGuiding, isKeyInstalled } = this.props;

    if (isGuiding && !prevProps.isGuiding && !this.intervalId) {
      this.intervalId = setInterval((comp) => {
        const { buttonStyle } = comp.state;
        const border = buttonStyle.border === '1px #888 solid' ? '0px #888 solid' : '1px #888 solid';
        comp.setState({ buttonStyle: { border } });
      }, 2500, this);
    }

    if (isKeyInstalled && prevProps.isGuiding) {
      if (this.intervalId) {
        clearInterval(this.intervalId);
        this.intervalId = undefined;
      }

      if (isGuiding) {
        FlowRouter.go('/wall-settings');
      }
    }
  }

  componentWillUnmount() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  }

  deleteKey(event) {
    event.preventDefault();
    if (!confirm('Are you sure?')) { // eslint-disable-line no-alert
      return;
    }

    const { product, deleteKey } = this.props;

    deleteKey(product._id);
  }

  generateKey(event) {
    event.preventDefault();

    const { product, generateKey } = this.props;

    generateKey(product._id);
  }

  renderGenerateButton() {
    const { buttonStyle } = this.state;

    return (
      <button
        type="button"
        className="btn btn-primary"
        onClick={this.generateKey}
        style={buttonStyle}
      >
        Generate API key
      </button>
    );
  }

  renderKeyButtons() {
    const { apiKey, isKeyInstalled } = this.props;
    const { buttonStyle } = this.state;

    return (
      <div>
        <div>
          <input
            type="text"
            name="key"
            value={apiKey}
            id="wpPlugin-apikey"
            style={{ width: '450px' }}
            readOnly
          />
          {isKeyInstalled ?
            <span style={{ color: 'green', marginLeft: '20px' }}>
              Connected! Success.
            </span> : null}
        </div>

        <div>
          <CopyButton target="#wpPlugin-apikey" text="Copy API key" style={buttonStyle} />

          <button
            type="button"
            className="btn btn-primary margin-20"
            onClick={this.generateKey}
          >
            Re-generate API key
          </button>

          <button
            type="button"
            className="btn-sm btn-danger margin-20"
            onClick={this.deleteKey}
          >
            Delete API key
          </button>
        </div>
      </div>
    );
  }

  render() {
    const { apiKey } = this.props;

    return (
      <div className="tab-content">
        <h2 className="col-xs-12 text-center pad20">Setup for <b>Wordpress or Drupal</b> website</h2>
        <div className="margin-b-20">
          <p>
            If you use <b>Wordpress</b>, install
            <a
              href="https://wordpress.org/plugins/simple-paywall-membership-micropayments-and-paid-subscriptions-by-drizzle/"
              target="_blank"
            > our official plugin
            </a>.
            If you use <b>Drupal</b>, install
            <a
              href="https://s3-us-west-1.amazonaws.com/zenmarket/drizzle-drupal7.zip"
              target="_blank"
            > our official module
            </a>.
          </p>
          <p>
            After plugin installation, generate an API key below by clicking
            "Generate API key" button.
          </p>
          <p>
            Then under your Wordpress Settings, click "Simple Paywall",
            and copy-paste your API key. Click "Save".
          </p>
          <p>
            For Drupal website, go to Administration>Drizzle>Drizzle Configuration Key. Copy-paste your API key. Click "Save".
          </p>

          {apiKey ? this.renderKeyButtons() : this.renderGenerateButton()}
        </div>
      </div>
    );
  }
}

WordpressSetup.propTypes = {
  product: PropTypes.object.isRequired,
  apiKey: PropTypes.string,
  isKeyInstalled: PropTypes.bool,
  deleteKey: PropTypes.func.isRequired,
  generateKey: PropTypes.func.isRequired,
  isGuiding: PropTypes.bool,
};
