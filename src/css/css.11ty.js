const path = require('path');
const sass = require('sass');
const postcss = require('postcss');
const autoprefixer = require('autoprefixer');
const flexbugs = require('postcss-flexbugs-fixes');
const CleanCSS = require('clean-css');
const cssesc = require('cssesc');

const isProd = process.env.ELEVENTY_ENV === 'production';
const ENTRY_FILE_NAME = 'main.scss';

module.exports = class {
    async data() {
        const entryPath = path.join(__dirname, `/${ENTRY_FILE_NAME}`);
        return {
            permalink: '/css/main.css',
            eleventyExcludeFromCollections: true,
            entryPath,
        };
    }

    // Compile SCSS to CSS
    async compile(config) {
        return new Promise((resolve, reject) => {
            if (!isProd) {
                config.sourceMap = true;
                config.sourceMapEmbed = true;
                config.outputStyle = 'expanded';
            }
            // if this becomes a performance issue, use renderSync()
            // https://sass-lang.com/documentation/js-api
            return sass.render(config, (err, result) => {
                if (err) {
                    return reject(err);
                }
                resolve(result.css.toString());
            });
        });
    }

    // autoprefixer + flexbugs fixes in production
    async process(css) {
        return new Promise((resolve) => {
            if (!isProd) {
                resolve(css);
            }
            const processed = postcss([
                autoprefixer({ grid: true }),
                flexbugs(),
            ]).process(css);

            resolve(processed.toString());
        });
    }

    // Minify in production
    async minify(css) {
        return new Promise((resolve, reject) => {
            if (!isProd) {
                resolve(css);
            }
            const minified = new CleanCSS().minify(css);
            if (!minified.styles) {
                return reject(minified.error);
            }
            resolve(minified.styles);
        });
    }

    // Display error overlay if CSS build fails
    // @see https://github.com/MadeByMike/supermaya/blob/master/site/utils/compile-scss.js
    renderError(error) {
        return `
        /* Error compiling stylesheet */
        *,
        *::before,
        *::after {
            box-sizing: border-box;
        }
        html,
        body {
            margin: 0;
            padding: 0;
            min-height: 100vh;
            font-family: monospace;
            font-size: 1.25rem;
            line-height:1.5;
        }
        body::before {
            content: '';
            background: #000;
            top: 0;
            bottom: 0;
            width: 100%;
            height: 100%;
            opacity: 0.7;
            position: fixed;
        }
        body::after {
            content: '${cssesc(error)}';
            white-space: pre;
            display: block;
            top: 0;
            padding: 30px;
            margin: 50px;
            width: calc(100% - 100px);
            color:#721c24;
            background: #f8d7da;
            border: solid 2px red;
            position: fixed;
        }`;
    }

    // Render CSS file
    async render({ entryPath }) {
        try {
            const css = await this.compile({ file: entryPath });
            const post = await this.process(css);
            const result = await this.minify(post);
            return result;
        } catch (err) {
            if (isProd) {
                throw new Error(err);
            } else {
                console.error(err);
                const msg = err.formatted || err.message;
                return this.renderError(msg);
            }
        }
    }
};
