 
/*global ajax_object */
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