/*! Store Map - v0.1.2
 * http://wordpress.org/plugins
 * Copyright (c) 2016; * Licensed GPLv2+ */
/*global document */
/*global jQuery */
/*global alert */
/*global FileReader */
/*global console */
/*global Papa */
/*global google */
/*global setTimeout*/
/*global CoordonateFromAdress*/


jQuery(document).ready(function($) {



	var store_data = {};
	var localisator  = new CoordonateFromAdress();
	
	$("#input_file_field").change(function ()
	{
		var file = document.getElementById('input_file_field').files[0];
		
		// Parse local CSV file
		Papa.parse(
			file, 
			{
				delimiter: ";",
				complete: function(results) 
				{
					formatStoreData (results.data);
					
					for (var indiceStore in store_data)
					{
						addPositionAndPrintStoreResult (store_data[indiceStore]);
					}
				}	
			}
		);
	});
	
	
	
	$("#bouton_envoyer").click(function ()
	{
		var data = {
			'action': 'store_map_import_cvs',
			'store_data':store_data
		};
		
		//console.log("Debut :" + JSON.stringify(store_data,null,2));

		//Envoie des données en AJAX

		
		jQuery.post(ajax_object.ajax_url, data, function(response) {
			alert('Got this from the server: ' + response);
		});
	});
	
	
	
	function addPositionAndPrintStoreResult (store)
	{
		addGpsPosition (store,function ()
		{
			afficheStoreData (store);
		});
	}
	
		
	function addGpsPosition (store,callback)
	{
		localisator.find(store.adresse,function (coordonnte) 
		{
			if (coordonnte != null)
			{
				store.gpsData = {
					lat:coordonnte.lat(),
					lng:coordonnte.lng()
				};
			}
			else
			{
				store.gpsData = {
					lat:0,
					lng:0
				};
			}
			callback ();
		});
	}
	
	
	/**
	 * Récupére les données du ficher CVS et les format en JSON 
	 * Format :
	 * Titre *** Adresse *** Icone URL *** Plusieurs ligne de description
	 */	
	function formatStoreData (papaparseResult)
	{
		store_data = {};
		
		for (var indiceLigne in papaparseResult)
		{
			var ligne = {};
			
			ligne.titre = papaparseResult[indiceLigne][0];
			ligne.adresse = papaparseResult[indiceLigne][1];
			ligne.iconeUrl = papaparseResult[indiceLigne][2];
			
			ligne.detailDescription = {};
			for (var i = 3; i < papaparseResult[indiceLigne].length ; i++)
			{
				ligne.detailDescription[i] = papaparseResult[indiceLigne][i];
			}
			
			store_data[indiceLigne] = ligne;
		}
		
	
	}
	
	
	function afficheStoreData (store)
	{
		var contenuStore = '<div class="titreStore"><h3>'+ store.titre +'</h3></div>';
		contenuStore += '<div class="adresse">' + store.adresse + "</div>";
		contenuStore += '<div class="gps">' + JSON.stringify(store.gpsData,null,2) + "</div>";
		contenuStore += '<div class="iconeURL">' + store.iconeUrl + "</div>";
		contenuStore += '<div class="description">' + formatDescriptionAsHtml(store.detailDescription) + "</div>";
		
		var containerStore = {
		        "class": "store_map_info_store",
		        html: contenuStore
		        };
		        
		jQuery( "<div/>",containerStore).appendTo( "#feedback" );		
		
	}
	
	function formatDescriptionAsHtml (descriptionTab)
	{
		var resultat = "";
		for (var indice in descriptionTab)
		{
			resultat += '<p>' + descriptionTab[indice] + '</p>';
		}
		
		return resultat;
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