$( document ).ready(function() {

	$("#decklist").on("click", "a.deck", (function(event) {
		event.preventDefault();
		$.cookie("deck_id", this.id, {	
										expires: 30,
										domain: "www.flashyapp.com",
										path: "/"
										});
		//location.href = "getdeck.html";
	}));

	//$("#logged_in").hide();
		
	//if already logged in, hide login message
	if (($.cookie("username") != null) && ($.cookie("session_id") != null)) {
		/*$("#logged_out").hide();
		
		var logged_in_text = "Welcome back, " + $.cookie("username") + ".";
		$("#logged_in").text(logged_in_text);
		$("#logged_in").show();*/
		
		//console.log($.cookie("username"));
		//console.log($.cookie("session_id"));
			
		//AJAX - get_decks - receive list of decks
		var request = {'username': $.cookie("username"), 'session_id': $.cookie("session_id")};
		$.ajax({
			url: "http://www.flashyapp.com/api/deck/get_decks",
			data: JSON.stringify(request),
			contentType: "application/json",
			type: "POST",
			dataType: "json",
			success: function(json) { 
				if (json.error == 101) alert("Error: You don't have the permissions to access this feature. Please login or create a user account.");
				else if (json.error == 500) alert("Error handling request.");
				else {
					console.log(json.decks);
					for (i in json.decks)
					{
						displayDeck(json.decks[i]);
					}
				}
			},
			error: function(xhr, status) { 
				console.log(xhr);
				alert( "Error handling request.");
			},
			complete: function(xhr, status) { ; }
		});		
	}		
});

//dynamically displays a deck in html format
function displayDeck(deck)
{
	var dtext = "<p><a id='" + deck.deck_id + "' href='#' class='deck'>" 
				+ deck.name + "</a>: " + deck.description + "</p>";
	$("#decklist").append(dtext);
}

//serializes form data into JSON object
//taken from http://stackoverflow.com/questions/1184624/convert-form-data-to-js-object-with-jquery
/*$.fn.serializeObject = function()
{
    var o = {};
    var a = this.serializeArray();
    $.each(a, function() {
        if (o[this.name] !== undefined) {
            if (!o[this.name].push) {
                o[this.name] = [o[this.name]];
            }
            o[this.name].push(this.value || '');
        } else {
            o[this.name] = this.value || '';
        }
    });
    return o;
};*/