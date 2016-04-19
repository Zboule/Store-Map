/*! Store Map - v0.1.2
 * http://wordpress.org/plugins
 * Copyright (c) 2016; * Licensed GPLv2+ */
/*global google */
/*global document */
/*global jQuery */
/*global alert */
/*global window */
/*global store_map_data */
/*global store_map_options */
/*global console */
/*global navigator */
/*global Store_Map_Google_Map_Vue */
 

jQuery(function($){

	$(window).load(function(){
	   
	   var stores = new Green_Tiger_Store_Liste_Model ();
	 
       
	   var store_map = new Store_Map_Google_Map_Vue ("store_map_map");
	   var store_liste = new Green_Tiger_Store_Liste_Vue ();
	   var search = new Green_Tiger_Search_Vue ();
	   
	   var controleur = new Green_Tiger_Store_Controleur(store_map,store_liste,search,stores);
	
	});
});


/**
 * Classe représentant la liste deroulante des magasins
 */
function Green_Tiger_Store_Liste_Vue ()
{
    var self = this;
    var idDivOutput = "store_map_liste";
    var activeStore;
    
    /**
     * Ajoute un store à la liste des stores
     * @param {Store} store - Le magasin à ajouter
     */
    this.addStore = function (aStore,clickCallBackGenerator)
    {
        var distance = '<p class="distance"></p>';
        if (typeof(aStore.distance) !== 'undefined')
        {
            distance = '<p class="distance">' + aStore.distance.distanceAsTexte + "</p>";
        }
        
        
        var contenuStore = '<div class="titreStore"><h3>'+ aStore.titre +"</h3>" + distance + "</div>";
        contenuStore += '<div class="description">' + aStore.descriptionListe + "</div>";
        
        var containerStore = {
                "class": "store_map_description",
                "id" : "store-"+aStore.id,
                html: contenuStore,
                click: clickCallBackGenerator (aStore)
                };
                
        jQuery( "<div/>",containerStore).appendTo( "#"+idDivOutput );
    };
    
    
    this.removeContent = function ()
    {
        jQuery("#"+idDivOutput ).html("");
    };
    
    this.setSelectedStore = function (aStore)
    {
        jQuery(".store_map_description").removeClass("activeStore");
        jQuery("#store-"+aStore.id).addClass("activeStore");
        
    };
    
    this.putSelectedStoreOnTop = function ()
    {
        var activeStore = jQuery(".activeStore");
        var storeListe = jQuery( "#store_map_liste" );
        
    
        
        //var storeHeight = activeStore.height();
        var storeFromTop = activeStore.offset().top;
        var listeFromTop = storeListe.offset().top;
        
        
        var distanceFromTopOfTheListe = -1 * (listeFromTop - storeFromTop);

        storeListe.scrollTop(storeListe.scrollTop() + distanceFromTopOfTheListe);

    };
    
    this.scrollToTop = function ()
    {
        var storeListe = jQuery( "#store_map_liste" );
        storeListe.scrollTop(0);
    };
    
    
    this.getSelectedDiv = function ()
    {
        return jQuery(".activeStore"); 
    };
    
    this.getDescriptionListSelector = function ()
    {
        return jQuery("#store_map_liste"); 
    };
    
    
    
}


/**
 * Classe représentant la zone de recherche
 */
function Green_Tiger_Search_Vue ()
{

    var searchInput = jQuery ("#store_map_search_input");
    var searchBouton = jQuery("#store_map_search_button");
    var myPositionBouton = jQuery("#store_map_my_position_button");
    
    var searchListner = [];
    var myPositionListner = [];
    
    
    this.addSearchListner= function (callbackFunction)
    {
        searchListner.push(callbackFunction);
    };
    
    this.addMyPositionListner = function (callbackFunction)
    {
        myPositionListner.push(callbackFunction);
    };
    
    searchBouton.click(function() {
        for (var indice in searchListner)
        {
            searchListner[indice] (searchInput.val());
        }
    });
    
    myPositionBouton.click(function() {
        for (var indice in myPositionListner)
        {
            myPositionListner[indice] ();
        }
    });    

}


/**
 * Classe qui gére les interactions entre la liste deroulante, la carte et la zone de recherche
 * 
 * Il existe un event handler pour détecter la selection d'un magasin
 * 
 *  
        jQuery("#store_map_liste").on( "store_map_select_event", function( event, aStore ,  selectedDiv ) 
        {
            alert( "jor: "+aStore.titre);
        });
 */
