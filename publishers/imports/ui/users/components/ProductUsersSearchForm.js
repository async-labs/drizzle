import React, { PropTypes, Component } from 'react';
import { Input, SubmitButton } from '/imports/ui/components';
import { FlowRouter } from 'meteor/kadira:flow-router';

const styles = {
  form: {
    display: 'flex',
  },
  input: {
    flex: 1,
    marginRight: 10,
  },
};

class ProductUsersSearchForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      search: '',
    };
  }

  componentWillMount() {
    const search = FlowRouter.getQueryParam('search');
    this.setState({ search });
  }

  onSearchChange(event) {
    this.setState({ search: event.target.value });
  }

  handleSubmit(event) {
    event.preventDefault();
    const { search } = this.state;

    if (search) {
      FlowRouter.setQueryParams({ search });
    } else {
      FlowRouter.setQueryParams({ search: null });
    }

    FlowRouter.setQueryParams({ offset: 0 });
  }

  render() {
    const { onSubmit, placeholder, style } = this.props;

    return (
      <form
        onSubmit={onSubmit || ::this.handleSubmit}
        style={{
          ...styles.form,
          ...style,
        }}
      >
        <Input
          placeholder={placeholder}
          name="search"
          onChange={::this.onSearchChange}
          value={this.state.search}
          style={styles.input}
        />

        <SubmitButton
          label="Search"
          btnSize={'small'}
          btnStyle={'warning'}
        />
      </form>
    );
  }
}

ProductUsersSearchForm.propTypes = {
  style: PropTypes.object,
  onSubmit: PropTypes.func,
  placeholder: PropTypes.string,
};

ProductUsersSearchForm.defaultProps = {
  placeholder: 'Seach by name or email',
};

export default ProductUsersSearchForm;
