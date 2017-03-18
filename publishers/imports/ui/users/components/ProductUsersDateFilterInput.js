import React, { Component, PropTypes } from 'react';
import { FlowRouter } from 'meteor/kadira:flow-router';
import moment from 'moment';
import { DatePickerInput } from '/imports/ui/components';

export const DATE_INPUT_FORMAT = 'MM/DD/YYYY';
export const DATE_PARAM_FORMAT = 'MM-DD-YYYY';

class ProductUsersDateFilterInput extends Component {
  constructor(props) {
    super(props);
    this.state = { date: undefined };
  }

  componentWillMount() {
    const { queryParamName } = this.props;
    const dateString = FlowRouter.getQueryParam(queryParamName);

    if (dateString) {
      this.setState({
        date: moment(dateString, DATE_PARAM_FORMAT),
      });
    }
  }

  handleChangeDate(date) {
    const { queryParamName } = this.props;

    this.setState({ date });

    FlowRouter.setQueryParams({
      [queryParamName]: date ? date.format(DATE_PARAM_FORMAT) : null,
      offset: 0,
    });
  }

  render() {
    return (
      <DatePickerInput
        name={this.props.queryParamName}
        dateFormat={DATE_INPUT_FORMAT}
        selected={this.state.date}
        onChange={::this.handleChangeDate}
        placeholderText={this.props.placeholder}
        isClearable
      />
    );
  }
}

ProductUsersDateFilterInput.propTypes = {
  /**
   * Name of the queryParam to bind the value of the date
   */
  queryParamName: PropTypes.string.isRequired,
  /**
   * Placeholder for when the input is empty
   */
  placeholder: PropTypes.string,
};

export default ProductUsersDateFilterInput;
