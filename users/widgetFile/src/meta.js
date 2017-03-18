/**
 * When Widget appears, inject a new viewport meta tag to prevent page scaling.
 * Same behaviour of intercom widget.
 */
export const injectMetaViewport = () => {
  const meta = document.createElement('meta');

  meta.setAttribute('id', 'drizzle-viewport-meta');
  meta.setAttribute('name', 'viewport');
  meta.setAttribute('content', [
    'width=device-width',
    'initial-scale=1.0',
    'maximum-scale=1.0',
    'user-scalable=0',
  ].join(', '));

  return document.head.appendChild(meta);
};

/**
 * Removes the meta viewport tag needed for widget.
 */
export const removeMetaViewport = () => {
  const meta = document.querySelector('meta[id="drizzle-viewport-meta"]');
  return document.head.removeChild(meta);
};
