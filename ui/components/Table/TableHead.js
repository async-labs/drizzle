import React, { PropTypes } from 'react';


const TableHead = ({ headers }) => (
  <thead>
    <tr>
      {headers.map((header, index) => (
        <td key={index}> {header} </td>
      ))}
    </tr>
  </thead>
);

TableHead.propTypes = {
  headers: PropTypes.arrayOf(PropTypes.node),
};

TableHead.defaultProps = {
  headers: [],
};

export default TableHead;
