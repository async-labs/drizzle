import React, { PropTypes } from 'react';
import TableHead from './TableHead';
import TableBody from './TableBody';

import './style.scss';

const Table = ({ headers, records }) => (
  <table className={'drizzle-table'}>
    <TableHead headers={headers} />
    <TableBody records={records} />
  </table>
);

Table.propTypes = {
  headers: PropTypes.arrayOf(PropTypes.node),
  records: PropTypes.arrayOf(PropTypes.object),
};

export default Table;
