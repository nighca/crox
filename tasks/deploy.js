module.exports = function(grunt) {
  var semver = require('semver')
  var async = require('async')


  grunt.registerTask('pushGitlab', 'push to gitlab', function(env) {
    var done = this.async()

    grunt.util.spawn({
      cmd: 'git',
      args: [ 'tag', '-l', 'publish/*' ],
      opts: { stdio: 'pipe'}
    }, function(err, res, code) {
      if (code !== 0) return grunt.fail.fatal(err, code)

      var pkg = grunt.config('pkg')
      var versions = ('' + res).split(/\r|\n/)
        .map(function(tag) { return tag.replace('publish/', '') })
        .sort(semver.rcompare)

      if (versions[0] && semver.lte(pkg.version, versions[0])) {
        pkg.version = semver.inc(versions[0], 'patch')
        grunt.file.write('package.json', JSON.stringify(pkg, null, '  '))
      }

      grunt.log.writeln('Crox version is ' + pkg.version)

      env = env === 'prod' ? env : 'daily'
      if (env === 'daily') {
        async.series([
          function(callback) {
            pushDaily(pkg.version, callback)
          },
          restoreBranch
        ], done)
      }
      else {
        async.series([
          function(callback) {
            pushDaily(pkg.version, callback)
          },
          function(callback) {
            publish(pkg.version, callback)
          },
          restoreBranch
        ], done)
      }
    })

    function pushDaily(version, fn) {
      async.series([
        function checkoutBranch(callback) {
          grunt.util.spawn({
            cmd: 'git',
            args: [ 'checkout', '-B', 'daily/' + version ],
            opts: { stdio: 'pipe'}
          }, function(err, res, code) {
            if (code !== 0)
              callback(err)
            else
              callback(null, code)
          })
        },
        function pushBranch(callback) {
          grunt.util.spawn({
            cmd: 'git',
            args: [ 'push', 'gitlab', 'daily/' + version ],
            opts: { stdio: 'pipe'}
          }, function(err, res, code) {
            if (code !== 0)
              callback(err)
            else
              callback(null, code)
          })
        }
      ], function(err, code) {
        if (err)
          grunt.fail.fatal(err)
        else
          grunt.log.writeln('成功发布 ' + version + ' 至 daily 环境')

        if (fn) fn(err, code)
      })
    }

    function publish(version, fn) {
      async.series([
        function addTag(callback) {
          grunt.util.spawn({
            cmd: 'git',
            args: [ 'tag', 'publish/' + version ],
            opts: { stdio: 'pipe'}
          }, function(err, res, code) {
            if (code !== 0)
              callback(err)
            else
              callback(null, code)
          })
        },
        function pushTag(callback) {
          grunt.util.spawn({
            cmd: 'git',
            args: [ 'push', 'gitlab', 'publish/' + version ],
            opts: { stdio: 'pipe'}
          }, function(err, res, code) {
            if (code !== 0)
              callback(err)
            else
              callback(null, code)
          })
        }
      ], function(err, code) {
        if (err)
          grunt.fail.fatal(err)
        else
          grunt.log.writeln('成功发布 ' + version + ' 至线上环境')

        if (fn) fn(err, code)
      })
    }

    function restoreBranch(fn) {
      grunt.util.spawn({
        cmd: 'git',
        args: [ 'checkout', 'master' ],
        opts: { stdio: 'pipe'}
      }, fn)
    }
  })

  grunt.registerTask('addGitlab', 'init gitlab repo of crox', function() {
    var done = this.async()

    grunt.util.spawn({
      cmd: 'git',
      args: ['remote']
    }, function(err, res, code) {
      if (err) return grunt.fail.fatal(err)

      if (/\bgitlab\b/.test(res.stdout)) {
        grunt.log.writeln('成功添加 gitlab remote')
        done()
      }
      else {
        grunt.util.spawn({
          cmd: 'git',
          args: ['remote', 'add', 'gitlab', 'git@gitlab.alibaba-inc.com:thx/crox.git']
        }, function(err, res, code) {
          if (err) return grunt.fail.fatal(err)

          grunt.log.writeln('成功添加 gitlab remote')
          done()
        })
      }
    })
  })
}