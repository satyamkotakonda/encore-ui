var config = require('../util/config.js');

module.exports = {
    config: config,
    html: ['<%= usemin.config.appDest %>/{,*/}*.html'],
    css: ['<%= usemin.config.appDest %>/styles/{,*/}*.css'],
    options: {
        dirs: ['<%= usemin.config.appDest %>']
    }
};
