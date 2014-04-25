module.exports = function (grunt) {
    grunt.registerTask('default',
        'Default task will run the server locally with stubbed api calls.',
        [
            'jshint',
            'karma:full',
            'build',
            'docs'
        ]
    );
};