module.exports = function(grunt) {

    var buildDir = './build';

    var banner = '/*!\n\
 * @preserve <%= pkg.name %> v<%= pkg.version %>\n\
 * <%= pkg.repository.url %>\n\
 *\n\
 * Released under the MIT license\n\
 * @date: <%= grunt.template.today("yyyy-mm-dd") %>\n\
 * @author: <%= pkg.author %>\n\
 */\n';

    function addSrcPrefix(files) {
        for (var i = files.length - 1; i >= 0; i--) {
            files[i] = 'src/' + files[i];
        }
    }

    var files = [
        'head.js',
        'common.js', 'createLexer.js', 'lexer.js', 'parser.js', 
        'codegen_common.js', 'codegen_js.js', 'crox_js.js', 'codegen_php.js', 'codegen_vm.js', 
        'crox_extra.js',
        'tail.js'
    ];
    addSrcPrefix(files);

    var filesClean = [
        'head.js',
        'common.js', 'createLexer.js', 'lexer.js', 'parser.js', 
        'codegen_common.js', 'codegen_js.js', 'crox_js.js', 
        'tail.js'
    ];

    addSrcPrefix(filesClean);

    var pkg = grunt.file.readJSON('package.json');

    grunt.initConfig({
        pkg: pkg,

        clean: {
            build: {
                src: buildDir
            },
            options: {
                force: true
            }
        },

        uglify: {
            options: {
                banner: banner
            },
            dist_all: {
                files: {
                    'build/<%= pkg.name %>-all-min.js': ['<%= concat.dist_all.dest %>']  
                }
            },
            dist_clean: {
                files: {
                    'build/<%= pkg.name %>-min.js': ['<%= concat.dist_clean.dest %>']  
                }
            }
        },

        concat: {
            options: {  
                separator: '\n',
                banner: banner
            },
            dist_all: {
                src: files,
                dest: buildDir + '/<%= pkg.name %>-all.js'
            },
            dist_clean: {
                src: filesClean,
                dest: buildDir + '/<%= pkg.name %>.js'
            }
        },

        version: {
            files: [buildDir + '/*.js']
        }
    });

    grunt.registerMultiTask('version', 'replace version number in src', function() {
        var files = this.filesSrc;
        var version = pkg.version;

        console.log('[Crox] Current version of Crox is ' + version);
        files.forEach(function(f) {
            var content = grunt.file.read(f);
            if (content) {
                content = content.replace('%VERSION%', version);
                grunt.file.write(f, content);
            }
        })
    });

    grunt.loadTasks('tasks')

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-clean');

    grunt.registerTask('daily', ['addGitlab', 'pushGitlab:daily'])
    grunt.registerTask('deploy', ['addGitlab', 'pushGitlab:prod'])

    grunt.registerTask('build', ['clean', 'concat', 'uglify', 'version']);

    grunt.registerTask('default', ['build'])
}