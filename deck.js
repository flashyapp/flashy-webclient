var g_deck_list = {};


function get_decks(username, session_id)
{
    var request = {
	username: username,
	session_id: session_id
    };
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
		populate_deck_list(json.decks)
	    }
	},
	error: function(xhr, status) { 
	    console.log(xhr);
	    alert( "Error handling request.");
	},
	complete: function(xhr, status) { ; }
    });		
}

function populate_deck_list(deck_list)
{
    console.log("populating the deck list");
    g_deck_list = {};
    // clear the elements in the deck list
    $("#deck-list-list").empty();
    for (i in deck_list) {
	deck = deck_list[i];
	g_deck_list[deck.deck_id] = deck;
	var str = "<li id=\"" + deck.deck_id + "\">" + deck.name + "</li>";
	$("#deck-list-list").append(str);
	$("#" + deck.deck_id).click({deck_id: deck.deck_id}, load_deck);
    }
	
	var length = deck_list.length;
	
	//fill up to 10 slots (the max length before scroll)
	if (deck_list.length < 10) {
		for (i = 0; i < (10 - deck_list.length); i++)
		{
			var str = "<li> --- </li>";
			$("#deck-list-list").append(str);
		}
		length = 10;
	}
	
	$("#deck-list-list").css("height", (length * 31));
	
	//activate jscrollpane
	$(".scroll-pane").jScrollPane( {mouseWheelSpeed: 15});
}

$( document ).ready(function() {
    console.log("deck hooks starting...");

    if (($.cookie("username") == null) || ($.cookie("session_id") == null)) {
	console.log("user not logged in, doing nothing");
	return;
    }
	
	// user is logged in, populate the deck list
    get_decks($.cookie("username"), $.cookie("session_id"));
});