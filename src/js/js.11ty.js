const fs = require('fs');
const path = require('path');
const webpack = require('webpack');
const MemoryFileSystem = require('memory-fs');

const isProd = process.env.ELEVENTY_ENV === 'production';
const mfs = new MemoryFileSystem();
const ENTRY_FILE_NAME = 'main.js';

module.exports = class {
    async data() {
        const entryPath = path.join(__dirname, `/${ENTRY_FILE_NAME}`);
        const outputPath = path.resolve(__dirname, '../memory-fs/js');

        // Webpack config
        const rules = [
            {
                test: /.m?js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: [
                            [
                                '@babel/preset-env',
                                {
                                    useBuiltIns: 'usage',
                                    corejs: 3,
                                },
                            ],
                        ],
                    },
                },
            },
        ];

        const envPlugin = new webpack.EnvironmentPlugin({
            ELEVENTY_ENV: process.env.ELEVENTY_ENV,
        });

        const webpackConfig = {
            mode: isProd ? 'production' : 'development',
            entry: entryPath,
            output: {
                path: outputPath,
            },
            module: { rules },
            plugins: [envPlugin],
        };

        return {
            permalink: '/js/main.js',
            eleventyExcludeFromCollections: true,
            webpackConfig,
        };
    }

    // Compile JS with Webpack, write to Memory Filesystem.
    // @see https://github.com/MadeByMike/supermaya/blob/master/site/utils/compile-webpack.js
    compile(webpackConfig) {
        const compiler = webpack(webpackConfig);
        compiler.outputFileSystem = mfs;
        compiler.inputFileSystem = fs;
        compiler.resolvers.normal.fileSystem = mfs;

        return new Promise((resolve, reject) => {
            compiler.run((err, stats) => {
                if (err || stats.hasErrors()) {
                    const errors =
                        err ||
                        (stats.compilation ? stats.compilation.errors : null);
                    reject(errors);
                    return;
                }
                const { assets } = stats.compilation;
                const file = assets[ENTRY_FILE_NAME].source();
                resolve(file);
            });
        });
    }

    // Render JS file
    async render({ webpackConfig }) {
        try {
            const result = await this.compile(webpackConfig);
            return result;
        } catch (err) {
            console.log(err);
            return null;
        }
    }
};
