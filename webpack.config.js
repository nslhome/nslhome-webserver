module.exports = {
    entry: {
        app:'./public/app/index.jsx',
        mobile: './public/mobile/index.jsx'
    },
    output: {
        path: __dirname + '/public/dist',
        filename: "[name]_bundle.js",
        publicPath: '/dist/'
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                loader: 'babel',
                query: {
                    cacheDirectory: true,
                    presets: ['react']
                }
            }
        ]
    }
};
