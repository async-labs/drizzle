import React, { PropTypes, Component } from 'react';

import Form from '../containers/Form';

export default class WallCategoriesModal extends Component {
  constructor(props) {
    super(props);

    this.edit = this.edit.bind(this);
    this.remove = this.remove.bind(this);

    this.state = {
      editingId: '',
    };
  }

  edit(event) {
    this.setState({ editingId: event.target.dataset.id });
  }

  remove(event) {
    if (!confirm('Are you sure?')) { // eslint-disable-line no-alert
      return;
    }

    const { remove } = this.props;
    remove({ id: event.target.dataset.id });
  }

  renderRow(category) {
    const { editingId } = this.state;

    const done = () => {
      this.setState({ editingId: '' });
    };

    if (editingId === category._id) {
      return <Form category={category} key={category._id} done={done} />;
    }

    return (
      <tr key={category._id}>
        <td>{category.name}</td>
        <td>
          <button
            data-id={category._id}
            onClick={this.edit}
            className="btn btn-primary"
          >
            edit
          </button> <button
            data-id={category._id}
            onClick={this.remove}
            className="btn-sm btn-danger"
          >
            delete
          </button>
        </td>
      </tr>
    );
  }

  render() {
    const { categories } = this.props;

    return (
      <div className="modal-content">
        <div className="modal-header">
          <button type="button" className="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
          <h4 className="modal-title">Content Categories</h4>
        </div>

        <div className="modal-body">
          <table className="margin-auto">
            <thead>
              <tr>
                <th>Name</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {categories.map((category) => this.renderRow(category))}

              <Form />
            </tbody>
          </table>
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-default"
            data-dismiss="modal"
          >Close</button>
        </div>
      </div>
    );
  }
}

WallCategoriesModal.propTypes = {
  product: PropTypes.object.isRequired,
  categories: PropTypes.array.isRequired,
  remove: PropTypes.func.isRequired,
};