function Green_Tiger_Store_Controleur (store_map_vue,store_liste_vue,search_vue,stores_liste)
{
    
    init ();
    
    function init ()
    {
        stores_liste.sortByAlphabeticalOrder ();
        
         //Afficher les données
        for (var indiceStore in stores_liste.stores)
        {
            var store = stores_liste.stores[indiceStore];
            
            store.markUp = store_map_vue.addMarkUp(store.coordonate,'',store.descriptionMarker,clickOnStoreInMapCallBackGenerator(store));
            
            store_liste_vue.addStore(store,clickOnStoreInListeCallBack);
        }
        
        
        //Add event click on search button
        search_vue.addSearchListner(searchProxyStoreListner);
        search_vue.addMyPositionListner(myPositionListner);
        

        
    }
    
    function myPositionListner ()
    {
       // Try HTML5 geolocation
    	if(navigator.geolocation) 
    	{
    		navigator.geolocation.getCurrentPosition(
    		    function(position) 
    		    {
                    var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
                    searchProxyStore (pos);
    		    }, 
        		function() 
        		{
        			alert("You didn't allow position retrieval");
        		}
            );
    	} 
    	else {
    		// Browser doesn't support Geolocation
    		alert("GeoLocation not supported by browser.");
    	}

    }
    
    function searchProxyStoreListner (searchAdresse)
    {
        //Search the map adress
        store_map_vue.getCoordonateFromAdress (searchAdresse,searchProxyStore);
    }
    
    
    function searchProxyStore (origineCoordonate)
    {

        var distanceUpdater = new Green_Tiger_Store_Distance_Updater (origineCoordonate,stores_liste);
        
        distanceUpdater.update(function ()
        {
            stores_liste.sortByDistance();
            updateView(origineCoordonate);
        });
        
        
        function updateView (coordonate)
        {
            var boundsCoordonates = stores_liste.getProxyStore ();
            boundsCoordonates.push(coordonate);
            store_map_vue.fitBounds(boundsCoordonates);
            
            
            store_liste_vue.removeContent ();
            for (var indiceStore in stores_liste.stores)
            {
                store_liste_vue.addStore(stores_liste.stores[indiceStore],clickOnStoreInListeCallBack);    
            }
            store_liste_vue.scrollToTop ();
        }
 
    }

    function clickOnStoreInMapCallBackGenerator (aStore)
    {
        return function ()
        {
            store_liste_vue.setSelectedStore (aStore);
            store_liste_vue.putSelectedStoreOnTop (aStore);
            triggerSelectionEvent(aStore);
        };
    }

 
    function clickOnStoreInListeCallBack (aStore) 
    {
        return function () 
        {
            
            store_liste_vue.setSelectedStore (aStore);
            store_map_vue.setVueOnMarkUp(aStore.markUp,9);
            triggerSelectionEvent(aStore);
        };
    }
    
    
    function triggerSelectionEvent (aStore)
    {
        var selectedDiv = store_liste_vue.getSelectedDiv ();
        var descriptionSelector = store_liste_vue.getDescriptionListSelector ();
        descriptionSelector.trigger("store_map_select_event",[aStore,selectedDiv]);
    }
    
}



/**
 * Classe représentant une liste de magasins
 */
function Green_Tiger_Store_Liste_Model ()
{
    var self = this;
    this.stores = [];

    parseStoreDataFromPHP ();
    
    function parseStoreDataFromPHP ()
    {
        
        for (var i in store_map_data)
        {
            var aStore = store_map_data [i];
            self.stores.push(new Green_Tiger_Store_Model(
                aStore.adresse,
                aStore.lat,
                aStore.lng,
                aStore.id,
                aStore.titre,
                aStore.theDescription
            ));
        }
    }
    
    this.getStoreAsArrayOf25 = function ()
    {
        var resultAsArrayOf25 = [];
        for (var i=0 ; i<this.stores.length ; i+= 25) 
        {
            resultAsArrayOf25.push(self.stores.slice(i,i+25));
        }
        
        return resultAsArrayOf25;
    };
    
    this.getLatLngAsArrayOf25 = function ()
    {
        var latLngArray = [];
        for (var i in self.stores)
        {
            var aStore =  self.stores[i];
            latLngArray.push(aStore.coordonate);
        }
        
        
        var resultAsArrayOf25 = [];
        for (i=0 ; i<latLngArray.length ; i+= 25) 
        {
            resultAsArrayOf25.push(latLngArray.slice(i,i+25));
        }
        
        return resultAsArrayOf25;
    };
    
    this.setStoreDistance = function (storeId,distance)
    {
        for (var i in self.stores)
        {
            var aStore =  self.stores[i];
            if (aStore.id === storeId)
            {
                
                aStore.distance = distance;
                return;
            }
        }
    };
    
    this.sortByAlphabeticalOrder = function ()
    {
        self.stores.sort(function (a, b) {
            if ( a.titre > b.titre)
            {
                return 1;
            }
              
            if (a.titre < b.titre)
            {
                return -1;
            }
            return 0;
        });
    };
    
    this.sortByDistance = function ()
    {
        self.stores.sort(function (a, b) {
            if ( a.distance.distance > b.distance.distance)
            {
                return 1;
            }
              
            if (a.distance.distance < b.distance.distance)
            {
                return -1;
            }
            return 0;
        });
    };
    
    this.getProxyStore = function ()
    {
        var resultat = [];
        
        var i=0,maxResult = 3;
        
        while (i<maxResult && i<self.stores.length)
        {
            resultat.push(self.stores[i].coordonate);
            i++;
        }
       
        return resultat;
    };
}


