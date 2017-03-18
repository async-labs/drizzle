import React, { PropTypes, Component } from 'react';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

import { FlowRouter } from 'meteor/kadira:flow-router';
import ProductUsersSearchForm from '/imports/ui/users/components/ProductUsersSearchForm';

import Pagination from '../../common/pagination/components/Pagination.jsx';

import '/imports/ui/components/Table/style.scss';

export default class WallList extends Component {
  constructor(props) {
    super(props);

    this.search = this.search.bind(this);
    this.changeCategory = this.changeCategory.bind(this);
    this.changeSorting = this.changeSorting.bind(this);
    this.renderHeaderContent = this.renderHeaderContent.bind(this);
  }

  componentDidMount() {
    $('[data-toggle="tooltip"]').tooltip(); // eslint-disable-line no-undef
  }

  getTitle(wall) {
    let title = wall.title || wall.url;
    if (title.length > 60) {
      title = `${title.substr(0, 57)}...`;
    }
    return title;
  }

  search(event) {
    event.preventDefault();

    const query = event.target.search.value;
    const { search } = this.props;

    search(query);
  }

  popularity(wall) {
    if (!wall.popularity) {
      return [];
    }

    let p = [1, 2, 3];
    if (wall.popularity < 0.6) {
      p = [1];
    } else if (wall.popularity >= 0.6 && wall.popularity < 0.9) {
      p = [1, 2];
    }

    return p;
  }

  changeCategory(event) {
    const { changeOffset } = this.props;
    changeOffset(0);

    FlowRouter.setQueryParams({ categoryId: event.target.value });
  }

  changeSorting(event) {
    const { changeSorting } = this.props;
    changeSorting(event.currentTarget.dataset.sortkey);
  }

  renderCategories() {
    const { categories, categoryId } = this.props;

    if (!categories || !categories.length === 0) {
      return null;
    }

    return (
      <span>
        Category: <select
          onChange={this.changeCategory}
          value={categoryId || ''}
        >
          <option value="">
            No category
          </option>
          {
            categories.map((cat) =>
              <option
                value={cat._id}
                key={cat._id}
              >
                {cat.name}
              </option>
            )
          }
        </select>
      </span>
    );
  }

  renderRow(wall) {
    return (
      <tr className="fs13" key={wall._id} style={{ padding: '4px' }}>
        <td className="fs13">
          <a href={`http://${wall.url}`} target="_blank">
            {this.getTitle(wall)}
            &nbsp; <a className="fa fa-cog" href={`/paywalls/manage/${wall._id}`} />
          </a>
        </td>
        <td>
          {wall.isDisabled ? 'No' : 'Yes'}
        </td>
        <td>${wall.totalIncome / 100 || 0} (${wall.cpm && wall.cpm.toFixed(2) || 0})</td>
        <td>{wall.viewCount || 0}  ({wall.uniqueViewCount || 0})</td>
        <td>{wall.callToActionClickedCount || 0}</td>
        <td>{wall.footerButtonClickedCount || 0}</td>
        <td>{wall.registeredUserCount || 0}</td>
        <td>{wall.sellCount || 0}</td>
        <td>{wall.freeTrialSubscribedUserCount || 0}</td>
        <td>{wall.subscribedUserCount || 0}</td>
        <td>{wall.subscriberVisitedCount || 0}</td>
        <td>{wall.visitedCountViaUpselling || 0}</td>
      </tr>
    );
  }

  renderHeaderContent({ title, tooltip, sortKey }) {
    const { sorting } = this.props;
    let titleSpan = <span className="margin-r-5">{title}</span>;

    let sortArrow = null;
    if (sorting[sortKey] === -1) {
      sortArrow = <i className="fa fa-sort-desc margin-l-5" aria-hidden="true"></i>;
    } else if (sorting[sortKey] === 1) {
      sortArrow = <i className="fa fa-sort-asc margin-l-5" aria-hidden="true"></i>;
    } else {
      sortArrow = <i className="fa fa-sort margin-l-5" aria-hidden="true"></i>;
    }

    if (sortKey) {
      titleSpan = (
        <span
          data-sortkey={sortKey}
          className="margin-r-5"
          style={{ cursor: 'pointer' }}
          onClick={this.changeSorting}
        >
          <span>{title}</span>
          {sortArrow}
        </span>
      );
    }

    return (
      <span>
        {titleSpan}
        <OverlayTrigger
          placement="top"
          overlay={
            <Tooltip id="tooltip">
              <strong>{tooltip}</strong>
            </Tooltip>
          }
        >
          <a href="#"><i className="fa fa-info-circle" aria-hidden="true"></i></a>
        </OverlayTrigger>
      </span>
    );
  }

