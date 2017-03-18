import React, { PropTypes, Component } from 'react';

import { error, success } from '../../../notifier';

export default class CopyButton extends Component {
  componentDidMount() {
    if (this.cp) {
      this.cp.destroy();
    }

    this.cp = new Clipboard(this.button); // eslint-disable-line no-undef
    this.cp.on('success', (e) => {
      success('Copied');
      e.clearSelection();
    });

    this.cp.on('error', () => {
      error('Did not copy. Please copy it by \'Ctrl/Cmd + C\'');
    });
  }

  componentWillUnmount() {
    if (this.cp) {
      this.cp.destroy();
    }
  }

  render() {
    const { target, text, style } = this.props;

    return (
      <button
        className="btn btn-primary"
        data-clipboard-action="copy"
        data-clipboard-target={target}
        style={style || {}}
        ref={node => {
          this.button = node;
        }}
      >
        {text || 'Copy'}
      </button>
    );
  }
}

CopyButton.propTypes = {
  target: PropTypes.string.isRequired,
  text: PropTypes.string,
  style: PropTypes.object,
};
