import React, { PropTypes, Component } from 'react';

import { error } from '../../notifier';

export default class Form extends Component {
  constructor(props) {
    super(props);

    this.save = this.save.bind(this);
    this.cancel = this.cancel.bind(this);
  }

  save() {
    const { save, product, category, done } = this.props;

    const name = this.refs.name.value.trim();

    if (!name) {
      error('Please input Name');
      return;
    }

    save({ productId: product._id, id: category && category._id, name }, (err) => {
      if (!err) {
        this.refs.name.value = '';

        if (done) { done(); }
      }
    });
  }

  cancel() {
    const { done } = this.props;
    if (done) { done(); }
  }

  render() {
    const { category } = this.props;

    return (
      <tr>
        <td>
          <input
            ref="name"
            type="text"
            placeholder="Name"
            defaultValue={category && category.name}
          />
        </td>
        <td>
          <button
            className="btn btn-primary"
            onClick={this.save}
          >
            save
          </button> {category ?
            <button
              className="btn-sm btn-warning"
              onClick={this.cancel}
            >
              cancel
            </button>
            : null}
        </td>
      </tr>
    );
  }
}

Form.propTypes = {
  product: PropTypes.object.isRequired,
  save: PropTypes.func.isRequired,
  done: PropTypes.func,
  category: PropTypes.object,
};