  renderHeader({ title, tooltip, sortKey }) {
    return (
      <th
        style={{
          borderRight: '1px solid rgba(0, 0, 0, 0.1)',
          textAlign: 'center',
          padding: '4px',
        }}
      >
        {this.renderHeaderContent({ title, tooltip, sortKey })}
      </th>
    );
  }

  render() {
    const { offset, limit, walls, changeOffset, totalCount } = this.props;

    return (
      <div>
        <div className="margin-b-20">
          <div className="row" style={{ paddingLeft: 0 }}>
          <div className="col-md-12" style={{ paddingLeft: 0, marginBottom: 20 }}>
            {this.renderCategories()}
          </div>
          <div className="col-md-6" style={{ paddingLeft: 0 }}>
            <ProductUsersSearchForm
              placeholder="Search by Title"
              onSubmit={this.search}
            />
          </div>


          </div>

          <Pagination
            offset={offset}
            limit={limit}
            count={walls.length}
            changeOffset={changeOffset}
            totalCount={totalCount}
          />

          <div>
            <table
              className="table-responsive margin-10-auto drizzle-table wall-list"
              style={{ textAlign: 'center' }}
            >
              <thead>
                <tr>
                  {this.renderHeader({
                    title: 'Content',
                    tooltip: 'Your webpages with Drizzle',
                  })}

                  {this.renderHeader({
                    title: 'Enabled',
                  })}

                  <th style={{
                    borderRight: '1px solid rgba(0, 0, 0, 0.0980392)',
                    textAlign: 'center',
                    padding: '4px',
                  }}>
                    {this.renderHeaderContent({
                      title: 'Total $',
                      tooltip: 'Total amount of $ earned by this page',
                    })}
                    <br />
                    {this.renderHeaderContent({
                      title: 'CPM',
                      tooltip: 'Amount of $ earned by page per 1000 non-unique views.',
                    })}
                  </th>

                  <th style={{
                    borderRight: '1px solid rgba(0, 0, 0, 0.0980392)',
                    textAlign: 'center',
                    padding: '4px',
                  }}>
                    {this.renderHeaderContent({
                      title: 'Total Views',
                      tooltip: 'Total number of views this page',
                      sortKey: 'viewCount',
                    })}
                    <br />
                    {this.renderHeaderContent({
                      title: 'Unique Views',
                      tooltip: 'Total number of unique views this page',
                      sortKey: 'uniqueViewCount',
                    })}
                  </th>

                  {this.renderHeader({
                    title: 'Button clicks',
                    tooltip: 'Total number of Call-To-Action (Read More) button clicks',
                    sortKey: 'callToActionClickedCount',
                  })}

                  {this.renderHeader({
                    title: 'Footer bar button',
                    tooltip: 'Total number of Footer bar button clicks',
                    sortKey: 'footerButtonClickedCount',
                  })}

                  {this.renderHeader({
                    title: 'Registered',
                    tooltip: 'Total number of users who registered on this page',
                    sortKey: 'registeredUserCount',
                  })}

                  {this.renderHeader({
                    title: 'Paid',
                    tooltip: 'Total number of users who made single payment on this page',
                    sortKey: 'sellCount',
                  })}

                  {this.renderHeader({
                    title: 'Trial',
                    tooltip: `Total number of users who signed up
                              for free trial on this page`,
                    sortKey: 'freeTrialSubscribedUserCount',
                  })}

                  {this.renderHeader({
                    title: 'Subscribed',
                    tooltip: 'Total number of users who bought subscription on this page',
                    sortKey: 'subscribedUserCount',
                  })}

                  {this.renderHeader({
                    title: 'Existing subscribers',
                    tooltip: 'Number of times page is accessed by existing subscribers',
                    sortKey: 'subscriberVisitedCount',
                  })}

                  {this.renderHeader({
                    title: 'Upselling',
                    tooltip: 'Total number of visitors who came to this page by clicking on a link from Upselling lists',
                    sortKey: 'visitedCountViaUpselling',
                  })}
                </tr>
              </thead>
              <tbody>
                {walls.map((wall) => this.renderRow(wall))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
}

WallList.propTypes = {
  offset: PropTypes.number.isRequired,
  changeOffset: PropTypes.func.isRequired,
  search: PropTypes.func.isRequired,
  limit: PropTypes.number.isRequired,
  totalCount: PropTypes.number,
  walls: PropTypes.array.isRequired,
  categories: PropTypes.array.isRequired,
  categoryId: PropTypes.string,

  changeSorting: PropTypes.func.isRequired,
  sorting: PropTypes.object.isRequired,
  product: PropTypes.object.isRequired,
};
