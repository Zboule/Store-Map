<?php
/**
 * Plugin Name: Store Map
 * Plugin URI:  http://wordpress.org/plugins
 * Description: Simple liste of store on the map
 * Version:     0.1.0
 * Author:      Jordane CURE
 * Author URI:  
 * License:     GPLv2+
 * Text Domain: store_map
 * Domain Path: /languages
 */

/**
 * Copyright (c) 2016 Jordane CURE (email : jordane.cure@gmail.com)
 *
 * This program is free software; you can redistribute it and/or modify
 * it under the terms of the GNU General Public License, version 2 or, at
 * your discretion, any later version, as published by the Free
 * Software Foundation.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin St, Fifth Floor, Boston, MA  02110-1301  USA
 */


/**
 * Built using grunt-wp-plugin
 * Copyright (c) 2016 10up, LLC
 * https://github.com/10up/grunt-wp-plugin
 */

// Useful global constants
define( 'store_map_VERSION', '0.1.0' );
define( 'store_map_URL',     plugin_dir_url( __FILE__ ) );
define( 'store_map_PATH',    dirname( __FILE__ ) . '/' );


/**
 * Default initialization for the plugin:
 * - Registers the default textdomain.
 * - Register scripts and styles
 * - Load admin menu creation
 */
function store_map_init() {
	
	// $locale = apply_filters( 'plugin_locale', get_locale(), 'store_map' );
	// load_textdomain( 'store_map', WP_LANG_DIR . '/store_map/store_map-' . $locale . '.mo' );
	
	load_plugin_textdomain( 'store_map', false, dirname( plugin_basename( __FILE__ ) ) . '/languages/' );

		
	include_once(store_map_PATH."includes/store_map_core.php");
	$storeMap = new Store_Map_Core ();
	
	error_log("test");
	
}
add_action( 'init', 'store_map_init' );



/**
 * Activate the plugin
 */
function store_map_activate() {
	// First load the init scripts in case any rewrite functionality is being loaded
	store_map_init();

	flush_rewrite_rules();
}
register_activation_hook( __FILE__, 'store_map_activate' );












