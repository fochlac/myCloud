const path = require('path'),
  HtmlWebpackPlugin = require('html-webpack-plugin'),
  webpack = require('webpack'),
  ExtractTextPlugin = require('extract-text-webpack-plugin'),
  ServiceWorkerWebpackPlugin = require('serviceworker-webpack-plugin')

module.exports = {
  entry: ['./web/index.js'],
  output: {
    path: path.resolve(__dirname, 'static'),
    filename: 'index_bundle.js',
    publicPath: '/static/',
  },
  mode: 'development',
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.jsx$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1,
              },
            },
            {
              loader: 'postcss-loader',
            },
          ],
        }),
      },
      {
        test: /\.less$/,
        exclude: /node_modules/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader',
              options: {
                importLoaders: 1,
                sourceMap: true,
                modules: true,
                localIdentName: '[local]___[hash:base64:5]',
              },
            },
            {
              loader: 'postcss-loader',
            },
            {
              loader: 'less-loader',
            },
          ],
        }),
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url-loader?limit=10000&mimetype=application/font-woff',
      },
      {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader',
        exclude: /static/,
      },
      {
        test: /\.(json|png|ico|xml|svg)$/,
        loader: 'file-loader',
        options: {
          name: '[name].[ext]',
        },
        type: 'javascript/auto',
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx', 'less'],
    alias: {
      COMPONENTS: path.resolve('./web/components'),
      RAW: path.resolve('./web/components/raw'),
      DIALOG: path.resolve('./web/components/dialog'),
      CONNECTED: path.resolve('./web/components/connected'),
      PAGES: path.resolve('./web/components/views'),
      UTILS: path.resolve('./web/utils'),
      STORE: path.resolve('./web/store'),
      SW: path.resolve('./node_modules/serviceworker-webpack-plugin/lib'),
    },
  },
  plugins: [
    new ExtractTextPlugin({
      filename: 'styles.css',
    }),
    new ServiceWorkerWebpackPlugin({
      entry: './web/sw.js',
      filename: 'sw.js',
    }),
    new HtmlWebpackPlugin({
      template: './web/index.html',
      filename: 'index.html',
      inject: 'body',
    }),
  ],
}
