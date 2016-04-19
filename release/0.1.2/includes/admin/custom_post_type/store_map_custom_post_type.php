<?php

class Store_Custom_Post_Type 
{
    function __construct ()
    {
        $this->define_custom_post_type();
    }
    
    function define_custom_post_type() 
    {
    
        // Set UI labels for Custom Post Type
    	$labels = array(
    		'name'                => __( 'Store Map', 'Post Type General Name', 'store_map' ),
    		'singular_name'       => __( 'Stores Map', 'Post Type Singular Name', 'store_map' ),
    		'menu_name'           => __( 'Store Map', 'store_map' ),
    		'parent_item_colon'   => __( 'Parent Store', 'store_map' ),
    		'all_items'           => __( 'All stores', 'store_map' ),
    		'view_item'           => __( 'View Store', 'store_map' ),
    		'add_new_item'        => __( 'Store Name', 'store_map' ),
    		'add_new'             => __( 'Add', 'store_map' ),
    		'edit_item'           => __( 'Edit Store', 'store_map' ),
    		'update_item'         => __( 'Update Store', 'store_map' ),
    		'search_items'        => __( 'Search Store', 'store_map' ),
    		'not_found'           => __( 'Not Found', 'store_map' ),
    		'not_found_in_trash'  => __( 'Not found in Trash', 'store_map' ),
    	);
    	
        // Set other options for Custom Post Type
    	
    	$args = array(
    		'label'               => __( 'stores', 'store_map' ),
    		'description'         => __( 'Stores', 'store_map' ),
    		'labels'              => $labels,
    		// Features this CPT supports in Post Editor
    		'supports'            => array( 'title','editor'),
    		'hierarchical'        => false,
    		'public'              => false,
    		'show_ui'             => true,
    		'show_in_menu'        => true,
    		'show_in_nav_menus'   => false,
    		'show_in_admin_bar'   => false,
    		'menu_position'       => 5,
    		'menu_icon'           => 'dashicons-location-alt', 
    		'can_export'          => true,
    		'has_archive'         => false,
    		'exclude_from_search' => false,
    		'publicly_queryable'  => false,
    		'capability_type'     => 'page',
    	);
    	
    	// Registering your Custom Post Type
    	register_post_type( 'store_map_cpt', $args );
    }
}
