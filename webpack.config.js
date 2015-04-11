var webpack = require('webpack');
var path = require('path');
var node_modules_dir = path.join(__dirname, 'node_modules');

var config = {
    context: __dirname,
    entry: {
        app: ['webpack/hot/dev-server', './app/main.jsx']
    },
    output: {
        publicPath: '/',
        path: path.resolve(__dirname, process.env.NODE_ENV === 'production' ? './dist/' : './build'),
        filename: 'bundle.js'
    },
    resolve: {
        alias: {}
    },
    devtool: 'eval-source-map',
    module: {
        noParse: [],
        loaders: [
            { test: /\.(js|jsx)$/, loader: 'babel', exclude: [node_modules_dir] },
            { test: /\.less$/, loader: 'style!css!less' },
            { test: /\.(woff|png|svg)$/, loader: 'url?limit=100000' }
        ]
    },
    plugins: [ new webpack.optimize.CommonsChunkPlugin('app', null, false) ]
};

module.exports = config;
