var config = require('../util/config.js');

// Put files not handled in other tasks here
module.exports = {
    config: config,
    dist: {
        files: [{
            expand: true,
            dot: true,
            cwd: '<%= copy.config.app %>',
            dest: '<%= copy.config.appDest %>',
            src: [
                '*.{ico,png,txt}',
                '.htaccess',
                'images/{,*/}*.{gif,webp}',
                'fonts/*',
                'views/**/*',
                '*.html',
                'widgets/**/*',
                'modules/**/*',
                'bower_components/**/*',
                'scripts/scripts.js',
                '!scripts/**/*.spec.js'
            ]
        }, {
            expand: true,
            cwd: '.tmp/images',
            dest: '<%= copy.config.appDest %>/images',
            src: [
                'generated/*'
            ]
        }]
    },
    app: {
        expand:true,
        cwd: '<%= copy.config.app %>',
        src: ['**', '!**/*.spec.js', '!**/*.less'],
        dest: '<%= copy.config.appDest %>/'
    },
    html: {
        expand:true,
        cwd: '<%= copy.config.app %>/views',
        src: ['**'],
        dest: '<%= copy.config.appDest %>/views'
    },
    index:{
        src: '<%= copy.config.app %>/index.html',
        dest: '<%= copy.config.appDest %>/index.html'
    },
    scripts: {
        expand:true,
        cwd: '<%= copy.config.app %>/scripts',
        src: ['**/*.js', '!**/*.spec.js'],
        dest: '<%= copy.config.appDest %>/scripts/'
    },
    css: {
        expand:true,
        cwd: '<%= copy.config.app %>/styles',
        src: ['app.css'],
        dest: '<%= copy.config.appDest %>/styles/'
    },
    plato: {
        files:[{
            expand: true,
            dot: true,
            dest: '<%= copy.config.appDest %>',
            src: [
                'report/**/*'
            ]
        }]
    }
};
