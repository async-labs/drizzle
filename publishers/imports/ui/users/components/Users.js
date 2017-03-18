import React, { PropTypes, Component } from 'react';
import { Button } from '/imports/ui/components';

import Pagination from '../../common/pagination/components/Pagination.jsx';

import ProductUsersTable from './ProductUsersTable';
import ProductUsersFilterTabs from '../containers/ProductUsersFilterTabs';
import SendEmailFormModal from '../components/SendEmailFormModal';

import ProductUsersSearchForm from '../components/ProductUsersSearchForm';
import ProductUsersDateFilterInput from '../components/ProductUsersDateFilterInput';


const styles = {
  searchFormContainer: {
    padding: 0,
  },
  actionButtonsContainer: {
    padding: 0,
    textAlign: 'right',
  },
  usersTableContainer: {
    padding: 0,
  },
  dateFiltersContainer: {
    padding: 0,
  },
};

export default class Users extends Component {
  constructor(props) {
    super(props);
    this.state = {
      sendEmailUserId: '',
    };
  }

  sendEmailToUser(event) {
    this.setState({
      sendEmailUserId: event.currentTarget.dataset.id,
    });
  }

  sendEmailToUserList() {
    this.setState({
      sendEmailUserId: '',
    });
  }


  renderSendEmailToUsersModal() {
    const { product, handleSendEmailToUsers } = this.props;
    const isMailgunConfigured = !!(
      product.mailgunConfig &&
      product.mailgunConfig.apiKey &&
      product.mailgunConfig.domain &&
      product.mailgunConfig.fromName &&
      product.mailgunConfig.fromEmail
    );

    return (
      <div
        className="modal fade"
        id="sendEmailToUsersModal"
        tabIndex="-1"
        role="dialog"
      >
        <div className="modal-dialog" role="document">
          <SendEmailFormModal
            onSubmit={handleSendEmailToUsers}
            isMailgunConfigured={isMailgunConfigured}
          />
        </div>
      </div>
    );
  }

  render() {
    const {
      productUsers,
      product,
      totalCount,
      offset,
      limit,
      changeOffset,
      ready,
      handleSendEmailToUser,
      isCountersReady,
    } = this.props;

    return (
      <div className="tab-content package1">
        <h1 style={{ display: 'flex' }}>
          <span style={{ flex: 1 }}>
            Users
          </span>
        </h1>
        <hr />
        <div className="row" style={{ padding: 0 }}>
          <div className="col-sm-12" style={styles.dateFiltersContainer}>
            <div style={{ margin: 20 }}>
              <Pagination
                offset={offset}
                limit={limit}
                count={productUsers.length}
                changeOffset={changeOffset}
                totalCount={totalCount}
              />
            </div>
            <div className="form-group" style={{ display: 'inline-block' }}>
              <label htmlFor="fromDate" style={{ display: 'block', fontWeight: 700 }}>
                Start Date
              </label>
              <ProductUsersDateFilterInput
                queryParamName="fromDate"
                placeholder="Enter a date to filter"
              />
            </div>
            <div className="form-group" style={{ display: 'inline-block', marginLeft: 4 }}>
              <label htmlFor="toDate" style={{ display: 'block', fontWeight: 700 }}>
                End Date
              </label>
              <ProductUsersDateFilterInput
                placeholder="Enter a date to filter"
                queryParamName="toDate"
              />
            </div>
          </div>
          <div
            className="col-sm-12 col-md-6"
            style={styles.searchFormContainer}
          >
            <ProductUsersSearchForm
              style={{ marginBottom: 10 }}
            />
          </div>
          <div
            className="col-sm-12 col-md-6"
            style={styles.actionButtonsContainer}
          >
            <Button
              label="Send Group Email"
              btnSize={'small'}
              iconRight={<i className="fa fa-envelope" />}
              data-toggle="modal"
              data-target="#sendEmailToUsersModal"
              onClick={::this.sendEmailToUserList}
              style={{ marginRight: 10 }}
            />
          </div>
          <div className="col-sm-12" style={styles.usersTableContainer}>
            <ProductUsersFilterTabs />
            {!ready ? (
              <div className="cssload-container">
                <div className="cssload-loading"><i></i><i></i><i></i><i></i></div>
              </div>
            ) : (
              <div>
                <ProductUsersTable
                  product={product}
                  handleSendEmailToUser={handleSendEmailToUser}
                  productUsers={productUsers}
                />

              </div>
            )}
          </div>
        </div>
        {this.renderSendEmailToUsersModal()}
      </div>
    );
  }
}

Users.propTypes = {
  product: PropTypes.object.isRequired,
  productUsers: PropTypes.array.isRequired,
  offset: PropTypes.number.isRequired,
  limit: PropTypes.number.isRequired,
  changeOffset: PropTypes.func.isRequired,
  handleSendEmailToUsers: PropTypes.func.isRequired,
};
