module.exports = function (grunt) {
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');

    grunt.initConfig({
        clean: ['wwwroot/assets/'],

        concat: {
            global: {
                files: {
                    'wwwroot/assets/js/global.min.js': [
                        'Assets/js/angular.js',
                        'Assets/js/angular-resource.js',
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
                        'Assets/ace/js/ace-settings.js',
                        'Assets/js/date-time/bootstrap-datepicker.js',
                        'Assets/js/date-time/bootstrap-timepicker.js',
                        'Assets/js/date-time/daterangepicker.js',
                        'Assets/js/bootstrap.min.js',
                        'Assets/js/date-time/moment.js',
                        'Assets/js/date-time/bootstrap-datetimepicker.js'
                    ],
                    'wwwroot/assets/js/app.js': [
                        'Assets/js/app.js',
                        'Areas/User/Assets/js/UserController.js',
                        'Areas/User/Assets/js/LoginController.js',
                        'Areas/Shipment/Assets/js/PickupRequestController.js',
                        'Areas/Shipment/Assets/js/TrackingRequestController.js'

                    ],
                    'wwwroot/assets/js/DataTable.js': ['Assets/ace/js/dataTables/jquery.dataTables.js',
                        'Assets/ace/js/dataTables/extensions/TableTools/js/dataTables.tableTools.js',
                        'Assets/ace/js/dataTables/extensions/ColVis/js/dataTables.colVis.js']
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
                        'Assets/ace/css/datepicker.css',
                        'Assets/ace/css/bootstrap-timepicker.css',
                        'Assets/ace/css/daterangepicker.css',
                        'Assets/ace/css/bootstrap-datetimepicker.css',
                        'Assets/ace/css/font-awesome.css',
                        'Assets/ace/css/ace-fonts.css',
                        'Assets/ace/css/ace.css']
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
                files: ['Assets/ace/js/*.js', 'Assets/ace/js/ace/*.js', 'Assets/js/*.js', 'Areas/*/Assets/js/*'],
                tasks: ['concat']
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