import { injectMetaViewport, removeMetaViewport } from './meta';
import { sendCommand } from './widget';

function isMobile() {
  return window.innerWidth <= 380;
}

export const showFooterBar = () => {
  const footer = document.getElementById('zenmarket-footer');

  if (footer) {
    if (![...footer.classList].find(c => c === 'footer-fade-in')) {
      footer.classList.remove('footer-fade-out');
      footer.classList.add('footer-fade-in');
      sendCommand({ command: 'showFooterBar' });
    }
  }
};

export const hideFooterBar = () => {
  const footer = document.getElementById('zenmarket-footer');

  if (footer) {
    footer.classList.remove('footer-fade-in');
    footer.classList.add('footer-fade-out');
    sendCommand({ command: 'hideFooterBar' });
  }
};

export const showWidget = () => {
  const iframeWrapper = document.querySelector('.zenmarket-iframe-wrapper');
  const parentBody = document.body;

  iframeWrapper.classList.remove('widget-fade-out');
  iframeWrapper.classList.add('widget-fade-in');

  if (isMobile()) {
    // Prevents parent website to scroll when widget is open on mobile
    parentBody.classList.add('drizzle-mobile-widget-active');
    injectMetaViewport();
  }

  hideFooterBar();
  sendCommand({ command: 'hideFooterBar' });
};

export const showWidgetIcon = () => {
  const widgetButton = document.getElementById('zenmarket-widget-button');
  if (widgetButton) {
    widgetButton.style.display = 'block';
  }
};

export const hideWidget = () => {
  const iframeWrapper = document.querySelector('.zenmarket-iframe-wrapper');
  const parentBody = document.body;

  iframeWrapper.classList.remove('widget-fade-in');
  iframeWrapper.classList.add('widget-fade-out');

  parentBody.classList.remove('drizzle-mobile-widget-active');
  if (isMobile()) {
    removeMetaViewport();
  }

  showFooterBar();
  sendCommand({ command: 'showFooterBar' });
};
