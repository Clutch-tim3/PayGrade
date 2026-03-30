const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  mode: process.env.NODE_ENV || 'development',
  entry: {
    popup: './src/popup/popup.tsx',
    background: './src/background/service-worker.ts',
    content: './src/content/detector.ts',
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: '[name].js',
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    fallback: {
      buffer: false,
    },
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/popup.html',
      filename: 'popup.html',
      chunks: ['popup'],
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: './public/manifest.json', to: '.' },
        { from: './public/icons', to: 'icons' },
      ],
    }),
  ],
  devtool: process.env.NODE_ENV === 'production' ? 'source-map' : 'inline-source-map',
};