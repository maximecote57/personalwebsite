module.exports = function(grunt) {

    // Timer to know how much time a task takes
    require('time-grunt')(grunt);
    // Load the necessary plugins
    require('load-grunt-tasks')(grunt);
    
    // Project configuration.
    grunt.initConfig({

        // Main configuration
        pkg: grunt.file.readJSON('package.json'),

        // Compiles the less files to css and minifies them
        less: {
            minify: {
                options: {
                    cleancss: true,
                    paths: 'css'
                },
                files: {
                    'css/main.min.css': 'css/main.less',
                }
            }
        },

        // Calls tasks and refreshes the browser each time a watched file is saved
        watch: {
            options: {
                livereload: true
            },
            less: {
                options: {
                    livereload: false,
                },
                files: ['css/*.less', '!css/main.min.css'],
                tasks: ['less']
            },
            js: {            
                files: ['js/main.js'],
                tasks: ['uglify']
            },
            index: {                
                files: ['index.php', 'views/*.html'],
            },
            css: {
                files: ['css/main.min.css']
            }
        },

        uglify: {
            options: {
                compress: {
                    drop_debugger: false
                }
            },
            dist: {
                files: {
                    'js/main.min.js': ['js/main.js']
                }
            }
        }

    });

    grunt.registerTask('build', ['less','uglify']);
      
};