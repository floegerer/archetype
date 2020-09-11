module.exports = function (grunt) {


  // Start Grunt


  require('load-grunt-tasks')(grunt);
  grunt.loadNpmTasks('grunt-express');
  grunt.loadNpmTasks('grunt-project-structure');

  var pkg = grunt.file.readJSON('package.json');
  var getfiletree = require("./core/modules/getfiletree");
  var importless = require("./core/modules/importless");
  var replace = require('replace-in-file');


  // Grunt Config


  grunt.initConfig({


    project_structure: {
      default: {
        options: {
          root: './projects/<%= project %>/pages/',
          writeJSON: true,
          outputJSON: './projects/<%= project %>/config/pages.json',
          filesArrayJSON: 'pages'
        }
      }
    },


    config: {
      project: '-'
    },


    express: {
      server: {
        options: {
          server: 'index.js',
          showStack: false,
          port: 8080,
          bases: ['core', 'projects'],
          livereload: false,
          hostname: '0.0.0.0'
        }
      }
    },


    less: {
      dev: {
        options: {
          sourceMap: true,
          sourceMapFilename: 'projects/<%= project %>/src/css/main.map',
          sourceMapURL: '/css/main.map',
          sourceMapBasepath: '',
          sourceMapRootpath: '/',
          ieCompat: false,
          compress: false,
          optimization: null
        },
        files: {
          'projects/<%= project %>/src/css/main.css': 'projects/<%= project %>/theme/theme.less'
        }
      }
    },


    watch: {


      less: {
        options: {
          interval: 100,
          debounceDelay: 1,
          interrupt: true,
          spawn: false
        },
        files: [
          './core/components/**/*.less',
          './projects/<%= project %>/**/*.less'
        ],
        tasks: ['finalize','less']
      },


      pages: {
        options: {
          interval: 100,
          debounceDelay: 1,
          interrupt: false,
          spawn: true
        },
        files: [
          'projects/<%= project %>/pages/*.ejs'
        ],
        tasks: ['pages:<%= project %>']
      }
    },


    copy: {
      main: {
        files: [
          {
            expand: true,
            cwd: 'projects/default/',
            src: ['**'],
            dest: 'projects/<%= project %>'
          }
        ],
      }
    },


    clean: ['projects/<%= project %>']


  });


  // Grunt Default Task


  grunt.registerTask('default', ['express', 'importless', 'less', 'finalize', 'project_structure', 'watch' ]);


  // Grunt Custom Tasks


  grunt.registerTask('finalize', 'Add lines', function () {

    console.log("\n----");

  });


  // Grunt Custom Tasks


  grunt.registerTask('pages', 'Reload pages', function (project) {


    if (typeof (project) === 'undefined') project = global.project;
    var pagepath = './projects/' + project + '/pages/';
    global.filetree = getfiletree.filetree(pagepath);


  });


  // Grunt Custom Tasks


  grunt.registerTask('regex', 'Replace vars in files', function (project) {


    if (typeof (project) === 'undefined') project = global.project;
    var filepath = './projects/' + project + '/theme/';


      var options = {

        files: [
          filepath + '/**/*.less'
        ],

        //Replacement to make (string or regex)
        from: /\$\{.*\}/g,
        to: '',

        //Specify if empty/invalid file paths are allowed (defaults to false)
        //If set to true these paths will fail silently and no error will be thrown.
        allowEmptyPaths: true,

        //Character encoding for reading/writing files (defaults to utf-8)
        encoding: 'utf8',
      };

      try {

        var changedFiles = replace.sync(options);
        console.log('Modified files:', changedFiles.join(', '));

      } catch (error) {

        console.error('Error occurred:', error);

      }

  });


  // Grunt Custom Tasks


  grunt.registerTask('importless', 'Import less files in folders', function (project) {


    if (typeof (project) === 'undefined') project = global.project;
    var projectdir = './projects/' + project;
    var lesslist = importless.lessfiles(projectdir);


  });


  // Choose Project


  grunt.registerTask('project', function (project) {


    console.log("\n----");
    global.project = project;
    grunt.config.set('project', project);
    grunt.config.process('project');
    grunt.task.run('default');


  });


  // Create Project


  grunt.registerTask('create', function (project) {


    global.project = project;
    grunt.config.set('project', project);
    grunt.config.process('project');
    grunt.task.run('copy');
    grunt.task.run('default');


  });


  // Delete Project


  grunt.registerTask('delete', function (project) {


    global.project = project;
    grunt.config.set('project', project);
    grunt.config.process('project');
    grunt.task.run('clean');


  });


  // End Gruntfile

};
