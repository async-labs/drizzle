import React, { PropTypes } from 'react';

const TableRow = ({ data, ...props }) => (
  <tr>
    {Object.keys(data).map(key => (
      <td {...props} key={key}> {data[key]} </td>
    ))}
  </tr>
);

TableRow.propTypes = {
  data: PropTypes.object.isRequired,
};

export default TableRow;
