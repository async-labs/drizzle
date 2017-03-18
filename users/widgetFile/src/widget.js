/* eslint no-underscore-dangle: [2, { "allow": ["_Drizzle", "__DrizzleSettings"] }] */
/* globals API_URL */

import EventEmitter from 'wolfy87-eventemitter';

import '../sass/style.scss';
import HTML from './template.html';
import commands from './commands';
import { showWidget, hideWidget, showFooterBar } from './interact';

// FIX: import html file from @drizzle/components module is not working.
// Uncomment this to reproduce bug on gulp
// import ContentPlaceholderMarkup from '@drizzle/components/static/ContentPlaceholder.html';

// This file is a workaround because import from @drizzle/components is not working
// And comment this line below to not import duplicate
import ContentPlaceholderMarkup from './ContentPlaceholder.html';

let widgetFrame;
export const eventEmitter = new EventEmitter();

export function sendCommand(data) {
  if (!widgetFrame) { return; }
  widgetFrame.postMessage(data, API_URL);
}


function render({ widget }) {
  widget.innerHTML = HTML;

  // Elements
  const iframe = document.querySelector('.zenmarket-iframe');
  const widgetButton = document.getElementById('zenmarket-widget-button');
  const widgetCloseButton = document.getElementById('drizzle-close-button');


  let url = window.location.href;
  if (window.location.hash) {
    url = url.replace(window.location.hash, '');
  }


  // Initialize iframe
  iframe.setAttribute('src', `${API_URL}?url=${encodeURIComponent(url)}`);

  // Widget events
  widgetButton.addEventListener('click', () => showWidget());
  widgetCloseButton.addEventListener('click', () => {
    hideWidget();
    showFooterBar();
  });

  if (window.location.search.indexOf('__drizzle_open') > 0) {
    showWidget();
  }
}

function onReady() {
  const drizzleObj = window._Drizzle || {};

  if (drizzleObj.onReady) {
    drizzleObj.onReady();
  }

  localStorage.removeItem('callToActionClicked');

  const wrapper = document.getElementById('zenmarket--wrapper');

  if (wrapper) {
    /**
     * Paywall Loader
     */
    const settings = window.__DrizzleSettings || {};
    const callToActionButtonText = settings.callToActionButtonText || 'Read More';

    wrapper.innerHTML = `
      <div style="width: 100%; padding: 0px; text-align: center;">
        <hr style="background-color: #64baeb; border-top: 1px solid #64baeb; margin-bottom: 5px; width: 100%;" />

        <div style="margin-bottom: 5px; height: 25px;">
          <span title="Number of upvotes" style="float: right; font-size: 18px; opacity: 0.6; margin-right: 20px;">
          </span>
          <div style="clear: both;"></div>
        </div>

        <div style="text-align: center;clear: both;margin-bottom: 20px;">
          <button onclick="loadingContent()" class="drizzle-button default" id="GuestCallToActionButton" data-reactid=".1.1.0">
            <span data-reactid=".1.1.0.0">${callToActionButtonText}</span>
            <span style="width: 16px; display: inline-block; margin-left: 4px;"><img src="https://s3-us-west-1.amazonaws.com/zenmarket/droplet20px.png" alt="Drizzle Logo" style="padding: 0px; max-width: 100%; vertical-align: middle; border: 0px;"></span>
          </button>
        </div>
      </div>
      ${ContentPlaceholderMarkup}
    `;

    wrapper.classList.add('drizzle-fade-in');
  }

  const widget = document.createElement('div');
  widget.setAttribute('id', 'zenmarket-widget');

  window.document.body.appendChild(widget);

  render({ widget });
}

function receiveMessage(event) {
  // For Chrome, the origin property is in the event.originalEvent object.
  const origin = event.origin || event.originalEvent.origin;

  if (origin !== API_URL) { return; }

  if (!widgetFrame) {
    widgetFrame = event.source;
  }

  const command = commands[event.data.command];
  if (command) {
    command(event.data);
  }
}


export function loadScript(url, callback) {
  const script = window.document.createElement('script');
  script.async = true;
  script.src = url;

  const entry = window.document.getElementsByTagName('script')[0];
  entry.parentNode.insertBefore(script, entry);

  script.onload = script.onreadystatechange = () => {
    const rdyState = script.readyState;
    if (!rdyState || /complete|loaded/.test(script.readyState)) {
      if (callback) callback();
      script.onload = null;
      script.onreadystatechange = null;
    }
  };

  script.onerror = () => {
    const rdyState = script.readyState;
    if (!rdyState || /complete|loaded/.test(script.readyState)) {
      if (callback) callback();
      script.onerror = null;
    }
  };
}

window.loadingContent = function showLoadingState() {
  const btn = document.querySelector('.drizzle-button');
  btn.innerHTML = 'Loading&nbsp <span style="width: 16px; display: inline-block; margin-left: 4px;"><img src="https://s3-us-west-1.amazonaws.com/zenmarket/loading.gif" alt="Drizzle Logo" style="padding: 0px; max-width: 100%; vertical-align: middle; border: 0px;"></span>';


  localStorage.setItem('callToActionClicked', true);
};

function init() {
  onReady();
  window.addEventListener('message', receiveMessage, false);
}

window.addEventListener('load', init, false);

window._Drizzle = Object.assign(
  {},
  window._Drizzle,
  {
    showWidget,
    addEventListener(name, fn) {
      eventEmitter.addListener(name, fn);
    },
  }
);
