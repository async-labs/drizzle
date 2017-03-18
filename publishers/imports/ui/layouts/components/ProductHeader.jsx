import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

export default class ProductHeader extends Component {
  renderScriptStatus() {
    const { isScriptInstalled } = this.props;

    let color = 'red';
    let status = 'Not installed';
    let tooltip = 'Drizzle is not installed on your website';

    if (isScriptInstalled === 'installed') {
      color = 'green';
      tooltip = 'Drizzle is successfully installed';
      status = 'Installed';
    }


    return (
      <div className="tooltip-item">
        {status}
        <i className={classNames('fa fa-circle', color)}></i>
        <span className="tooltip-text">{tooltip}</span>
      </div>
    );
  }

  renderVerifyStatus() {
    const { product } = this.props;

    let color = 'red';
    let tooltip = 'Please verify your ownership';
    let status = 'Not verified';

    if (product.claimStatus === 'verified') {
      color = 'green';
      tooltip = 'Your ownership is verified';
      status = 'Verified';
    }

    return (
      <div className="tooltip-item">
        {status}
        <i className={classNames('fa fa-circle', color)}></i>
        <span className="tooltip-text">{tooltip}</span>
      </div>
    );
  }

  render() {
    const { product } = this.props;

    if (!product) {
      return <span></span>;
    }

    return (
      <div className="content-header" style={{ marginTop: '17px' }}>
        <div className="content-header-status tooltip-native clearfix">
          {this.renderScriptStatus()}
          {this.renderVerifyStatus()}
        </div>
      </div>
    );
  }
}

ProductHeader.propTypes = {
  product: PropTypes.object.isRequired,
  isScriptInstalled: PropTypes.string.isRequired,
};
