var remapify = require('remapify');
var webpack = require('webpack');
var commonsPlugin = new webpack.optimize.CommonsChunkPlugin('common.js');
var dedupePlugin = new webpack.optimize.DedupePlugin();
var uglifyJsPlugin = new webpack.optimize.UglifyJsPlugin();
// var WebPackPostLoader = require(__dirname + '/lib/webPackPostLoader');

module.exports = function(grunt) {
    grunt.initConfig({
        watch: {
            sassMain: {
                files: [
                    'sass/**/*'
                ],
                tasks: ['sass:main'],
                options: {
                    nospawn: true
                }
            },
        },
        jsbeautifier: {
            files: [
            	'js/**/*.js'
            ],
            options: {}
        },
        'sass-convert': {
            options: {
                indent: 4
            },
            files: {
                //   cwd: ['path/to'],
                src: ['sass/**/*.scss'],
                dest: ''
            }
        },
        webpack: {
            clientJs: {
                // webpack options
                entry: {
                    main: "./js/app/main.js"
                },
                output: {
                    path: "../assets/js/",
                    filename: "[name].js",
                    publicPath: '/assets/js/'
                },
                devtool: '#source-map',
                stats: {
                    // Configure the console output
                    colors: true,
                    modules: false,
                    reasons: true
                },
                // stats: false disables the stats output
                cache: true,
                storeStatsTo: "xyz", // writes the status to a variable named xyz
                // you may use it later in grunt i.e. <%= xyz.hash %>

                progress: true, // Don't show progress
                // Defaults to true

                failOnError: false, // don't report error to grunt if webpack find errors
                // Use this if webpack errors are tolerable and grunt should continue

                watch: true, // use webpacks watcher
                // You need to keep the grunt process alive

                keepalive: true, // don't finish the grunt task
                // Use this in combination with the watch option
                resolve: {
                    extensions: ['', '.js'],
                    modulesDirectories: [__dirname + '/node_modules'],
                    alias: {
                        underscore: 'lodash'
                    },
                    unsafeCache: true
                },
                module: {
                    loaders: [{
                        test: /\.js$/,
                        loader: "transform/cacheable?brfs"
                    }, {
                        test: /\.swig$/,
                        loader: "swig-loader"
                    }, {
                        test: /\.html$/,
                        loader: "swig-loader"
                    }]
                },
                plugins: [dedupePlugin, commonsPlugin]
            },
            clientJsBuildMin: {
                // webpack options
                entry: {
                    main: "./js/app/main.js"
                },
                output: {
                    path: "../assets/js/",
                    filename: "[name].js",
                    publicPath: '/assets/js/'
                },
                // devtool: '#source-map',
                stats: {
                    // Configure the console output
                    colors: true,
                    modules: false,
                    reasons: true
                },
                // stats: false disables the stats output
                cache: true,
                storeStatsTo: "xyz", // writes the status to a variable named xyz
                // you may use it later in grunt i.e. <%= xyz.hash %>

                progress: true, // Don't show progress
                // Defaults to true

                failOnError: false, // don't report error to grunt if webpack find errors
                // Use this if webpack errors are tolerable and grunt should continue

                watch: false, // use webpacks watcher
                // You need to keep the grunt process alive

                keepalive: false, // don't finish the grunt task
                // Use this in combination with the watch option
                resolve: {
                    extensions: ['', '.js'],
                    modulesDirectories: [__dirname + '/node_modules'],
                    alias: {
                        // fs:
                        underscore: 'lodash'
                            // ,
                            // fs: 'brfs'
                    },
                    unsafeCache: true
                },
                module: {
                    loaders: [{
                        test: /\.js$/,
                        loader: "transform/cacheable?brfs"
                    }, {
                        test: /\.swig$/,
                        loader: "swig-loader"
                    }, {
                        test: /\.html$/,
                        loader: "swig-loader"
                    }]
                },
                plugins: [dedupePlugin, commonsPlugin, uglifyJsPlugin]
            }
        },
        cssmin: {
            target: {
                files: {
                    '../assets/css/screen.min.css': ['../assets/css/screen.css']
                }
            }
        },
        sass: {
            options: {
                sourceMap: true
            },
            main: {
                files: {
                    '../assets/css/screen.css': 'sass/site.scss'
                }
            }
        },
        jshint: {
            // Frontend
            all: {
                options: {
                    browserify: true,
                    globals: {
                        'window': true,
                        'log': true,
                        'trackEvent': true,
                        'console': true,
                        'FB': true,
                        'Modernizr': true
                    }
                },
                files: {
                    src: ['Gruntfile.js', 'js/app/**/*.js']
                }
            }
        },
        concurrent: {
            target: {
                tasks: ['webpack:clientJs', 'sass', 'watch'],
                options: {
                    logConcurrentOutput: true
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-concurrent');
    grunt.loadNpmTasks('grunt-webpack');
    grunt.loadNpmTasks('grunt-sass');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-jsbeautifier');
    grunt.loadNpmTasks('grunt-sass-convert');
    // grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.registerTask('default', ['concurrent']);
    grunt.registerTask('build', ['sass', 'webpack:clientJsBuild', 'cssmin']);
    grunt.registerTask('buildmin', ['sass', 'webpack:clientJsBuildMin', 'cssmin']);
    grunt.registerTask('beautify', ['jsbeautifier']);
    grunt.registerTask('cssBeautify', ["sass-convert"]);

};
