const path = require('path');

module.exports = {
  module: {
    loaders: [
      // Loaders for bootstrap
      {
        test: /bootstrap-sass[\/\\]assets[\/\\]javascripts[\/\\]/,
        loader: 'imports?jQuery=jquery',
      },
      {
        test: /\.png$/,
        loader: 'url-loader',
        exclude: /node_modules/,
        query: { mimetype: 'image/png' },
      },
      {
        test: /\.(woff2?|svg)$/,
        loader: 'url?limit=10000',
      },
      {
        test: /\.(ttf|eot)$/,
        loader: 'file',
      },
      // Loader for less files
      // Loaders for font-awesome
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url-loader?limit=10000&mimetype=application/font-woff' },
      {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader',
      },
      {
        test: /.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['es2015', 'react'],
        },
      },
      {
        test: /\.scss$/,
        loaders: ['style', 'css', 'sass'],
      },
      {
        test: /\.css$/,
        loader: 'style-loader!css-loader',
      },
      {
        test: /(\.js|\.jsx)$/,
        loader: 'babel',
        include: [
          path.resolve(__dirname, './node_modules/react-icons/fa'),
          path.resolve(__dirname, './node_modules/react-icons/md'),
        ],
        query: {
          presets: ['es2015', 'react'],
        },
      },
    ],
  },
};
