module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');

    grunt.initConfig({
        clean: ['wwwroot/assets/'],

        uglify: {
            global: {
                files: {
                    'wwwroot/assets/js/global.min.js': [
                        'Assets/js/angular.js',
                        'Assets/js/angular-resource.js',
                        'Assets/js/angular-app.js',
                        'Assets/ace/js/bootstrap.js',
                        'Assets/ace/js/ace-extra.js',
                        'Assets/ace/js/ace/elements.scroller.js',
                        'Assets/ace/js/ace/elements.colorpicker.js',
                        'Assets/ace/js/ace/elements.fileinput.js',
                        'Assets/ace/js/ace/elements.typeahead.js',
                        'Assets/ace/js/ace/elements.wysiwyg.js',
                        'Assets/ace/js/ace/elements.spinner.js',
                        'Assets/ace/js/ace/elements.treeview.js',
                        'Assets/ace/js/ace/elements.wizard.js',
                        'Assets/ace/js/ace/elements.aside.js',
                        'Assets/ace/js/ace/ace.js',
                        'Assets/ace/js/ace/ace.ajax-content.js',
                        'Assets/ace/js/ace/ace.touch-drag.js',
                        'Assets/ace/js/ace/ace.sidebar.js',
                        'Assets/ace/js/ace/ace.sidebar-scroll-1.js',
                        'Assets/ace/js/ace/ace.submenu-hover.js',
                        'Assets/ace/js/ace/ace.widget-box.js',
                        'Assets/ace/js/ace/ace.settings.js',
                        'Assets/ace/js/ace/ace.settings-rtl.js',
                        'Assets/ace/js/ace/ace.settings-skin.js',
                        'Assets/ace/js/ace/ace.widget-on-reload.js',
                        'Assets/ace/js/ace/ace.searchbox-autocomplete.js',
                        'Assets/js/ace-settings.js'
                       ]
                }
            },
            ie8: {
                files: {
                    'wwwroot/assets/js/ie8.min.js': [
                        'Assets/ace/js/html5shiv.js',
                        'Assets/ace/js/respond.js']
                }
            },
            jquery: {
                files: {
                    'wwwroot/assets/js/jquery.min.js': [
                        'Assets/ace/js/jquery.js'
                    ]
                }
            },
            jquery_ie: {
                files: {
                    'wwwroot/assets/js/jquery1x.min.js': [
                        'Assets/ace/js/jquery1x.js'
                    ]
                }
            },
            jquery_mobile: {
                files: {
                    'wwwroot/assets/js/jquery.mobile.custom.min.js': [
                        'Assets/ace/js/jquery.mobile.custom.js'
                    ]
                }
            }
        },

        cssmin: {
            global: {
                files: {
                    'wwwroot/assets/css/global.min.css': [
                        'Assets/ace/css/bootstrap.css',
                        'Assets/ace/css/font-awesome.css',
                        'Assets/ace/css/ace-fonts.css',
                        'Assets/ace/css/ace.css' ]
                }
            },
            ie9: {
                files: {
                    'wwwroot/assets/css/ie9.min.css': [
                        'Assets/ace/css/ace-part2.css',
                        'Assets/ace/css/ace-ie9.css']
                }
            }
        },

        copy: {
            fonts: {
                files: [
                    { expand: true, cwd: 'Assets/ace/fonts/', src: ['**'], dest: 'wwwroot/assets/fonts/' }
                ],
            },
            avatars: {
                files: [
                    { expand: true, cwd: 'Assets/ace/avatars/', src: ['**'], dest: 'wwwroot/assets/avatars/' }
                ],
            },
        },

        watch: {
            scripts: {
                files: ['Assets/ace/js/*.js', 'Assets/ace/js/ace/*.js', 'Assets/js/*.js'],
                tasks: ['uglify']
            }, 
            styles: {
                files: ['Assets/ace/css/*.css'],
                tasks: ['cssmin']
            },
            styles: {
                files: ['Assets/ace/fonts/*.*'],
                tasks: ['copy']
            }
        }
    });

    grunt.registerTask('default', ['clean', 'uglify', 'cssmin', 'copy', 'watch']);
    grunt.registerTask('doAll', ['uglify', 'cssmin', 'copy']);
};