const { DateTime } = require('luxon');

module.exports = {
    dateFormat: function (date, format = 'dd.MM.yyyy') {
        return DateTime.fromJSDate(date, { zone: 'utc' }).toFormat(
            String(format)
        );
    },

    dateISO: function (date) {
        return DateTime.fromJSDate(date, { zone: 'utc' }).toISO({
            includeOffset: false,
            suppressMilliseconds: true,
        });
    },
};
