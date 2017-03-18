/* globals require: false, process: false */
"use strict"; // eslint-disable-line
const through = require('through2');
const browserify = require('browserify');
const babelify = require('babelify');
const sassify = require('sassify');
const html2js = require('html2js-browserify');
const uglify = require('gulp-uglify');
const gulpif = require('gulp-if');

const gulp = require('gulp');

const source = require('vinyl-source-stream');
const buffer = require('vinyl-buffer');
const minimist = require('minimist');

let settings = require('./settings.json');

const paths = {
  src: [
    'src/**/*.js',
    'src/**/*.html',
    'sass/**/*.scss',
    'node_modules/@drizzle/components/**/*.scss',
    'node_modules/@drizzle/components/**/*.html',
  ],
};

const knownOptions = {
  string: 'env',
  default: { production: false },
};

const options = minimist(process.argv.slice(2), knownOptions);

if (options.production) {
  try {
    settings = require('./settings-prod.json');
  } catch (e) {
    // pass
  }
}

function addSettings(file) {
  const header = `;const API_URL = "${settings.API_URL}"\n`;

  return through(function through2(buf, enc, next) {
    let content = `${buf.toString('utf8')}`;
    if (file.endsWith('src/widget.js')) {
      content = `${header}${content}`;
    }
    this.push(content);
    next();
  });
}

gulp.task('build', () => {
  const b = browserify({
    entries: './src/widget.js',
    transform: [addSettings, html2js, babelify],
  })
    .transform(sassify, {
      sourceComments: false,
      sourceMap: false,
      sourceMapEmbed: false,
      sourceMapContents: false,
      base64Encode: false,
      'auto-inject': true,
    });

  b.bundle()
    .on('error', (err) => {
      console.log(err);
      // console.log(err.message); // eslint-disable-line no-console
    })
    .pipe(source('widget.js'))
    .pipe(buffer())
    .pipe(gulpif(options.production, uglify())) // only uglify in production
    .pipe(gulp.dest('../../publishers/private/'));
});

gulp.task('watch', () => {
  gulp.watch(paths.src, ['build']);
});

gulp.task('default', ['watch', 'build']);
