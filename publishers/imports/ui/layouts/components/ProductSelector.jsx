import React, { PropTypes, Component } from 'react';

import { changeProduct } from '../../products/currentProduct';

export default class ProductSelector extends Component {
  constructor(props) {
    super(props);

    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    $('.selectpicker').selectpicker({});
  }

  onChange(event) {
    changeProduct({ id: event.target.value });
  }

  render() {
    const { products, currentProductId } = this.props;

    if (!products || products.length === 0) {
      return (
        <div></div>
      );
    }

    return (
      <div className="sidebar-select-site select-site">
        <div className="select-site-select">
          <select
            name="products"
            onChange={this.onChange}
            value={currentProductId}
            className="selectpicker"
            data-live-search="true"
          >
            {
              products.map((product) =>
                <option
                  value={product._id}
                  key={product._id}
                >
                  {product.url}
                </option>
              )
            }
          </select>
        </div>
      </div>
    );
  }
}


ProductSelector.propTypes = {
  products: PropTypes.array.isRequired,
  currentProductId: PropTypes.string.isRequired,
};
