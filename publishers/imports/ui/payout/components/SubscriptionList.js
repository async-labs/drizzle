import React, { PropTypes, Component } from 'react';
import moment from 'moment';
import { Button } from '/imports/ui/components';

import Pagination from '../../common/pagination/components/Pagination.jsx';

export default class SubscriptionList extends Component {
  renderSubscriptionRow(ch) {
    const { refundSubscription } = this.props;

    const user = ch.user() || {};

    return (
      <tr key={ch._id}>
        <td>{user.firstName || user.name}</td>
        <td>{user.lastName}</td>
        <td>{user.email}</td>
        <td>${ch.amount / 100}</td>
        <td>{moment(ch.createdAt).format('D MMM YYYY hh:mm a')}</td>
        <td>
          <Button
            label="refund"
            btnSize={'small'}
            onClick={() => refundSubscription(ch._id)}
          />
        </td>
      </tr>
    );
  }

  render() {
    const { subscriptionCharges, limit, offset, changeOffset } = this.props;

    return (
      <div className="row">
        <div className="col-sx-12">
          <h3>Subscriptions</h3>
          <Pagination
            offset={offset}
            limit={limit}
            count={subscriptionCharges.length}
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
                <th></th>
              </tr>
            </thead>
            <tbody>
              {subscriptionCharges.map(ch => (
                this.renderSubscriptionRow(ch)
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
}

SubscriptionList.propTypes = {
  subscriptionCharges: PropTypes.array.isRequired,
  limit: PropTypes.number.isRequired,
  offset: PropTypes.number.isRequired,
  changeOffset: PropTypes.func.isRequired,
  refundSubscription: PropTypes.func.isRequired,
};
