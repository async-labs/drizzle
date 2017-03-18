import React, { PropTypes } from 'react';
import moment from 'moment';

import Pagination from '/imports/client/components/Pagination.jsx';
import { Panel } from 'react-bootstrap';

export default React.createClass({
  propTypes: {
    charges: PropTypes.array.isRequired,
    offset: PropTypes.number.isRequired,
    limit: PropTypes.number.isRequired,
    domain: PropTypes.string.isRequired,
    previousPage: PropTypes.func.isRequired,
    nextPage: PropTypes.func.isRequired,
  },

  renderRow(charge) {
    const { domain } = this.props;
    let title = charge.title || charge.url.replace(domain, '');
    if (title.length > 38) {
      title = `${title.substr(0, 35)}...`;
    }

    return (
      <tr key={charge._id}>
        <td id="history">{moment(charge.createdAt).format('MM/DD/YY')}</td>
        <td id="history">${charge.amount / 100}</td>
        <td id="history">
          <a href={`http://${charge.url}`} target="_blank">
            {title}
          </a>
        </td>
      </tr>
    );
  },

  renderInvoices() {
    const { charges, offset, limit, nextPage, previousPage } = this.props;

    return (
      <div className="text-center center">
        <Pagination
          offset={offset}
          limit={limit}
          count={charges.length}
          onClickPrev={previousPage}
          onClickNext={nextPage}
        />
        <table id="history" className="card">
          <tbody>
            {charges.map((charge) => this.renderRow(charge))}
          </tbody>
        </table>
      </div>
    );
  },

  render() {
    const { charges } = this.props;
    const shouldRenderInvoices = charges.length > 0;

    const body = shouldRenderInvoices
    ? this.renderInvoices()
    : (<div> No Invoices found </div>);

    return (
      <div>
        {body}
      </div>
    );
  },
});
