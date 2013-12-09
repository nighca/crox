module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json')
  })

  grunt.loadTasks('tasks')

  grunt.registerTask('daily', ['addGitlab', 'pushGitlab:daily'])
  grunt.registerTask('deploy', ['addGitlab', 'pushGitlab:prod'])
}