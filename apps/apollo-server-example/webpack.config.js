var path = require('path');
var webpack = require('webpack');
module.exports = (webpackConfig) => {
    webpackConfig.module.rules.push({
        test: /\.mjs$/,
        include: /node_modules/,
        type: "javascript/auto",
    });
    return webpackConfig;
};