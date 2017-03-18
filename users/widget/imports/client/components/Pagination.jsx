import React, { PropTypes } from 'react';


export default React.createClass({
  propTypes: {
    count: PropTypes.number.isRequired,
    offset: PropTypes.number.isRequired,
    limit: PropTypes.number.isRequired,
    onClickPrev: PropTypes.func,
    onClickNext: PropTypes.func
  },

  render() {
    let { offset, limit, count, onClickNext, onClickPrev } = this.props;

    let prevComp;
    if (offset > 0) {
      if (onClickPrev) {
        prevComp = <a onClick={onClickPrev} href="#"><i className="fa fa-arrow-left" aria-hidden="true"></i></a>;
      } else {
        prevComp = <a href={`?offset=${offset - limit || 0}&limit=${limit}`}><i className="fa fa-arrow-left" aria-hidden="true"></i></a>;
      }
    } else {
      prevComp = <span><i className="fa fa-arrow-left" aria-hidden="true"></i></span>;
    }

    let nextComp;
    if (count >= limit) {
      if (onClickNext) {
        nextComp = <a onClick={onClickNext} href="#"><i className="fa fa-arrow-right" aria-hidden="true"></i></a>;
      } else {
        nextComp = <a href={`?offset=${offset + limit}&limit=${limit}`}><i className="fa fa-arrow-right" aria-hidden="true"></i></a>;
      }
    } else {
      nextComp = <span><i className="fa fa-arrow-right" aria-hidden="true"></i></span>;
    }

    const pageCount = Math.floor(offset / limit) + 1;

    return (
      <div className="pagination">{prevComp} Page {pageCount} {nextComp}</div>
    );
  }
});
