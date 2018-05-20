module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                files: [{
                    expand: true,
                    src: '**/*.js',
                    dest: 'build/javascripts',
                    cwd: 'src/javascripts',
                    ext: '.min.js'
                }]
            }
        },
        cssmin: {
            target: {
                files: [{
                    expand: true,
                    cwd: 'src/stylesheets/',
                    src: ['*.css', '!*.min.css'],
                    dest: 'build/stylesheets',
                    ext: '.min.css'
                }]
            }
        },
        prettify: {
            options: {
                config: '.prettifyrc'
            },
            all: {
                expand: true,
                cwd: 'src/',
                ext: '.html',
                src: ['*.html'],
                dest: 'build/'
            }
        },
        replace: {
            dist: {
                options: {
                    patterns: [{
                            match: /(stylesheets\/main\.css)/g,
                            replacement: 'stylesheets/main.min.css'
                        },
                        {
                            match: /(javascripts\/templates\/hbs-head\.js)/g,
                            replacement: 'javascripts/templates/hbs-head.min.js'
                        },
                        {
                            match: /(javascripts\/templates\/hbs-body\.js)/g,
                            replacement: 'javascripts/templates/hbs-body.min.js'
                        },
                        {
                            match: /(javascripts\/main\.js)/g,
                            replacement: 'javascripts/main.min.js'
                        }
                    ]
                },
                files: [{
                    expand: true,
                    flatten: true,
                    src: ['build/index.html'],
                    dest: 'build/'
                }]
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-prettify');
    grunt.loadNpmTasks('grunt-replace');

    grunt.registerTask('default', ['uglify', 'cssmin', 'prettify', 'replace']);
};