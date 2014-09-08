module.exports = {
    options: {
        livereload: 1337
    },
    scripts: {
        files: ['src/**/*.js', '!src/*/*.spec.js', '!src/*/*.midway.js', '!src/*/*.page.js'],
        tasks: ['build', 'karma:watch:run']
    },
    specs: {
        files: ['src/**/*.spec.js'],
        tasks: ['karma:watch:run', 'copy:coverage'],
        options: {
            livereload: false
        }
    },
    componentHtml: {
        files: ['src/**/templates/*.html'],
        tasks: ['html2js', 'build', 'karma:watch:run']
    },
    componentLess: {
        files: ['src/**/*.less'],
        tasks: ['concat:tmpLess', 'less', 'styleguide']
    },
    componentImages: {
        files: ['src/**/images/*'],
        tasks: ['copy:componentImages']
    },
    demoSite: {
        files: ['src/**/docs/*.html', 'src/**/*.md', 'demo/**/*'],
        tasks: ['build']
    }
};