/**
 * Classe représentant un magasin
 */
function Green_Tiger_Store_Model (adresse,lat,lng,id,titre,descriptionListe,descriptionMarker)
{
    this.titre = titre || "Titre inconnu";
    this.adresse = adresse || "Adresse inconnu";
    this.coordonate = new google.maps.LatLng(lat, lng);
    this.id = id;
    this.descriptionListe = descriptionListe || "Description inconnu";
    this.descriptionMarker = descriptionMarker || ('<h5>'+ titre +'</h5>' + descriptionListe);
}



function Green_Tiger_Store_Distance_Updater (origineCoordonate,stores_liste)
{
    var service = new google.maps.DistanceMatrixService();
    
    this.update = function (callBackAfterUpdate)
    {
        var tabsStores = stores_liste.getStoreAsArrayOf25 ();//Spliter les stores en tableaux de 25
        var tabsLatLng = stores_liste.getLatLngAsArrayOf25 ();
        
        for (var i = 0 ; i < tabsStores.length ; i++)
        {
            updateTabOf25(tabsStores [i],tabsLatLng [i],callBackCompteur);
        }
        
        var callBackCpt = 0;
        
        function callBackCompteur ()
        {
            callBackCpt ++;
           
            if (callBackCpt === tabsStores.length)
            {
                callBackAfterUpdate ();
               
            }
        }
    };
    
    
    function updateTabOf25 (tabStores , tabLatLng ,callback)
    {
        service.getDistanceMatrix(
        {
            origins: [origineCoordonate],
            destinations: tabLatLng,
            travelMode: google.maps.TravelMode.DRIVING,
            unitSystem: google.maps.UnitSystem.METRIC,
        }, updateStoreDistance);
        
            
        function updateStoreDistance (response, status) 
        {
            /* Parse result distance */
            var distances = [];
            
            var results = response.rows[0].elements; // Il n'y a qu'une origine, donc 1 seul ligne
            for (var indiceResultat in results) 
            {
                var result = results[indiceResultat];
                
                //Create distance object
                var distance = {};
                if (result.status === google.maps.DistanceMatrixStatus.OK)
                {
                    distance.distanceAsTexte = result.distance.text;
                    distance.distance = result.distance.value;
                }
                else
                {
                    distance.distanceAsTexte = "";
                    distance.distance = Number.MAX_VALUE;
                }
                
                
                //Update store distance
                stores_liste.setStoreDistance (tabStores[indiceResultat].id,distance);
                
                
                
                // for (var indiceAff in tabStores) 
                // {
                //     var store = tabStores [indiceAff];
                //     for (var prop in store)
                //     {
                //         console.log (prop + " : " + store[prop]);
                //     }
                    
                // }
               
         
            }
          
            
            callback ();
        }
    }
}



/* Modify layout */
jQuery(function($){
    
    var div_liste = $("#store_map_liste");
    var div_map = $("#store_map_map");
    
    var breakPoint  = parseInt(div_liste.css('min-width')) + parseInt(div_map.css('min-width'));

    var container = $("#store_map_display");
        
        
    $(window).load(function(){
        setRowOrColumn();
        $(window).resize(setRowOrColumn);
	});
	
	
	function setRowOrColumn ()
	{
        if ($("#store_map_container").width() < breakPoint && container.hasClass( "store_map_row" ))
        {
            container.removeClass("store_map_row");
            container.addClass("store_map_column");
        }
        else if ($("#store_map_container").width() >= breakPoint && container.hasClass( "store_map_column" ))
        {
            container.removeClass("store_map_column");
            container.addClass("store_map_row");            
        }
        
        console.log($("#store_map_container").width() + "   " + container.hasClass( "store_map_row" ));
	}
	
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

