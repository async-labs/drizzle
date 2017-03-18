import React, { PropTypes } from 'react';
import TableRow from './TableRow';

const TableBody = ({ records }) => (
  <tbody>
    {records && records.map((record, index) => (
      <TableRow data={record} key={index} />
    ))}
  </tbody>
);

TableBody.propTypes = {
  records: PropTypes.arrayOf(PropTypes.object),
};

TableBody.defaultProps = {
  records: [],
};

export default TableBody;
