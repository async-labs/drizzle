import React from 'react';
import ReactDOMServer from 'react-dom/server';
import fs from 'fs';
import register from 'ignore-styles';

register(['.sass', '.scss']);

const paths = [
  '../components/ContentPlaceholder',
  '../components/WidgetFooterBar',
];

const outputDir = `${__dirname}/../static`;

paths.forEach(path => {
  const module = require(path);
  const Component = module.default;
  const componentName = path.split('/')[2];
  const markup = ReactDOMServer.renderToStaticMarkup(<Component />);

  fs.writeFile(`${outputDir}/${componentName}.html`, markup, (err) => {
    if (err) { return console.error(err); }
    console.log(`> Successfully exported ${componentName} to static markup. Check static folder.`);
  });
});
