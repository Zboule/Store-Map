/*! Store Map - v0.1.1
 * http://wordpress.org/plugins
 * Copyright (c) 2016; * Licensed GPLv2+ */
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


/*global document */
/*global jQuery */
/*global alert */
/*global FileReader */
/*global console */
/*global Papa */
/*global google */
/*global setTimeout*/


function CoordonateFromAdress ()
{
	var self = this;
	this.delay = 1000;
	
	var requestQueue = [];
	var isDoingRequest = false;
	var geocoder = new google.maps.Geocoder();
	
	this.find = function (adresse,callback)
	{
		var aRequest = {};
		aRequest.adresse = adresse;
		aRequest.callback = callback;
		
		enqueueRequest(aRequest);
	};
	
	function enqueueRequest (aRequest)
	{
		requestQueue.push(aRequest);
		
		if (!isDoingRequest)
		{
			startRequest();
		}
	}
	
	function startRequest ()
	{
		
		var request = requestQueue.pop();

		if (request != null)
		{
			isDoingRequest = true;
			getCoordonateFromAdress (request,requestCallBack);
		}
		else
		{
			isDoingRequest = false;
		}
	}
	
	function requestCallBack (request,coordonate)
	{
		setTimeout(startRequest,self.delay);
		request.callback (coordonate);
	}
	
	
	
	/**
     * Trouve la position sur la carte à partir d'une adresse.
     * @param {string} adress - L'adresse à chercher
     * @param {function} callback - La function de callback type: function (coordonnte){};
     */
	function getCoordonateFromAdress (request,callback)
	{
	 	
        geocoder.geocode({'address': request.adresse}, function(results, status) {
            if (status === google.maps.GeocoderStatus.OK) {
                var coordonate = results[0].geometry.location;
                callback(request,coordonate);
            } 
            else {
            	console.log("Probléme pour détecter l'adresse: " + request.adresse);
            	console.log("Statut: " + status);
                callback(request,null);
            }
        });
	}
	
}