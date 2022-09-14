const path = require('path');

module.exports = {
    entry: './src/index.ts',
    output: {
        filename: 'index.mjs',
        path: path.join(__dirname, 'dist'),
        library: {
            type: 'module',
        },
    },
    experiments: {
        outputModule: true,
    },

    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/
            },
            {
                test: /\.ya?ml$/,
                use: {
                    loader: 'yaml-loader'
                }
            }
        ]
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    // output: {
    //     filename: 'bundle.js',
    //     path: path.resolve(__dirname, 'dist'),
    // },
};