
/*global ajax_object */
/*global document */
/*global jQuery */
/*global alert */
/*global FileReader */
/*global console */
/*global Store_Map_Google_Map_Vue */
/*global google */
/*global setTimeout*/
/*global CoordonateFromAdress */


jQuery(document).ready(function($) {
    
    var map = new Store_Map_Google_Map_Vue ("store_map_map");
    var localisator  = new CoordonateFromAdress();
    
    var latField = $("#store_map_lat");
    var lngField = $("#store_map_lng");
    
    
    if (latField.val() != null && lngField.val() != null)
    {
        centerMapOnCoordonate(latField.val(),lngField.val());
    }


    
  
	$("#store_map_trouver").click(function ()
	{
	    var adresse = $("#store_map_store_adresse").val();
	    
	    localisator.find(adresse,function (coordonate)
	    {
	        $("#store_map_lat").val(coordonate.lat());
	        $("#store_map_lng").val(coordonate.lng());
	        
	        centerMapOnCoordonate (coordonate.lat(),coordonate.lng());
	    });
	});
	
	function centerMapOnCoordonate (lat,lng)
    {
        map.clearAllMarkers ();
        map.addMarkUpByCoordonate(lat,lng);
    }
    
    
    $("#publish").click(function (){
       //return false;
    });
    
    
    
});