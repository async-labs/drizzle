import React, { PropTypes, Component } from 'react';

export default class Pagination extends Component {
  constructor(props) {
    super(props);

    this.prevPage = this.prevPage.bind(this);
    this.nextPage = this.nextPage.bind(this);
  }

  nextPage(event) {
    event.preventDefault();
    const { changeOffset, offset, limit } = this.props;
    changeOffset(offset + limit);
  }

  prevPage(event) {
    event.preventDefault();
    const { changeOffset, limit, offset } = this.props;
    changeOffset(offset - limit);
  }

  render() {
    const { offset, limit, count, totalCount } = this.props;

    const currentPage = Math.floor(offset / limit) + 1;
    let totalPage;
    if (totalCount) {
      totalPage = Math.floor((totalCount - 1) / limit) + 1;
    }

    let next = (
      <span>
        <i className="fa fa-arrow-right" aria-hidden="true"></i>
      </span>
    );

    if (count === limit && (!totalPage || totalPage > currentPage)) {
      next = (
        <a href="#" onClick={this.nextPage}>
          <i className="fa fa-arrow-right" aria-hidden="true"></i>
        </a>
      );
    }

    let prev = (
      <span>
        <i className="fa fa-arrow-left" aria-hidden="true"></i>
      </span>
    );

    if (offset > 0) {
      prev = (
        <a href="#" onClick={this.prevPage}>
          <i className="fa fa-arrow-left" aria-hidden="true"></i>
        </a>
      );
    }

    return (
      <div className="text-right">
        {prev} Page {currentPage} {totalPage ? `of ${totalPage} ` : null}{next}
      </div>
    );
  }
}

Pagination.propTypes = {
  offset: PropTypes.number.isRequired,
  changeOffset: PropTypes.func.isRequired,
  limit: PropTypes.number.isRequired,
  count: PropTypes.number.isRequired,
  totalCount: PropTypes.number,
};
