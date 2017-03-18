import React, { Component } from 'react';
const ControlledValue = InnerComponent => class extends Component {
  constructor(props) {
    super(props);

    this.state = {
      value: props.value,
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      value: nextProps.value,
    });
  }

  componentWillUpdate() {
    return true;
  }

  onChange(event) {
    this.setState({
      value: event.target.value,
    });
  }

  render() {
    return (
      <InnerComponent
        onChange={::this.onChange}
        {...this.props}
        {...this.state}
      />
    );
  }
};

export default ControlledValue;
