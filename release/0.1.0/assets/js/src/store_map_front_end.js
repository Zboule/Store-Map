/**
 * Store Map
 * http://wordpress.org/plugins
 *
 * Copyright (c) 2016 Jordane CURE
 * Licensed under the GPLv2+ license.
 */
 
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
    this.descriptionListe = descriptionListe|| "Description inconnu";
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


