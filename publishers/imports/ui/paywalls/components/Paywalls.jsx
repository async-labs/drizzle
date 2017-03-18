import React, { Component, PropTypes } from 'react';

import { Button } from '/imports/ui/components';
import { FlowRouter } from 'meteor/kadira:flow-router';

import WallList from '../../contentWalls/containers/WallList';
import WallCategoriesModal from '../../wallCategories/containers/WallCategoriesModal';

export default class Paywalls extends Component {
  renderWallCategoriesModal() {
    const { product } = this.props;

    return (
      <div
        className="modal fade"
        id="wallCategoriesModal"
        tabIndex="-1"
        role="dialog"
      >
        <div className="modal-dialog" role="document">
          <WallCategoriesModal productId={product._id} />
        </div>
      </div>
    );
  }

  render() {
    const { product, counts, categoryId } = this.props;

    if (!product) {
      return <span></span>;
    }

    return (
      <div className="tab-content package1">
        <div>
          <h2 className="text-center margin-b-10 gray-title">Content</h2>
          {product.usingWordpress ?
            <p className="text-center">
              Add new content by adding [drizzle] content [/drizzle]
              shortcode on post edit page at Wordpress dashboard.
              <a
                href="http://publishers.getdrizzle.com/"
                target="_blank"
              >
                &nbsp;Instructions
              </a>.
            </p> : null}

          <h4>
            <table>
              <tbody>
                <tr>
                  <td>
                    Enabled: {counts.enabled}
                  </td>
                  <td>
                    Total: {counts.total}
                  </td>
                </tr>
              </tbody>
            </table>
          </h4>
        </div>

        <div className="text-right sidebar-add-site">
          {product.usingWordpress ?
            <p></p>
            : <Button
              label="Add new content"
              btnSize={'small'}
              iconRight={<i className="fa fa-plus-square" />}
              onClick={() => FlowRouter.go('/paywalls/add')}
            />
          }&nbsp;
          <button
            className="drizzle-button default small"
            href="#"
            data-toggle="modal"
            data-target="#wallCategoriesModal"
          >
            Categories
            <span className="icon-container right">
              <i className="icon fa fa-tags"></i>
            </span>
          </button>
        </div>

        <WallList totalCount={counts && counts.total} categoryId={categoryId} />

        {this.renderWallCategoriesModal()}
      </div>
    );
  }
}

Paywalls.propTypes = {
  product: PropTypes.object.isRequired,
  counts: PropTypes.object.isRequired,
  categoryId: PropTypes.string,
};
