
/*global ajax_object */
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


