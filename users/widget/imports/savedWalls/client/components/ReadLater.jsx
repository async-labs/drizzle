import React, { PropTypes } from 'react';
import Pagination from '/imports/client/components/Pagination.jsx';

export default React.createClass({
  propTypes: {
    walls: PropTypes.array.isRequired,
    offset: PropTypes.number.isRequired,
    limit: PropTypes.number.isRequired,
  },

  renderRow(wall) {
    let text = wall.title || wall.url;
    if (text.length > 40) {
      text = `${text.substr(0, 37)}...`;
    }
    return (
      <tr key={wall._id}>
        <td id="history">
          <a href={`http://${wall.url}`} target="_blank">
            {text}
          </a>
        </td>
      </tr>
    );
  },

  render() {
    const { offset, limit, walls } = this.props;

    let list = (<div style={{ margin: '25px 0' }} className="card">No content found</div>);
    if (walls.length > 0) {
      list = (
        <table id="history" className="card">
          <tbody>
            {walls.map(wall => this.renderRow(wall))}
          </tbody>
        </table>
      );
    }

    return (
      <div>
        <p className="margin-10">
          "Read Later" List:
        </p>
        <div className="center text-center">
          <Pagination offset={offset} limit={limit} count={walls.length} />
          {list}
        </div>
      </div>
    );
  },
});
