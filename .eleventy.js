const eleventyNavigationPlugin = require('@11ty/eleventy-navigation');
const pluginRss = require('@11ty/eleventy-plugin-rss');

const filters = require('./src/_11ty/filters');
const shortcodes = require('./src/_11ty/shortcodes');
const transforms = require('./src/_11ty/transforms');

module.exports = function (config) {
    // Plugins
    config.addPlugin(eleventyNavigationPlugin);
    config.addPlugin(pluginRss);

    // Filters
    Object.keys(filters).forEach((filterName) => {
        config.addFilter(filterName, filters[filterName]);
    });

    // Shortcodes
    Object.keys(shortcodes).forEach((shortcodeName) => {
        config.addShortcode(shortcodeName, shortcodes[shortcodeName]);
    });

    // Transforms
    Object.keys(transforms).forEach((transformName) => {
        config.addTransform(transformName, transforms[transformName]);
    });

    // Reload dev server if CSS/JS changes
    config.setBrowserSyncConfig({
        files: ['_site/css/main.css', '_site/js/main.js'],
    });

    // Pass-through copy files
    config.addPassthroughCopy('src/favicons');

    // Deep-merge data
    config.setDataDeepMerge(true);

    return {
        dir: {
            input: 'src',
            layouts: '_layouts',
        },
        markdownTemplateEngine: 'njk',
        htmlTemplateEngine: 'njk',
        templateFormats: ['njk', 'md', '11ty.js'],
    };
};
