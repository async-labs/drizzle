import React, { Component, PropTypes } from 'react';

/**
 * High Order Component that implements pagination behaviour.
 */
const Paginated = InnerComponent => class extends Component {
  constructor(props) {
    super(props);

    this.state = {
      offset: 0,
      limit: 5,
    };

    this.nextPage = this.nextPage.bind(this);
    this.previousPage = this.previousPage.bind(this);
  }

  nextPage(event) {
    event.preventDefault();
    const { offset, limit } = this.state;
    const nextOffset = offset + limit;

    this.setState({
      offset: nextOffset,
    });
  }

  previousPage(event) {
    event.preventDefault();
    const { offset, limit } = this.state;

    const nextOffset = offset < 0
    ? 0
    : offset - limit;

    this.setState({
      offset: nextOffset,
    });
  }

  render() {
    return (
      <InnerComponent
        nextPage={this.nextPage}
        previousPage={this.previousPage}
        {...this.state}
        {...this.props}
      />
    );
  }
};

Paginated.propTypes = {
  limit: PropTypes.number,
  offset: PropTypes.number,
};

export default Paginated;
