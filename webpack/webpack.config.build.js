const path = require('path')
const _ = require('lodash')
const webpack = require('webpack')
const ExtractTextPlugin = require("extract-text-webpack-plugin")
const merge = require('webpack-merge')

const allConfig = require('../config/index.js')
const baseWebpackConfig = require('./webpack.base.js')
const postcssPlugins = require('./postcss.config.js')

const config = _.merge({}, allConfig, allConfig.PRODUCTION)

const imageLoaders = [{
  loader: 'url-loader',
  options: config.imgLoaderQuery
}]

const imageToBase64Loaders = [{
  loader: 'url-loader',
  options: {
    limit: '10000000'
  }
}]
const imageWebpackLoader = {
  loader: 'image-webpack-loader',
  options: config.imageWebpackLoader
}
config.enableImageMin && imageLoaders.push(imageWebpackLoader)
config.enableImageMin && imageToBase64Loaders.push(imageWebpackLoader)

const cssLoader = [{
  loader: 'css-loader',
  options: _.merge({}, config.cssLoaderOptions, {
    minimize: config.enableCSSCompress
  })
}, {
  loader: 'postcss-loader',
  options: {
    plugins: postcssPlugins
  }
}]

const LESS_LOADER = 'less-loader'
let lessLoader = LESS_LOADER 
if (config.lessLoaderOptions) {
  lessLoader = {
    loader: LESS_LOADER,
    options: config.lessLoaderOptions
  }
}

const SASS_LOADER = 'sass-loader'
let sassLoader = SASS_LOADER 
if (config.sassLoaderOptions) {
  sassLoader = {
    loader: SASS_LOADER,
    options: config.sassLoaderOptions
  }
}

const STYLUS_LOADER = 'stylus-loader'
let stylusLoader = STYLUS_LOADER 
if (config.stylusLoaderOptions) {
  stylusLoader = {
    loader: STYLUS_LOADER,
    options: config.stylusLoaderOptions
  }
}

const publicPath = config.outputCssPublicPath || config.output.publicPath

const plugins = [
  new ExtractTextPlugin({
    filename: config.outputCss,
    allChunks: true
  }),
  new webpack.LoaderOptionsPlugin({
    // minimize: true
  })
]
config.enableJSCompress && plugins.push(new webpack.optimize.UglifyJsPlugin(config.uglifyjsPluginOptions))


module.exports = merge(baseWebpackConfig, {
  entry: config.entry,
  module: {
    rules: [{
      test: /\.(eot|woff|woff2|ttf|svg|png|jpe?g|jpg|gif)(\?\S*)?$/,
      exclude: [/node_modules/].concat(config.imgToBase64Dir),
      use: imageLoaders
    }, {
      test: /\.(eot|woff|woff2|ttf|svg|png|jpe?g|jpg|gif)(\?\S*)?$/,
      exclude: /node_modules/,
      include: config.imgToBase64Dir,
      use: imageToBase64Loaders
    }, {
      test: /\.css$/,
      loader: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: cssLoader,
        publicPath: publicPath
      })
    }, {
      test: /\.scss$/,
      loader: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: cssLoader.concat(sassLoader),
        publicPath: publicPath
      })
    }, {
      test: /\.less$/,
      loader: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: cssLoader.concat(lessLoader),
        publicPath: publicPath
      })
    }, {
      test: /\.styl$/,
      loader: ExtractTextPlugin.extract({
        fallback: 'style-loader',
        use: cssLoader.concat(stylusLoader),
        publicPath: publicPath
      })
    }]
  },
  plugins: plugins
})
