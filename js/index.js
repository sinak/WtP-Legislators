$(document).ready(function(){
	window.baseURL = 'http://api.whitehouse.gov/v1/petitions';
	window.apiKey = 'YeLdE7spcAZd8ge';
		window.offset =0;

	$("#rep-list").hide();


	// initial ajax call to get list of petitions with a signature count of higher than 1000
	$.ajax({
		dataType: "jsonp",
		url: baseURL + ".jsonp?key="+apiKey+"&limit=1000&signatureCountFloor=10000&callback=getAllPetitionsSuccess",
		jsonp : false,
		cache : true,
	});

});


window.getAllPetitionsSuccess = function(data){    
	if (data){
		// go through and add each petition title + link
		for (var i=0; i<data.results.length; i++){
			var petitionTitle = data.results[i].title;
			var pid = data.results[i].id;
			$('#petition-list').append('<div class="box"><li class="petition-item" id="'+ pid + '"><a class="title">' + petitionTitle + '</a></li>');          
		}
		// reset position of rep list 
		$('#p-search').keypress(function(){
			$('body').append($('#rep-list'));
			$("#rep-list").hide();
		});
		// on link click, move the rep list to below and hide/slidedown the other
		$('.petition-item').click(function(){
			$(this).parent().append($('#rep-list'));
			$('#rep-list').slideDown();
		})
		// on click of rep name, cycle through zips and make api calls
		$('.name').click(function(){
			// make array from string of zips
			var zipCodes = $(this).next().html().split(',')
			for (var i=0; i<zipCodes.length; i++){
				// the id of the petition gained by going up the tree (other traversal wasn't working properly)
				var pid = $(this).parent().parent().parent().prev().attr('id');
				var zip = zipCodes[i];
				// make request to api every 101ms (or roughly 10 requests a second), use args from vars above
				setInterval(function(){ self.getZipcodes(pid,zip)},101);
			};
		})
	}
};

// get zipcodes from api, do zipcodessuccess function afterwards with data
function getZipcodes(pid, zipcode) {
	$.ajax({
		dataType: "jsonp",
		url: baseURL + "/"+ pid + "/signatures.jsonp?key="+apiKey+"&zipcode="+zipcode+"&callback=zipcodesSuccess",
		jsonp : false,
		cache : true,
	});
}

// use data from ajax call to fill out signature-list div
window.zipcodesSuccess = function(data) {
	if (data){
		$('.result').fadeOut();
		for (var i = 0; i<data.results.length; i++){
			var name = data.results[i].name;
			var city = data.results[i].city;
			var state = data.results[i].state;
			var zip = data.results[i].zip;
			// tentatively mashing all results together into one list element
			$('#signature-list').append('<li>'+name+city+state+zip+'</li>');
		}

	}};


// list.js search functionality to run on page load

$(window).load(function () {
	var options = {
		valueNames: ['name']
	};

	var repslist = new List('rep-list', options);

	var toptions = {
    valueNames: ['title']
	};

	var petitionList = new List('petitions', toptions);
});
