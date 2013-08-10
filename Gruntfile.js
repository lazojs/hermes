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
            src : 'src/**/*.js',
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
            }
        },
        concat: {
            options: {
                banner: "<%= meta.banner %>"
            },
            dev: {
                src: 'src/hermes.js',
                dest: 'hermes.js'
            }
        },
        jshint: {
            hermes : [ 'src/*.js' ]
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.registerTask('default', ['jshint', 'jasmine', 'uglify', 'concat']);
};