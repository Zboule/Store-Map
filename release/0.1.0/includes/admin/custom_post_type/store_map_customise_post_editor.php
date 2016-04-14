<?php

class Store_Map_Customise_Post_Editor {
    
    
    /**
     * Constructeur
     * Cette fonction doit être appelé lors de l'init
     */
    function __construct ()
    {
        $this->call_meta_box();
         
        $this->define_form_save_data ();
        
        $this->customise_post_style();
        
        $this->add_javascript();
    }
    
    
    function customise_post_style ()
    {
        $this->add_editor_title();
        

        $this->change_place_holder_title();
        
        $this->load_css ();
    }
    
    
    function add_editor_title ()
    {
        add_action('edit_form_after_title', function() {

            if (get_current_screen()->post_type === "store_map_cpt")
            {
                ob_start();
                ?>
                   <div id="editor_title"><h1>Description de la boutique</h1></div>
                <?php 
                ob_end_flush();
            }
        });
    }
    
    
    function change_place_holder_title ()
    {
        add_action('enter_title_here', function($title) {

            if (get_current_screen()->post_type === "store_map_cpt")
            {
               $title = "Saisissez le nom de la boutique ici";
            }
            
            return $title;
        });
    }
  
    function load_css ()
    {
        add_action( 'admin_enqueue_scripts', function ()
        {
            $page = get_current_screen();

            //Les styles ne sont chargés que sur la bonne page
            if( !isset( $page->id ) || 'store_map_cpt' != $page->id  )
               return;
              
            wp_register_style ( 'store_map_style_admin', store_map_URL.'assets/css/store_map_admin.css');
            wp_enqueue_style('store_map_style_admin');
        });
    }

    function add_javascript() 
    { 
        add_action( 'admin_footer',function () 
        {
            $page = get_current_screen();

            //Les styles ne sont chargés que sur la bonne page
            if( !isset( $page->id ) || 'store_map_cpt' != $page->id  )
               return;
            
            wp_enqueue_script( 'store_map_google_map_admin', 'https://maps.googleapis.com/maps/api/js');
        	wp_enqueue_script( 'store_map_cpt_edit', store_map_URL.'assets/js/store_map_cpt_edit.js', array('jquery','store_map_google_map_admin') );
        
        
            
        }); 
    }
    
    function call_meta_box() 
    {
        //Define a new metabox and set the callBackFunction
        add_action( 'add_meta_boxes', function (){
            add_meta_box( 
                'store_map_metabox_menu',
                " ", 
                array($this, 'generate_meta_boxe_content'), 
                'store_map_cpt'
            );
        });
    }
    
    function generate_meta_boxe_content ($post)
    {
        $values = get_post_custom( $post->ID );
        
        $latitude = isset( $values['store_map_lat'] ) ? esc_attr( $values['store_map_lat'][0] ) : '';
        $longitude = isset( $values['store_map_lng'] ) ? esc_attr( $values['store_map_lng'][0] ) : '';
        $adresse = isset( $values['store_map_store_adresse'] ) ? esc_attr( $values['store_map_store_adresse'][0] ) : '';
        $iconeURL = isset( $values['store_map_store_icone'] ) ? esc_attr( $values['store_map_store_icone'][0] ) : '';
        
        wp_nonce_field( 'my_meta_box_store_map', 'meta_box_store_map' );
        
        ob_start();
        ?>
            <h1>URL de l'incone (Optionel)</h1>
            <p>
                <input type="text" name="store_map_store_icone" id="store_map_store_icone" placeholder="URL de l'icone" value="<?php echo $iconeURL; ?>" />
            </p>
            
            <h1>Adresse de la boutique</h1>
            <p>
                                
                <input type="text" name="store_map_lat" id="store_map_lat" placeholder="Latitude" value="<?php echo $latitude; ?>" />
                <input type="text" name="store_map_lng" id="store_map_lng" placeholder="Longitude" value="<?php echo $longitude; ?>" />

                <input type="text" name="store_map_store_adresse" id="store_map_store_adresse" placeholder="Saisissez l'adresse de la boutique ici" value="<?php echo $adresse; ?>" />
                <input type="button" id="store_map_trouver" value="Trouver"/>
            </p>
            
            <div id="store_map_map"></div>
            
            
            
           
        
        <?php 
        ob_end_flush();
    }
    
   
    function define_form_save_data()
    {

        add_action( 'save_post', function ($post_id) {
            
            // Bail if we're doing an auto save
            if( defined( 'DOING_AUTOSAVE' ) && DOING_AUTOSAVE ) return;
             
            // if our nonce isn't there, or we can't verify it, bail
            if( !isset( $_POST['meta_box_store_map'] ) || !wp_verify_nonce( $_POST['meta_box_store_map'], 'my_meta_box_store_map' ) ) return;
             
             
             //Update du poste
            if( isset( $_POST['store_map_store_adresse'] ) )
            {
                $adress = sanitize_text_field($_POST['store_map_store_adresse']);
                update_post_meta( $post_id, 'store_map_store_adresse', $adress );
            }
            
            if( isset( $_POST['store_map_store_icone'] ) )
            {
                $urlIcone = sanitize_text_field($_POST['store_map_store_icone']);
                update_post_meta( $post_id, 'store_map_store_icone', $urlIcone );
            }
            
            if( isset( $_POST['store_map_lat'] ) )
            {
                $lat = sanitize_text_field($_POST['store_map_lat']);
                update_post_meta( $post_id, 'store_map_lat', $lat );
            }
            
            if( isset( $_POST['store_map_lng'] ) )
            {
                $lng = sanitize_text_field($_POST['store_map_lng']);
                update_post_meta( $post_id, 'store_map_lng', $lng );
            }
            
        });
    }
    
}

