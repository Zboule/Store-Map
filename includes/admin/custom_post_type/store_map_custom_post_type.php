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
    		'name'                => __( 'Store Map', 'Post Type General Name', 'twentythirteen' ),
    		'singular_name'       => __( 'Stores Map', 'Post Type Singular Name', 'twentythirteen' ),
    		'menu_name'           => __( 'Store Map', 'twentythirteen' ),
    		'parent_item_colon'   => __( 'Parent Movie', 'twentythirteen' ),
    		'all_items'           => __( 'Toutes les boutiques', 'twentythirteen' ),
    		'view_item'           => __( 'View Movie', 'twentythirteen' ),
    		'add_new_item'        => __( 'Nom de la boutique', 'twentythirteen' ),
    		'add_new'             => __( 'Ajouter', 'twentythirteen' ),
    		'edit_item'           => __( 'Edit Movie', 'twentythirteen' ),
    		'update_item'         => __( 'Update Movie', 'twentythirteen' ),
    		'search_items'        => __( 'Search Movie', 'twentythirteen' ),
    		'not_found'           => __( 'Not Found', 'twentythirteen' ),
    		'not_found_in_trash'  => __( 'Not found in Trash', 'twentythirteen' ),
    	);
    	
        // Set other options for Custom Post Type
    	
    	$args = array(
    		'label'               => __( 'movies', 'twentythirteen' ),
    		'description'         => __( 'Movie news and reviews', 'twentythirteen' ),
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
