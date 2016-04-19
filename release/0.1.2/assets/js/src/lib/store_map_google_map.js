 
/*global ajax_object */
/*global document */
/*global jQuery */
/*global alert */
/*global FileReader */
/*global console */
/*global Papa */
/*global google */
/*global setTimeout*/
/*global store_map_options*/



 /**
 * Classe représentant la carte google map
 */
function Store_Map_Google_Map_Vue (divName)
{
    var self = this;
    
    var infowindowZIndex = 1;
    
    var bounds = new google.maps.LatLngBounds();
    var markers = [];
    
    var mapOptions = {
        zoom: 9,
        center: new google.maps.LatLng(46.34,-72.54),
        scrollwheel: false,
        styles:[
          {
            featureType: "all",
            stylers: 
            [
              { saturation: -50 }
            ]
          },
          
          
        ]
    };
    
    
    this.map = new google.maps.Map(document.getElementById(divName), mapOptions);
    this.openInfoWindow = [];
    
    
    
    /**
     * Centre la carte sur les coordonnés spécifiés
     * @param {String} adresse - L'adresse sur laquelle centrer la map
     */
    this.centerMapByAdress = function (adresse)
    {
        self.getCoordonateFromAdress(adresse,function (coordonate){
            self.centerMapByCoordonate(coordonate);
        });
    };
    
    
    
    /**
     * Centre la carte sur les coordonnés spécifiés
     * @param {String} adresse - L'adresse sur laquelle centrer la map
     */
    this.clearAllMarkers = function ()
    {
       for (var indiceMarker in markers)
       {
           markers[indiceMarker].setMap(null);
       }
       markers = [];
    };
   
   

    
    /**
     * Centre la carte sur les coordonnés spécifiés
     * @param {LatLng} coordonate - Les coordonnés sur lesquelles centrer la map
     */
    this.centerMapByCoordonate = function (coordonate,zoom)
    {
        if (zoom !== "undefined")
        {
            self.map.setZoom(zoom);
        }
        
        self.map.setCenter(coordonate);
    };
    
    
    /**
     * Centre la carte sur le markUp et ouvre le popup du markup
     * Ferme tous les autres popup
     * @param {LatLng} coordonate - Les coordonnés sur lesquelles centrer la map
     */
    this.setVueOnMarkUp = function (marker,zoomValue)
    {
        self.map.panTo(marker.getPosition());
        if (typeof zoomValue !== 'undefined')
        {
            self.map.setZoom(zoomValue);
        }
    };
    
    
    
    /**
     * Ajoute un markup aux coordonnés spécifiés
     * @param {String} coordonate - Les coordonnées du marker
     * @param {String} image - Le logo du marker
     * @param {String} description - La description du marker quand il s'ouvre
     */
    this.addMarkUp = function (coordonate,image,description,clickCallBack)
    {
        if (image ===  "" && typeof store_map_options["marker_icone_url"] !== 'undefined')
        {
            image = store_map_options["marker_icone_url"];
        }

 
        var marker = new google.maps.Marker({
            position: coordonate,
            map: self.map,
            icon:image
        });
        
        marker.setMap(self.map);
        
        
        if (typeof description !== 'undefined')
        {
            var infowindow = new google.maps.InfoWindow({
                content: description
            });
            
            marker.infowindow = infowindow;
            marker.addListener('click', function() {
                infowindow.open(self.map, marker);
                clickCallBack();
            });
            
            addInfoWindowsOpenListner(infowindow);
        }
        
        bounds.extend (coordonate);
        self.map.fitBounds(bounds);
        markers.push (marker);
        return marker;
    };
    
    
    /**
     * Centre la carte sur les coordonnés spécifiés
     * @param {String} adresse - L'adresse sur laquelle centrer la map
     */
    this.addMarkUpByAdresse = function (adresse)
    {
        self.getCoordonateFromAdress(adresse,function (coordonate){
            
            self.addMarkUp (coordonate);
            self.centerMapByCoordonate(coordonate,13);
        });
    };
    
    
    /**
     * Centre la carte sur les coordonnés lat lng
     */
    this.addMarkUpByCoordonate = function (lat,lng)
    {
        var coordonate = new google.maps.LatLng(lat,lng);
        console.log(lat + " + " + lng);
        self.addMarkUp (coordonate);
        self.centerMapByCoordonate(coordonate,13);
        
    };
    
   
  
    
    this.fitBounds = function (tabOfPosition)
    {
        var customBounds = new google.maps.LatLngBounds();
        
        for (var indice in tabOfPosition)
        {
            customBounds.extend (tabOfPosition[indice]);
        }
        
        self.map.fitBounds(customBounds);
    };
    
    
    
    function addInfoWindowsOpenListner (infowindow)
    {
        google.maps.event.addListener(infowindow, 'domready', function(){
           infowindow.setZIndex(infowindowZIndex++);
        });
    }
    	

    
    
    /**
     * Trouve la position sur la carte à partir d'une adresse.
     * @param {string} adress - L'adresse à chercher
     * @param {function} callback - La function de callback type: function (coordonnte){};
     */
	this.getCoordonateFromAdress = function (adress, callback)
	{
	    var geocoder = new google.maps.Geocoder();
        
        geocoder.geocode({'address': adress}, function(results, status) {
            if (status === google.maps.GeocoderStatus.OK) {
                var coordonate = results[0].geometry.location;
                callback(coordonate);
            } 
            else {
                alert('Geocode was not successful for the following reason: ' + status);
            }
        });
	};
}

