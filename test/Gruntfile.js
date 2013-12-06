module.exports = function(grunt) {
    grunt.initConfig({
        watch: {
            files: ['../build/*.js', '**/*Spec.js', '**/*.html'],
            options: {
                livereload: true
            },
            grunt: {
                files: ['Gruntfile.js']
            }
        }
    })

    grunt.loadNpmTasks('grunt-contrib-watch')
    grunt.registerTask('default', ['watch'])
}