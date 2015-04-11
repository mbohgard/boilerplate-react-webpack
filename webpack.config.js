var webpack = require('webpack'),
    path = require('path'),
    node_modules_dir = path.join(__dirname, 'node_modules'),
    production = path.resolve(__dirname, process.env.NODE_ENV === 'production';

var config = {
    context: __dirname,
    entry: {
        app: ['webpack/hot/dev-server', './app/main.jsx']
    },
    output: {
        publicPath: '/',
        path: production ? './dist/' : './build'),
        filename: 'bundle.js'
    },
    resolve: {
        alias: {}
    },
    devtool: production ? 'eval-source-map' : '',
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
