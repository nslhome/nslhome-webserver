module.exports = {
    entry: ['./public/app/index.jsx'],
    output: {
        path: __dirname + '/public/dist',
        filename: "bundle.js",
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
