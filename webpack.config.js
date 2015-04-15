var webpack = require('webpack');

var config = {
    context: __dirname,
    entry: {
        app: ['webpack/hot/dev-server', './app/main.jsx']
    },
    output: {
        publicPath: '/',
        path: './build',
        filename: 'bundle.js'
    },
    resolve: {
        alias: {}
    },
    module: {
        noParse: [],
        loaders: [
            { test: /\.(js|jsx)$/, loader: 'babel', exclude: /node_modules/ },
            { test: /\.less$/, loader: 'style!css!less' },
            { test: /\.(woff|png|svg)$/, loader: 'url?limit=100000' }
        ]
    },
    plugins: [ new webpack.optimize.CommonsChunkPlugin('app', null, false) ]
};

module.exports = config;
