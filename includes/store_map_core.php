<?php

class Store_Map_Core
{
    /**
     * Constructeur
     * Must be call during init of wordpress
     */
    function __construct ()
    {
        $this->setup_admin();
         
        $this->register_scripts_styles ();
        
        $this->define_shortcode ();
    }
    
    
    /**
     * Register styles and scripts
     * Allow to enqueue them in the short code declaration function
     */
    function register_scripts_styles ()
    {
    	add_action( 'wp_enqueue_scripts', function (){
    	    
    	    wp_register_script( 'store_map_google_map_api', 'https://maps.googleapis.com/maps/api/js');
        	wp_register_script( 'store_map_store_map', store_map_URL.'assets/js/store_map_front_end.js',['store_map_google_map_api'],"1.0",true);
        	
        	wp_register_style ( 'store_map_style', store_map_URL.'assets/css/store_map.css');
        	
    	});
    }
    

    /**
     * Add the shortcode
     */
    function define_shortcode( ){
        
        add_shortcode( 'store_map', function (){
         
            include_once(store_map_PATH."includes/visitor/store_map_shortcode.php");
        	$store_map = new Store_Map ();
        	return $store_map->get_html_output();
            
        });
    }
    
    
    /**
     * Setup the admin menu
     */
    function setup_admin(){
    	
    	include_once(store_map_PATH."includes/admin/store_map_admin_builder.php");
    	$admin = new Store_Map_Admin_Builder ();
    }
        

}