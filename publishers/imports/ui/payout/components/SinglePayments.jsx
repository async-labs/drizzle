import React, { PropTypes, Component } from 'react';
import moment from 'moment';

import Pagination from '../../common/pagination/components/Pagination.jsx';

export default class SinglePayments extends Component {
  render() {
    const { wallCharges, limit, offset, changeOffset } = this.props;

    return (
      <div className="row">
        <div className="col-sx-12">
          <h3>Single payments</h3>
          <Pagination
            offset={offset}
            limit={limit}
            count={wallCharges.length}
            changeOffset={changeOffset}
          />
        </div>

        <div className="col-sx-12">
          <table className="table-responsive w90">
            <thead>
              <tr>
                <th>First Name</th>
                <th>Last Name</th>
                <th>Email</th>
                <th>Amount</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {wallCharges.map(ch => (
                <tr key={ch._id}>
                  <td>{ch.user().firstName || ch.user().name}</td>
                  <td>{ch.user().lastName}</td>
                  <td>{ch.user().email}</td>
                  <td>${ch.amount / 100}</td>
                  <td>{moment(ch.createdAt).format('D MMM YYYY hh:mm a')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

SinglePayments.propTypes = {
  wallCharges: PropTypes.array.isRequired,
  limit: PropTypes.number.isRequired,
  changeOffset: PropTypes.func.isRequired,
  offset: PropTypes.number.isRequired,
};
