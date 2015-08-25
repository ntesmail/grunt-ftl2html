module.exports = function(grunt) {
    // load all tasks
    require('load-grunt-tasks')(grunt);

    var appConfig = {
        app: 'src/main/webapp',
        product: 'ftl2html',
        dist: 'build',
        mimgURLPrefix: {
            develop: 'http://localhost/hxm',
            online: 'http://mimg.127.net/hxm',
            test: 'http://mimg.hztest.mail.163.com/hxm'
        }
    };
    // static的版本路径
    appConfig.staticPath = '/' + appConfig.product + '/p/20150510';
    // app的发布目录
    appConfig.appDist = appConfig.dist + '/' + appConfig.product;
    // static的发布目录
    appConfig.staticDist = appConfig.dist + '/static' + appConfig.staticPath;

    grunt.initConfig({
        // watch files
        watch: {
            compass: {
                files: ['src/main/webapp/style/scss/**/{,*/}*.{scss,sass}'],
                tasks: ['compass:server']
            },
            livereload: {
                options: {
                    livereload: '<%= connect.options.livereload %>'
                },
                files: [
                    'src/main/webapp/**/{,*/}*.html',
                    'src/main/webapp/**/{,*/}*.ftl',
                    'src/main/webapp/js/**/{,*/}*.js',
                    'src/main/webapp/style/css/**/{,*/}*.css',
                    'src/main/webapp/style/img/**/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
                ]
            }
        },

        // Compiles Sass to CSS and generates necessary files if requested
        compass: {
            options: {
                sassDir: 'src/main/webapp/style/scss',
                cssDir: 'src/main/webapp/style/css',
                relativeAssets: false,
                assetCacheBuster: false,
                raw: 'Sass::Script::Number.precision = 10\nEncoding.default_external = "utf-8"\n'
            },
            server: {
                options: {
                    sourcemap: true
                }
            }
        },
        // The actual grunt server settings
        connect: {
            options: {
                port: 9000,
                // Change this to '0.0.0.0' to access the server from outside.
                hostname: 'localhost',
                livereload: 35129
            },
            livereload: {
                options: {
                    open: 'http://localhost:9000/demo/',
                    middleware: function(connect, options) {
                        var ftl2html = require('./index');
                        // ftl
                        var middlewares = [
                            ftl2html.ftl2html({
                                configFile: 'src/test/mock/project_config.cfg'
                            }),
                            connect().use(
                                '/style',
                                connect.static('src/main/webapp/style')
                            ),
                            connect().use(
                                '/js',
                                connect.static('src/main/webapp/js')
                            ),
                            connect().use(
                                '/xhr',
                                ftl2html.static('src/test/mock/xhr')
                            ),
                            connect.static(appConfig.app)
                        ];

                        return middlewares;
                    }
                }
            }
        }
    });

    grunt.registerTask('default', ['connect:livereload', 'watch']);

    grunt.registerTask('convert', 'ftl to html', function(){
        var ftl2html = require('./index');
        ftl2html.convert('src/test/mock/ftl2html.cfg', 'http://localhost/test1-test.html', '');
        ftl2html.convert('src/test/mock/ftl2html.cfg', 'http://localhost/main-test.html', '');
    });
};
