module.exports = function (grunt) {

    'use strict';

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        meta: {
            version: '<%= pkg.version %>',
            banner: '// HERMES, sweet llamas of the bahamas\n' +
            '// ----------------------------------\n' +
            '// v<%= pkg.version %>\n' +
            '//\n' +
            '// Copyright (c)<%= grunt.template.today("yyyy") %> Jason Strimpel\n' +
            '// Distributed under MIT license\n'
        },
        jasmine : {
            src : 'src/hermes.js',
            options : {
                specs : 'spec/**/*.js',
                template : require('grunt-template-jasmine-istanbul'),
                templateOptions: {
                    coverage: 'reports/coverage.json',
                    report: 'reports/coverage'
                }
            }
        },
        uglify: {
            options: {
                banner: "<%= meta.banner %>"
            },
            prod: {
                src: 'src/hermes.js',
                dest: 'hermes.min.js'
            },
            amd: {
                src: 'hermes.amd.js',
                dest: 'hermes.amd.min.js'
            }
        },
        concat: {
            options: {
                banner: "<%= meta.banner %>"
            },
            dev: {
                src: 'hermes.js',
                dest: 'hermes.js'
            },
            'amd-dev': {
                src: 'hermes.amd.js',
                dest: 'hermes.amd.js'
            }
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            hermes: [ 'src/*.js' ]
        },
        preprocess: {
            amd: {
                files: {
                    'hermes.amd.js': 'src/hermes.amd.js'
                }
            },
            global: {
                files: {
                    'hermes.js': 'src/hermes.window.js'
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-preprocess');
    grunt.registerTask('default', ['jshint', 'jasmine', 'preprocess:amd', 'preprocess:global', 'concat:amd-dev', 'uglify:prod', 'uglify:amd', 'concat:dev']);
};