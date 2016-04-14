<?php

class Store_Map_Settings_Page {
    
    /**
     * Holds the values to be used in the fields callbacks
     */
    private $options;
    
    
    /**
    * Constructeur
    * Cette fonction doit être appelé lors de l'init
    */
    function __construct ()
    {
        add_action('admin_menu', array($this,'create_menu'));
        add_action('admin_init', array($this,'create_options'));

    }
    
    function create_menu ()
    {
        add_submenu_page ( 
            'edit.php?post_type=store_map_cpt', 
            'Réglages', 
            'Réglages',  
            'manage_options', 
            'store_map_setting_menu',
            array($this, 'menu_html_callBack')
        );
    }
    
    function menu_html_callBack ()
    {
       ?>
            <div class="wrap">
            <h2>Store Map</h2>
            
            <form method="post" action="options.php">
                
                <?php settings_fields( 'store-map-settings-group' ); ?>
                <?php do_settings_sections( 'store-map-settings-group' ); ?>
                
                <table class="form-table">
                    
                    <tr valign="top">
                        <th scope="row">Map marker URL</th>
                        <td><input type="text" name="store_map_global_marker_icone_url" value="<?php echo esc_attr( get_option('store_map_global_marker_icone_url') ); ?>" /></td>
                    </tr>

                </table>
                
                <?php submit_button(); ?>
            
            </form>
            </div>
        <?php
    }
    
    function create_options ()
    {
     	register_setting( 'store-map-settings-group', 'store_map_global_marker_icone_url' );
    }

}

