<?php

class Store_Map_Admin_Builder {
    
    
    /**
     * Constructeur
     * Cette fonction doit être appelé lors de l'init
     */
    function __construct ()
    {
        $this->define_custom_post_type();
        $this->customise_editor();
        //$this->add_import_page();
        $this->add_settings_page();
    }
    
    
    /**
     * Define custom post type
     */
    function define_custom_post_type(){
    	
    	include_once(store_map_PATH."includes/admin/custom_post_type/store_map_custom_post_type.php");
    	$admin_menu = new Store_Custom_Post_Type ();
    }
    
    
    /**
     * 
     */
    function customise_editor(){
    	
    	include_once(store_map_PATH."includes/admin/custom_post_type/store_map_customise_post_editor.php");
    	$admin_menu = new Store_Map_Customise_Post_Editor ();
    }
    
    /**
     * 
     */
    function add_import_page(){
    	
    	include_once(store_map_PATH."includes/admin/import_page/import_page.php");
    	$admin_menu = new Store_Map_Import_Page ();
    }
    
     /**
     * 
     */
    function add_settings_page(){
    	
    	include_once(store_map_PATH."includes/admin/settings_page/settings_page.php");
    	$admin_menu = new Store_Map_Settings_Page ();
    }
    
    
    
}