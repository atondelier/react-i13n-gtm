var webpack = require('webpack');

module.exports = {
    entry: './src/index.js',
    output: {
        path: './dist',
        filename: 'bundle.js',
        libraryTarget: 'umd',
        library: 'ReactI13nGTM'
    },
    module: {
        loaders: [
            {
                test:/\.js[x]?$/,
                exclude: /node_modules/,
                loader: 'babel-loader'
            }
        ]
    },
    plugins: [
        new webpack.NoErrorsPlugin()
    ],
    stats: {
        // Nice colored output
        colors: true
    }
};
