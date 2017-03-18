import React, { Component, PropTypes } from 'react';
import ReactToggle from 'react-toggle';

import 'react-toggle/style.css';

const styles = {
  root: {
    display: 'inline-block',
  },
  toggleContainer: {
    padding: '0px 10px',
    textAlign: 'center',
    display: 'inline-block',
    height: 24,
  },
  label: {
    fontWeight: 'normal',
    fontSize: '1.1em',
  },
};

class Toggle extends Component {
  constructor(props) {
    super(props);
    this.handleToggle = this.handleToggle.bind(this);
  }

  handleToggle(event) {
    const { onToggle } = this.props;
    const checked = event.target.checked;

    onToggle(checked);
  }

  render() {
    const {
      labelLeft,
      labelRight,
      toggled,
      style,
      labelLeftStyle,
      labelRightStyle,
      ...props,
    } = this.props;

    return (
      <div
        style={{
          ...styles.root,
          ...style,
        }}
      >
        <label
          style={{
            ...styles.label,
            ...labelLeftStyle,
          }}
        >
          {labelLeft}
        </label>
        <div style={styles.toggleContainer}>
          <ReactToggle
            defaultChecked={toggled}
            onChange={this.handleToggle}
            icons={{
              unchecked: null,
            }}
            {...props}
          />
        </div>
        <label
          style={{
            ...styles.label,
            ...labelRightStyle,
          }}
        >
          {labelRight}
        </label>
      </div>
    );
  }
}

Toggle.defaultProps = {
  toggled: false,
};

Toggle.propTypes = {
  labelLeft: PropTypes.string,
  labelRight: PropTypes.string,
  toggled: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  style: PropTypes.object,
  labelLeftStyle: PropTypes.object,
  labelRightStyle: PropTypes.object,
};

export default Toggle;
