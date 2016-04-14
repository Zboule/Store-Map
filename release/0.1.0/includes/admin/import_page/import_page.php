<?php

class Store_Map_Import_Page {
    
    
    /**
    * Constructeur
    * Cette fonction doit être appelé lors de l'init
    */
    function __construct ()
    {
        $this->create_page ();
        $this->add_javascript ();
        $this->define_ajax_callback ();
        
    }
    
    function create_page ()
    {
        add_action( 'admin_menu', function ()
        {
            add_submenu_page ( 
                'edit.php?post_type=store_map_cpt', 
                'Importer', 
                'Importer',  
                'manage_options', 
                'store_map_import_menu', 
                array($this, 'generate_html_content')
            );
        });
    }
    
    
    function generate_html_content ()
    {
        if ( !current_user_can( 'manage_options' ) )  {
    		wp_die( __( 'You do not have sufficient permissions to access this page.' ) );
    	}
    	ob_start();
    	?>
    	
    	    <h1>Importer des boutiques à partir d'un fichier CVS</h1>
    	    <p class="description">Blabla sur le formatage du ficher CVS</p>
    	    <div class="uploadForm">
    	        Fichier CVS : <input id="input_file_field" name="userfile" type="file" />
    	        </br>
    	    </div>
    	    <div id="feedback">
    	        <input id="bouton_envoyer" type="button" value="Envoyer les données"/>
    	    </div>
    	    
    	<?php
    	ob_end_flush();

    }
    
    
    function add_javascript() 
    { 
        add_action( 'admin_footer',function () 
        {
            $page = get_current_screen();
            
            //Les script ne sont chargés que sur la bonne page
            if( !isset( $page->base ) || 'store_map_cpt_page_store_map_import_menu' != $page->base  )
                return;
            
            wp_enqueue_script( 'store_map_google_map_admin', 'https://maps.googleapis.com/maps/api/js');

            wp_enqueue_script( 'store_map_papa_parse', store_map_URL.'assets/js/papaparse.js' );
        	wp_enqueue_script( 'store_map_admin_upload_cvs', store_map_URL.'assets/js/store_map_admin_upload_cvs.js', array('jquery','store_map_papa_parse','store_map_google_map_admin') );
        
        
        	// in JavaScript, object properties are accessed as ajax_object.ajax_url, ajax_object.we_value
        	wp_localize_script( 
        	    'store_map_admin_upload_cvs', 
        	    'ajax_object',
                array( 'ajax_url' => admin_url( 'admin-ajax.php' ), 'we_value' => 1234 ) 
            );
            
        }); 
    }
    
    
    function define_ajax_callback() 
    {
        add_action( 'wp_ajax_store_map_import_cvs', function ()
        {
            global $wpdb; // this is how you get access to the database
    
            //Vérifier le nonce aussi
            if (!isset($_POST['store_data']))
                wp_die(); // this is required to terminate immediately and return a proper response
                
            $store_data = $_POST['store_data'];
        
        	$i = 0;
        	for ($i; $i < count($store_data); $i++)
            {
                //Il faudrait vérifirer les informations avant des les ajouter à WP
                $this->add_new_store ($store_data[$i]);
            }
            
            //Il faudrait compter les valeurs réellement ajoutées
            echo $i . " valeur(s) ajoutées";
            wp_die();
        	
        });
    }
    
    
    function add_new_store ($store)
    {
    
        // Create post object
        $my_post = array(
            'post_title'    => wp_strip_all_tags( $store['titre'] ),
            'post_content'  => $this->format_post_content( $store['detailDescription'] ),
            'post_type' => 'store_map_cpt',
            'post_status' => 'publish',
            'meta_input'    => array( 
                "store_map_store_adresse" => $store['adresse'],
                "store_map_store_icone" => $store['iconeUrl'],
                "store_map_lat" => $store['gpsData']['lat'],
                "store_map_lng" => $store['gpsData']['lng']
            )
                    
        );
        
        // Insert the post into the database
        wp_insert_post( $my_post );

    }
    
    function format_post_content ($post_content)
    {
        $resultat = "";
        foreach($post_content as $ligne)
        {
            if (strpos($ligne, 'www.') !== false) 
            {
                $resultat .= '<a href="http://' . $ligne . '"><p>' . wp_strip_all_tags( $ligne ) . '</p></a>';
            }
            else
            {
                $resultat .= '<p>' . wp_strip_all_tags( $ligne ) . '</p>';
            }
            
        }
        
        return $resultat;
    }
    
    
    
}