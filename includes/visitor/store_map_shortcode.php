<?php

class Store_Map {
    
    
    /**
     * Constructeur
     */
    function __construct ()
    {
        $this->add_script_and_styles ();
        $storeData = $this->get_store_data_as_array ();
        $this->send_store_data($storeData);
        
        $this->send_store_option();
    }
    
     /**
     * Génére le html du shortcode
     */
    function get_html_output ()
    {
        $html_output;
        
        ob_start();
        ?>
        
            <div id="store_map_container">
            
                <div id="store_map_recherche">
                    <input type="search" id="store_map_search_input" placeholder="Concesisionaire à proximité" >
                    <input type="button" id="store_map_search_button" value= "Recherche">
                    <input type="button" id="store_map_my_position_button" value= "Trouver le plus proche">
                </div>
                
                <div id="store_map_liste">
                
                </div>
                
                <div id="store_map_map">
                    
                </div>
                
            </div>
        
        <?php
        return ob_get_clean();
    }
    
    
    /**
     * Ajouter les scripts et les styles nécessaires
     * Les styles et les script sont register dans store_map.php
     */
    private function add_script_and_styles ()
    {
        wp_enqueue_style ("store_map_style");

        wp_enqueue_script ("store_map_store_map");
        wp_enqueue_script ("store_map_google_map");
    }
    
    
    private function send_store_option ()
    {
        $store_options = [];
        $store_options ["marker_icone_url"] = get_option('store_map_global_marker_icone_url');
        wp_localize_script( 'store_map_store_map', "store_map_options", $store_options );
    }
    
    
    private function send_store_data ($data)
    {
        wp_localize_script( 'store_map_store_map', "store_map_data", $data );
    }
    
    
    private function get_store_data_as_array ()
    {
        $store_data_as_array = [];
        
        $args=array(
            'post_type' => 'store_map_cpt',
            'post_status' => 'publish',
            'posts_per_page' => '1000'
        );
        
        $my_query = new WP_Query($args);
        
        if( $my_query->have_posts() ) 
        {
            while ($my_query->have_posts())
            {
                $my_query->the_post(); 
                $values = get_post_custom( get_the_ID() );
                
                $store_array = [];
                $store_array ["id"] = get_the_ID();
                $store_array ["adresse"]= isset( $values['store_map_store_adresse'] ) ? esc_attr( $values['store_map_store_adresse'][0] ) : "";
                $store_array ["lat"] = isset( $values['store_map_lat'] ) ? esc_attr( $values['store_map_lat'][0] ) : "";
                $store_array ["lng"] = isset( $values['store_map_lng'] ) ? esc_attr( $values['store_map_lng'][0] ) : "";
                $store_array ["titre"] = get_the_title ();
                $store_array ["theDescription"] = apply_filters("the_content",get_the_content());
                
                array_push($store_data_as_array,$store_array);
                
            }
        }
        wp_reset_query(); 
        
        return $store_data_as_array;
    }
    
   
    
    
   
}