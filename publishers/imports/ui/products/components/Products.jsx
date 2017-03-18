import React, { Component, PropTypes } from 'react';
import { Meteor } from 'meteor/meteor';

import Toggle from 'react-toggle';

import Pagination from '../../common/pagination/components/Pagination.jsx';
import { changeProduct } from '../../products/currentProduct';


export default class Products extends Component {
  constructor(props) {
    super(props);

    this.toggleSetDefault = this.toggleSetDefault.bind(this);
  }

  componentDidMount() {
    $('[data-toggle="tooltip"]').tooltip(); // eslint-disable-line no-undef
  }

  getTitle(product) {
    let title = product.title || product.url;
    if (title.length > 60) {
      title = `${title.substr(0, 57)}...`;
    }
    return title;
  }

  toggleSetDefault(event) {
    Meteor.call('products.setDefault', event.target.id, event.target.checked);
    if (event.target.checked) {
      changeProduct({ id: event.target.id });
    }
  }

  renderRow(product) {
    return (
      <tr key={product._id}>
        <td>
          <a href={product.url} target="_blank">{this.getTitle(product)}</a>
        </td>
        <td>
          {product.isScriptInstalled ? (
            <div>
              <i className="fa fa-circle green m-r-5"></i>
              <span data-toggle="tooltip" data-title="Drizzle is successfully installed">
                Installed
              </span>
            </div>
            ) : (
            <div>
              <i className="fa fa-circle red m-r-5"></i>
              <span data-toggle="tooltip" data-title="Drizzle is not installed on your website">
                Not installed
              </span>
            </div>
            )}
        </td>
        <td>
          {product.claimStatus === 'verified' ? (
            <div>
              <i className="fa fa-circle green m-r-5"></i>
              <span data-toggle="tooltip" data-title="Your ownership is verified">
                Verified
              </span>
            </div>
            ) : (
            <div>
              <i className="fa fa-circle red m-r-5"></i>
              <span data-toggle="tooltip" data-title="Please verify your ownership">
                Not verified
              </span>
            </div>
            )}
        </td>
        <td>
          <Toggle
            id={product._id}
            checked={product.asDefault}
            onChange={this.toggleSetDefault}
          />
        </td>
      </tr>
    );
  }

  render() {
    const {
      products,
      totalCount,
      offset,
      limit,
      changeOffset,
    } = this.props;

    if (!products) {
      return <span></span>;
    }

    return (
      <div className="tab-content package1">
        <div className="row">
          <div className="col-xs-12 text-center gray-title">
            <h2>Websites</h2>
          </div>
        </div>

        <div className="text-right sidebar-add-site">
          <a className="btn btn-default" href="/websites/add">Add new website</a>
        </div>

        <Pagination
          offset={offset}
          limit={limit}
          count={products.length}
          changeOffset={changeOffset}
          totalCount={totalCount}
        />

        <div className="margin-b-20">
          <div className="table-responsive">
            <table className="w90">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Installed</th>
                  <th>Verified</th>
                  <th>Default</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => this.renderRow(product))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}

Products.propTypes = {
  products: PropTypes.array.isRequired,
  totalCount: PropTypes.number,
  offset: PropTypes.number.isRequired,
  limit: PropTypes.number.isRequired,
  changeOffset: PropTypes.func.isRequired,
};

/*
Products.contextTypes = {
  currentUser: React.PropTypes.object,
};
*/
