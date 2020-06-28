const pluginRss = require('@11ty/eleventy-plugin-rss');

const filters = require('./src/_11ty/filters');
const shortcodes = require('./src/_11ty/shortcodes');
const transforms = require('./src/_11ty/transforms');

module.exports = function (config) {
    // Plugins
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

    // Additional watch targets
    config.addWatchTarget('./src/css');
    config.addWatchTarget('./src/js');

    // Layout aliases
    config.addLayoutAlias('default', 'default.njk');

    // Pass-through copy files
    config.addPassthroughCopy('src/site.webmanifest');
    config.addPassthroughCopy('src/favicons');

    // Deep-merge data
    config.setDataDeepMerge(true);

    return {
        dir: {
            input: 'src',
            output: 'dist',
            includes: '_includes',
            layouts: '_layouts',
            data: '_data',
        },
        templateFormats: ['njk', 'md', '11ty.js'],
        htmlTemplateEngine: 'njk',
        markdownTemplateEngine: 'njk',
    };
};
