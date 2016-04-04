module.exports = {
    entry: ['./public2/app/index.jsx'],
    output: {
        path: __dirname + '/public2/dist',
        filename: "bundle.js",
        publicPath: '/dist/'
    },
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                loader: 'babel',
                exclude: /node_modules/,
                query: {
                    cacheDirectory: true,
                    presets: ['react']
                }
            }
        ]
    }
};
