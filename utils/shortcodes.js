module.exports = {
    dateTime: function (isoDate, formatDate) {
        return `<time datetime="${isoDate}">${formatDate}</time>`;
    },
};
