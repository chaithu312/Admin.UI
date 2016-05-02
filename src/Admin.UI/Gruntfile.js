/*
This file in the main entry point for defining grunt tasks and using grunt plugins.
Click here to learn more. http://go.microsoft.com/fwlink/?LinkID=513275&clcid=0x409
*/
module.exports = function (grunt) {
    grunt.initConfig({
        clean: ["wwwroot/lib/*", "temp/"]
    });
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-concat');

    grunt.initConfig({
        clean: ['wwwroot/assets/js'],

        concat: {
            global: {
                files: {
                    'wwwroot/assets/js/ace.min.js': [
                        'Assets/ace/js/ace-extra.js',
                        'Assets/ace/js/ace/elements.scroller.js',
                        'Assets/ace/js/ace/elements.colorpicker.js',
                        'Assets/ace/js/ace/elements.fileinput.js',
                        'Assets/ace/js/ace/elements.typeahead.js',
                        'Assets/ace/js/ace/elements.wysiwyg.js',
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
                        'Assets/ace/js/ace-settings.js'
                    ]
                }
            },
            sparkline: {
                files: {
                    'wwwroot/assets/js/jquery.sparkline.min.js': [
                      'Assets/ace/js/jquery.sparkline.js'
                    ]
                }
            },

            flot: {
                files: {
                    'wwwroot/assets/js/jquery.flot.min.js': [
                      'Assets/ace/js/jquery.flot.js',
                      'Assets/ace/js/jquery.flot.pie.js',
                      'Assets/ace/js/jquery.flot.resize.js'
                    ]
                }
            },
            easypiechart: {
                files: {
                    'wwwroot/assets/js/jquery.easypiechart.min.js': [
                      'Assets/ace/js/jquery.easypiechart.js'
                    ]
                }
            },

            Fuelux: {
                files: {
                    'wwwroot/assets/js/Fuelux.min.js': [
                        'Assets/ace/js/fuelux/fuelux.spinner.js'
                    ]
                }
            },
            Datetime: {
                files: {
                    'wwwroot/assets/js/bootstrap.datetime.min.js': [
                      'Assets/ace/js/date-time/bootstrap-datepicker.js',
                      'Assets/ace/js/date-time/daterangepicker.js',
                      'Assets/ace/js/date-time/bootstrap-timepicker.js'

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

            AdminUIGlobal: {
                files: {
                    'wwwroot/assets/js/AdminUI.Global.min.js': [
                        'Assets/js/AdminUI/AlertMessage.js',
                        'Assets/js/AdminUI/SaveReset.js',
                        'Assets/js/AdminUI/pickup.js']
                }
            }
        },

        cssmin: {
            global: {
                files: {
                    'wwwroot/assets/css/global.min.css': [
                        'Assets/ace/css/ace-fonts.css',
                        'Assets/ace/css/ace.css'
                    ]
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
                ]
            },

            avatars: {
                files: [
                    { expand: true, cwd: 'Assets/ace/avatars/', src: ['**'], dest: 'wwwroot/assets/avatars/' }
                ]
            },

            PickupList: {
                files: {
                    'wwwroot/assets/js/PickupList.js': [
                        'Assets/js/AdminUI/pickupList.js'
                    ]
                }
            },

            ShipmentList: {
                files: {
                    'wwwroot/assets/js/ShipmentList.js': [
                        'Assets/js/AdminUI/ShipmentList.js'
                    ]
                }
            },

            Pickup: {
                files: {
                    'wwwroot/assets/js/Pickup.js': [
                        'Assets/js/AdminUI/pickup.js'
                    ]
                }
            }
        },

        watch: {
            scripts: {
                files: ['Assets/ace/js/*.js', 'Assets/ace/js/ace/*.js', 'Assets/js/*.js', 'Areas/*/Assets/js/*'],
                tasks: ['concat']
            },
            styles: {
                files: ['Assets/ace/css/*.css'],
                tasks: ['cssmin']
            }
        },

        uglify: {
            global: {
                files: {
                    'wwwroot/assets/js/ace.min.js': [
                        'Assets/ace/js/ace-extra.js',
                        'Assets/ace/js/ace/elements.scroller.js',
                        'Assets/ace/js/ace/elements.colorpicker.js',
                        'Assets/ace/js/ace/elements.fileinput.js',
                        'Assets/ace/js/ace/elements.typeahead.js',
                        'Assets/ace/js/ace/elements.wysiwyg.js',
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
                        'Assets/ace/js/ace-settings.js'
                    ]
                }
            },
            sparkline: {
                files: {
                    'wwwroot/assets/js/jquery.sparkline.min.js': [
                      'Assets/ace/js/jquery.sparkline.js'
                    ]
                }
            },

            flot: {
                files: {
                    'wwwroot/assets/js/jquery.flot.min.js': [
                      'Assets/ace/js/jquery.flot.js',
                      'Assets/ace/js/jquery.flot.pie.js',
                      'Assets/ace/js/jquery.flot.resize.js'
                    ]
                }
            },
            easypiechart: {
                files: {
                    'wwwroot/assets/js/jquery.easypiechart.min.js': [
                      'Assets/ace/js/jquery.easypiechart.js'
                    ]
                }
            },

            Fuelux: {
                files: {
                    'wwwroot/assets/js/Fuelux.min.js': [
                        'Assets/ace/js/fuelux/fuelux.spinner.js'
                    ]
                }
            },
            Datetime: {
                files: {
                    'wwwroot/assets/js/bootstrap.datetime.min.js': [
                      'Assets/ace/js/date-time/bootstrap-datepicker.js',
                      'Assets/ace/js/date-time/daterangepicker.js',
                      'Assets/ace/js/date-time/bootstrap-timepicker.js'

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

            AdminUIGlobal: {
                files: {
                    'wwwroot/assets/js/AdminUI.Global.min.js': [
                        'Assets/js/AdminUI/AlertMessage.js',
                        'Assets/js/AdminUI/SaveReset.js',
                        'Assets/js/AdminUI/pickup.js']
                }
            }
        }
    });
};