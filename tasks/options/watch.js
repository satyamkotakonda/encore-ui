module.exports = {
    scripts: {
        files: ['Gruntfile.js', 'app/scripts/**/*.js', '!app/scripts/**/*.spec.js', '!app/scripts/debug.js',
                'app/modules/**/*.js', '!app/modules/**/*.spec.js'],
        tasks: ['jshint:scripts','jscs:scripts', 'test:unit'],
        options: {
            livereload: true
        }
    },
    specs: {
        files: ['app/scripts/**/*.spec.js'],
        tasks: ['jshint:specs','jscs:scripts', 'test:unit'],
        options: {
            livereload: false
        }
    },
    css: {
        files: ['app/styles/**/*.less', 'app/modules/**/*.less'],
        tasks: ['less'],
        options: {
            livereload: true
        }
    },
    html: {
        files: ['app/index.html', 'app/views/{,*/}*.html', 'app/modules/**/*.html'],
        options: {
            livereload: true
        }
    }
};
