import React, { PropTypes, Component } from 'react';
import classNames from 'classnames';


export default class Walkthrough extends Component {
  constructor(props) {
    super(props);

    this.hide = this.hide.bind(this);

    this.state = {
      hide: props.hide,
    };
  }

  hide() {
    this.setState({ hide: true });
  }

  render() {
    const { text } = this.props;
    const { hide } = this.state;

    return (
      <div>
        <div className="steps tooltip-native tooltip-item">
          <span className="q"></span>
          <span className="tooltip-text">{text}</span>
        </div>
        <div
          className={classNames('overlay', { hide })}
          onClick={this.hide}
        >
        </div>
      </div>
    );
  }
}

Walkthrough.propTypes = {
  text: PropTypes.string.isRequired,
  hide: PropTypes.bool.isRequired,
};
