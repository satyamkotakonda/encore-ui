var config = require('../util/config.js');

module.exports = {
    options: {
        config: config
    },
    html: ['<%= usemin.options.config.appDest %>/{,*/}*.html'],
    css: ['<%= usemin.options.config.appDest %>/styles/{,*/}*.css'],
    options: {
        dirs: ['<%= usemin.options.config.appDest %>']
    }
};
