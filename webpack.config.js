/* eslint-disable @typescript-eslint/no-var-requires */
/*eslint no-undef: "error"*/
/*eslint-env node*/
const path = require('path');

module.exports = {
  entry: {
    issueViewer: './src/view/app/index.tsx',
  },
  output: {
    path: path.resolve(__dirname, 'issueViewer'),
    filename: '[name].js',
  },
  devtool: 'eval-source-map',
  resolve: {
    extensions: ['.js', '.ts', '.tsx', '.json'],
  },
  module: {
    rules: [
      {
        test: /\.(ts|tsx)$/,
        loader: 'ts-loader',
        options: {},
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader',
          },
        ],
      },
    ],
  },
  performance: {
    hints: false,
  },
};
