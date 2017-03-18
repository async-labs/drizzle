import React, { PropTypes } from 'react';

import ProductSelector from '../containers/ProductSelector';

export default function NavbarTop(props) {
  return (
    <nav className="navbar navbar-default navbar-fixed-top" id="main-top-navbar">
      <div className="container-fluid">
        <div className="navbar-header">
          <button
            type="button"
            className="navbar-toggle collapsed"
            data-toggle="collapse"
            data-target="#bs-example-navbar-collapse-1"
            aria-expanded="false"
          >
            <span className="sr-only">Toggle navigation</span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
          </button>
          <a className="navbar-brand" href="/">
            <div>
              <img src="https://s3-us-west-1.amazonaws.com/zenmarket/drizzle-logo.svg?v=1" alt="Drizzle" height="40" width="40" />&nbsp;&nbsp;
              <span>Drizzle</span>
            </div>
          </a>
        </div>

        <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
          {props.isLoggedIn && !props.isLoading ? (
            <div>
              <ul className="nav navbar-nav">
                <li>
                  <ProductSelector products={props.products} />
                </li>
                <li>
                  {/* <ProductHeader /> */}
                </li>
              </ul>
              <ul className="nav navbar-nav navbar-right">
                <li className="dropdown">
                  <a
                    href="#" className="dropdown-toggle"
                    data-toggle="dropdown" role="button"
                    aria-haspopup="true" aria-expanded="false"
                  >
                    {props.userMail} <span className="caret"></span>
                  </a>
                  <ul className="dropdown-menu">
                    <li><a href="/logout">Logout</a></li>
                  </ul>
                </li>
              </ul>
            </div>
          ) : null}
        </div>
      </div>
    </nav>
  );
}

NavbarTop.propTypes = {
  userMail: PropTypes.string,
  products: PropTypes.array.isRequired,
  isLoggedIn: PropTypes.bool.isRequired,
  isLoading: PropTypes.bool.isRequired,
};
