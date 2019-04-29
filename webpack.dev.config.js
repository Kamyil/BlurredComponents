const path = require('path');
const webpack = require('webpack');
const {CheckerPlugin} = require('awesome-typescript-loader');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
    mode: 'development',
    devtool: 'source-map',
    entry: ['./src/typescript/main.ts', './src/scss/main.scss'],
    optimization: {
        splitChunks: {
            cacheGroups: {
                style: {
                    name: 'style',
                    test: /\.css$/,
                    chunks: 'all',
                    enforce: true
                }
            }
        }
    },
    stats: { children: false },
    plugins: [
        new MiniCssExtractPlugin({
            filename: "css/style.css",
        }),
        new webpack.DefinePlugin({
            DEV: true
        }),
        new CheckerPlugin(),
        new webpack.NoEmitOnErrorsPlugin(),
    ],
    resolve: {
        extensions: ['.ts', '.js', '.css', '.scss'],
        modules: ["node_modules"],
        alias: {
            components: path.join(__dirname, "src/typescript/components"),
            utils: path.join(__dirname, "src/typescript/utils"),
            interfaces: path.join(__dirname, "src/typescript/interfaces"),
            tests: path.join(__dirname, "src/typescript/tests"),
        },
    },
    output: {
        filename: 'js/bundle.js',
        path: path.resolve(__dirname, 'dist/'),
        publicPath: '/dist/',
        pathinfo: true
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /(node_modules|\.test\.ts$)/,
                enforce: 'post',
                use: {
                    loader: 'istanbul-instrumenter-loader',
                    options: {
                        esModules: true
                    }
                },
            },

            {
                test: /\.js$/,
                include: [
                    path.resolve(__dirname, "node_modules/bootstrap/js/src/")
                ],
                use: {
                    loader: 'babel-loader',
                }
            },
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: [
                    {
                        loader: 'awesome-typescript-loader',
                        options: {
                            configFileName: path.resolve(__dirname, 'tsconfig.json'),
                            declaration: true,
                            useBabel: true,
                            useCache: true,
                            babelCore: "@babel/core",
                        },
                    },

                ],
            },
            {
                test: /\.(scss)$/,
                use: [
                    MiniCssExtractPlugin.loader,
                    "css-loader",
                    {loader: "postcss-loader", options: {sourceMap: 'inline'}},
                    {loader: "fast-sass-loader",
                        options: {
                            includePaths: ['./src/scss/', './node_modules'],
                            // outputStyle: 'expanded'
                        }
                    },
                    'resolve-url-loader'
                ]
            }
        ]
    }
};
