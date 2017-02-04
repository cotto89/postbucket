const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const WebpackNotifierPlugin = require('webpack-notifier');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const autoprefixer = require('autoprefixer');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const BabiliPlugin = require("babili-webpack-plugin");

/* NODE_ENV */
const NODE_ENV = process.env.NODE_ENV || 'development';
const isProd = NODE_ENV === 'production';
const isDev = !isProd;

console.info(`
:--------- process.env.NODE_ENV: ${NODE_ENV} ---------:,
`);

let config = {
    entry: {
        vendor: ['react', 'react-dom'],
        index: ['./src/lib/polyfill/object.ts', './src/index.ts', './style/index.scss']
    },
    output: {
        path: path.join(__dirname, 'public', 'assets'),
        filename: '[name].bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                exclude: /(\/node_modules\/|\.test\.tsx?$)/,
                loader: 'awesome-typescript-loader'
            },
            {
                test: /\.s?css$/,
                loader: ExtractTextPlugin.extract({
                    fallbackLoader: 'style-loader',
                    loader: [
                        `css-loader?minimize=${isProd}?localIdentName=[path][name]___[local]___[hash:base64:5]`,
                        'postcss-loader',
                        'sass-loader'
                    ]
                })
            }
        ]
    },
    plugins: [
        // loader options
        new webpack.LoaderOptionsPlugin({
            options: {
                postcss: [autoprefixer({ browsers: ['last 2 versions'] })],
            }
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            filename: 'vendor.bundle.js'
        }),
        new HtmlWebpackPlugin({
            hash: true,
            filename: '../index.html',
            template: './index.html'
        }),
        new ExtractTextPlugin('[name].bundle.css'),
        new WebpackNotifierPlugin({ title: 'Webpack' }),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: JSON.stringify(NODE_ENV)
            }
        })
    ],
    resolve: {
        extensions: ['.ts', '.tsx', '.js', '.jsx']
    },
};

if (isDev) {
    config = merge(config, {
        // https://medium.com/webpack/whats-new-in-webpack-dev-server-2-0-a66848c3679#.qyeizw1h1
        output: {
            path: '/',
            filename: '[name].bundle.js'
        },
        devtool: 'inline-source-map',
        devServer: {
            contentBase: 'public',
            inline: true,
            noInfo: true
        }
    });
}

if (isProd) {
    config = merge(config, {
        devtool: 'hidden-source-map',
        plugins: [
            new BabiliPlugin()
        ]
    });
}

module.exports = [config];