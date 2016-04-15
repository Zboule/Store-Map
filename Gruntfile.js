module.exports = function( grunt ) {

	// Project configuration
	grunt.initConfig( {
		pkg:    grunt.file.readJSON( 'package.json' ),
		concat: {
			options: {
				stripBanners: true,
				banner: '/*! <%= pkg.title %> - v<%= pkg.version %>\n' +
					' * <%= pkg.homepage %>\n' +
					' * Copyright (c) <%= grunt.template.today("yyyy") %>;' +
					' * Licensed GPLv2+' +
					' */\n'
			},
			store_map: {
				src: [
					'assets/js/src/store_map_front_end.js',
					'assets/js/src/lib/store_map_google_map.js'
				],
				dest: 'assets/js/store_map_front_end.js'
			},
			
			store_map_admin: {
				src: [
					'assets/js/src/store_map_admin_upload_cvs.js',
					'assets/js/src/lib/store_map_coordonate_from_adresse.js'
				],
				dest: 'assets/js/store_map_admin_upload_cvs.js'
			},
			
			store_map_admin_edit: {
				src: [
					'assets/js/src/store_map_cpt_edit.js',
					'assets/js/src/lib/store_map_google_map.js',
					'assets/js/src/lib/store_map_coordonate_from_adresse.js'
				],
				dest: 'assets/js/store_map_cpt_edit.js'
			}
		},
		jshint: {
			all: [
				'Gruntfile.js',
				'assets/js/src/**/*.js',
				'assets/js/test/**/*.js'
			],
			options: {
				curly:   true,
				eqeqeq:  true,
				immed:   true,
				latedef: false,
				newcap:  true,
				noarg:   true,
				sub:     true,
				undef:   true,
				boss:    true,
				eqnull:  true,
				globals: {
					exports: true,
					module:  false
				}
			}		
		},
		uglify: {
			all: {
				files: {
					'assets/js/store_map_front_end.min.js': ['assets/js/store_map_front_end.js'],
					'assets/js/store_map_admin_upload_cvs.min.js': ['assets/js/store_map_admin_upload_cvs.js'],
					'assets/js/store_map_cpt_edit.min.js': ['assets/js/store_map_cpt_edit.js']
				},
				options: {
					banner: '/*! <%= pkg.title %> - v<%= pkg.version %>\n' +
						' * <%= pkg.homepage %>\n' +
						' * Copyright (c) <%= grunt.template.today("yyyy") %>;' +
						' * Licensed GPLv2+' +
						' */\n',
					mangle: {
						except: ['jQuery']
					}
				}
			}
		},
		test:   {
			files: ['assets/js/test/**/*.js']
		},
		
		sass:   {
			all: {
				files: {
					'assets/css/store_map.css': 'assets/css/sass/store_map.scss',
					'assets/css/store_map_admin.css': 'assets/css/sass/store_map_admin.scss'
				}
			}
		},
		
		cssmin: {
			options: {
				banner: '/*! <%= pkg.title %> - v<%= pkg.version %>\n' +
					' * <%= pkg.homepage %>\n' +
					' * Copyright (c) <%= grunt.template.today("yyyy") %>;' +
					' * Licensed GPLv2+' +
					' */\n'
			},
			minify: {
				expand: true,
				
				cwd: 'assets/css/',				
				src: ['store_map.css'],
				
				dest: 'assets/css/',
				ext: '.min.css'
			}
		},
		watch:  {
			
			sass: {
				files: ['assets/css/sass/*.scss'],
				tasks: ['sass', 'cssmin'],
				options: {
					debounceDelay: 500
				}
			},
			
			scripts: {
				files: ['assets/js/src/**/*.js', 'assets/js/vendor/**/*.js'],
				tasks: ['jshint', 'concat', 'uglify'],
				options: {
					debounceDelay: 500
				}
			},
			
			php: {
				files: [ '**/*.php' ], //Parse all php files 
				task: ['pot'],
				options: {
					debounceDelay: 500
				}
			}
			
			
		},
		clean: {
			main: ['release/<%= pkg.version %>']
		},
		copy: {
			// Copy the plugin to a versioned release directory
			main: {
				src:  [
					'**',
					'!node_modules/**',
					'!release/**',
					'!.git/**',
					'!.sass-cache/**',
					'!css/src/**',
					'!js/src/**',
					'!img/src/**',
					'!Gruntfile.js',
					'!package.json',
					'!.gitignore',
					'!.gitmodules'
				],
				dest: 'release/<%= pkg.version %>/'
			}		
		},
		compress: {
			main: {
				options: {
					mode: 'zip',
					archive: './release/store_map.<%= pkg.version %>.zip'
				},
				expand: true,
				cwd: 'release/<%= pkg.version %>/',
				src: ['**/*'],
				dest: 'store_map/'
			}		
		},
		
		makepot: {
	        target: {
	            options: {
	                type: 'wp-plugin',
	                 exclude: ['release/','node_modules/','git/','sass-cache/'],         
	            }
	        }
	    }
  
	} );
	
	// Load other tasks
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	
	grunt.loadNpmTasks('grunt-contrib-sass');
	
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks( 'grunt-contrib-clean' );
	grunt.loadNpmTasks( 'grunt-contrib-copy' );
	grunt.loadNpmTasks( 'grunt-contrib-compress' );
	
	grunt.loadNpmTasks( 'grunt-wp-i18n' );
	
	// Default task.
	
	grunt.registerTask( 'default', ['jshint', 'concat', 'uglify', 'sass', 'cssmin'] );

	grunt.registerTask( 'build', ['default', 'clean', 'copy', 'compress'] );


	grunt.util.linefeed = '\n';
};