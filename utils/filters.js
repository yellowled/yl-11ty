const { DateTime } = require('luxon');

module.exports = {
    dateToFormat: function (date, format = 'dd.MM.yyyy') {
        return DateTime.fromJSDate(date, { zone: 'utc' }).toFormat(
            String(format)
        );
    },

    dateToISO: function (date) {
        return DateTime.fromJSDate(date, { zone: 'utc' }).toISO({
            includeOffset: false,
            suppressMilliseconds: true,
        });
    },
};
