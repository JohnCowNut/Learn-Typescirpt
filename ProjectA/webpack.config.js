const path = require('path')

module.exports = {
    mode: 'development',
    entry: './src/app.ts',
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: 'dist'
    },
    devtool: 'inline-source-map',
    // add typescript
    module: {
        rules: [{
            test: /\.ts$/, // checked end ts,
            use: 'ts-loader',
            exclude: /node_modules/
        }]
    },
    resolve: {
        extensions: ['.ts', '.js']
    }
}