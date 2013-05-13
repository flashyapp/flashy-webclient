var g_current_deck;

function show_delete_deck_dialog()
{
	if (g_current_deck == null) {
		return;
	}
	
    $("#overlay").show();
    $("#dialog-delete-deck").show();
}

function hide_delete_deck_dialog()
{
    $("#dialog-delete-deck").hide();
}

function show_modify_deck_dialog()
{
	if (g_current_deck == null) {
		return;
	}
	
    $("#overlay").show();
	$("#modify-deck-name").val(g_current_deck.name);
	$("#modify-deck-desc").val(g_current_deck.description);
    $("#dialog-modify-deck").show();
}

function hide_modify_deck_dialog()
{
    $("#dialog-modify-deck").hide();
}

function show_delete_card_dialog()
{
	if (g_current_deck == null) {
		return;
	}
	
	//console.log(g_current_deck.current_index);
    $("#overlay").show();
    $("#dialog-delete-card").show();
}

function hide_delete_card_dialog()
{
    $("#dialog-delete-card").hide();
}

function show_modify_card_dialog()
{
	if (g_current_deck == null) {
		return;
	}
	
	//console.log(g_current_deck.current_index);
    $("#overlay").show();
	
	index = g_current_deck['current_index'];
	$("#modify-card-sidea").val(g_current_deck['cards'][index]['sideA']);
	$("#modify-card-sideb").val(g_current_deck['cards'][index]['sideB']);
	
    $("#dialog-modify-card").show();
}

function hide_modify_card_dialog()
{
    $("#dialog-modify-card").hide();
}

function show_create_card_dialog()
{
	if (g_current_deck == null) {
		return;
	}
	
	//console.log(g_current_deck.current_index);
    $("#overlay").show();
	$("#dialog-create-card").show();
}

function hide_create_card_dialog()
{
    $("#dialog-create-card").hide();
}

function hide_overlay()
{
	$("#overlay").hide();
}

//Replace resource tags in the loaded deck with actual image resources
function getCardResource() {
    index = g_current_deck['current_index'];
	
	var request = {'username': $.cookie("username"), 'session_id': $.cookie("session_id")};
    request.index = g_current_deck['cards'][index]['index'];
    
    var urltext = "http://www.flashyapp.com/api/deck/" + $.cookie("deck_id") + "/card/get_resources"; 
    
    var resources;
    	
    if (g_current_deck['cards'] == null) return;
    
	//AJAX - card/get_resources - Retrieve resources and replace tags upon success 
	$.ajax({
	url: urltext,
	data: JSON.stringify(request),
	contentType: "application/json",
	type: "POST",
	dataType: "json",
	success: function(json) { 
	    if (json.error == 101) alert("Error: You don't have the permissions to access this feature. Please login or create a user account.");
	    else if (json.error == 300) {
			alert("Error: This deck no longer exists.");
			$.cookie("deck_id", null, {domain: "www.flashyapp.com", path: "/"});
		}
	    if (json.error == 0){
		g_current_deck['cards'][index]['resources'] = json.resources;
		console.log(json.resources);
		for (i = 0; i < json.resources.length; i++)
		{
		    g_current_deck['cards'][index]['sideA'] = g_current_deck['cards'][index]['sideA'].replace("[FLASHYRESOURCE:" + json.resources[i].resource_id + "]", 
					      "http://www.flashyapp.com/resources/" + json.resources[i].resource_id);
		    g_current_deck['cards'][index]['sideB'] = g_current_deck['cards'][index]['sideB'].replace("[FLASHYRESOURCE:" + json.resources[i].resource_id + "]", 
					      "http://www.flashyapp.com/resources/" + json.resources[i].resource_id);
		}
		g_current_deck['cards'][index]['sideA'] = g_current_deck['cards'][index]['sideA'].replace("[FLASHYRESOURCE:00000000]", 
													  "");
		g_current_deck['cards'][index]['sideB'] = g_current_deck['cards'][index]['sideB'].replace("[FLASHYRESOURCE:00000000]", 
													  "");
		display_current_deck();
	    }
	},
	error: function(xhr, status) { 
		//Silent failure - Most common problem: current deck deleted via android app
	    /*console.log(xhr);
	    alert( "Error handling request.");*/
		$.cookie("deck_id", null, {domain: "www.flashyapp.com", path: "/"});
	},
	complete: function(xhr, status) { ; }
    });		
}

//Load the data for the selected deck
function load_deck(event) {
    console.log("loading deck...");
    console.log(event.data.deck_id);
    $.cookie("deck_id", event.data.deck_id, {domain: "www.flashyapp.com", path: "/"});
    // ajax request to do the work
    //AJAX - get_deck - receive deck information
    var request = {'username': $.cookie("username"), 'session_id': $.cookie("session_id")};
    var urltext = "http://www.flashyapp.com/api/deck/" + $.cookie("deck_id") + "/get";
    $.ajax({
	url: urltext,
	data: JSON.stringify(request),
	contentType: "application/json",
	type: "POST",
	dataType: "json",
	success: function(json) { 
	    if (json.error == 101) alert("Error: You don't have the permissions to access this feature. Please login or create a user account.");
	    else if (json.error == 500) alert("Error handling request.");
	    if (json.error == 0){
		g_current_deck = json;
		g_current_deck['current_index'] = 0;
		g_current_deck['side'] = 'A';
		display_current_deck();
	    }
	},
	error: function(xhr, status) { 
	    console.log(xhr);
	    alert( "Error handling request.");
	},
	complete: function(xhr, status) { ; }
    });
}

//Display the current card of the current deck, as long as its resources are loaded
function display_current_deck() {
    console.log("displaying deck..");
    if (g_current_deck == null) {
	return;
    }
	
	var index = g_current_deck['current_index'];
    var side = g_current_deck['side'];
	
	if (g_current_deck['cards'][index]['resources'] != null)
    {
		hide_create_deck_from_list_form();
		$("#card-content").html(g_current_deck['cards'][index]['side' + side]);
    }
    // for all the cards in the deck replace the flashyapp resource string
    else {
		getCardResource();
	}
    
}

//Flip card from A side to B side or vice-versa
function flip_card() {
    if (g_current_deck == null) {
	return;
    }
    if (g_current_deck['side'] == 'A') {
	g_current_deck['side'] = 'B';
    }
    else {
	g_current_deck['side'] = 'A';
    }
    display_current_deck();
}

//Display the A side of the next card in the deck
function next_card() {
    if (g_current_deck == null) {
	return;
    }
    // get the max value of cards
    var max = g_current_deck['cards'].length
    var index = g_current_deck['current_index']
    index = index + 1;
    if (index >= max) {
	index = 0;
    }
    g_current_deck['current_index'] = index;
	g_current_deck['side'] = 'A';
    display_current_deck();
}

//Display the A side of the previous card in the deck
function prev_card() {
    if (g_current_deck == null) {
	return;
    }
    // get the max value of cards
    var max = g_current_deck['cards'].length
    var index = g_current_deck['current_index']
    index = index - 1;
    if (index < 0) {
	index = max - 1;
    }
    g_current_deck['current_index'] = index;
	g_current_deck['side'] = 'A';
    display_current_deck();
}

//Delete the current deck permanently
function delete_deck() {
	event.preventDefault();
	
	if (g_current_deck == null) {
		return;
	}
	
	var request = {'username': $.cookie("username"), 'session_id': $.cookie("session_id")};
	var urltext = "http://www.flashyapp.com/api/deck/" + $.cookie("deck_id") + "/delete";
	
	//AJAX - delete - Delete the deck
	$.ajax({
		url: urltext,
		data: JSON.stringify(request),
		contentType: "application/json",
		type: "POST",
		dataType: "json",
		success: function(json) { 
			if (json.error == 101) alert("Error: You don't have the permissions to access this feature. Please login or create a user account.");
			else if (json.error == 500) alert("Error handling request.");
			else if (json.error == 300) alert("Error: This deck no longer exists.");
			if (json.error == 0){
				alert("Deck successfully deleted.");
				$.cookie("deck_id", null, {domain: "www.flashyapp.com", path: "/"});
				location.reload();
			}
		},
		error: function(xhr, status) { 
			console.log(xhr);
			alert( "Error handling request.");
		},
		complete: function(xhr, status) { ; }
	});
}

//Modify the name and description of the current deck
function modify_deck() {
	event.preventDefault();
	
	if (g_current_deck == null) {
		return;
	}
	
	var request = {'username': $.cookie("username"), 'session_id': $.cookie("session_id")};
	request.name = $("#modify-deck-name").val();
	request.description = $("#modify-deck-desc").val();
	
	var urltext = "http://www.flashyapp.com/api/deck/" + $.cookie("deck_id") + "/modify"; 
	
	//AJAX - modify - Modify the deck
	$.ajax({
		url: urltext,
		data: JSON.stringify(request),
		contentType: "application/json",
		type: "POST",
		dataType: "json",
		success: function(json) { 
			if (json.error == 101) alert("Error: You don't have the permissions to access this feature. Please login or create a user account.");
			else if (json.error == 500) alert("Error handling request.");
			else if (json.error == 300) alert("Error: This deck no longer exists.");
			if (json.error == 0){
				alert("Deck successfully modified.");
				location.reload();
			}
		},
		error: function(xhr, status) { 
			console.log(xhr);
			alert( "Error handling request.");
		},
		complete: function(xhr, status) { ; }
	});
}

//Delete the card at the current deck's current index
function delete_card() {
	event.preventDefault();
	
	if (g_current_deck == null) {
		return;
	}
	
	index = g_current_deck['current_index'];
	
	var request = {'username': $.cookie("username"), 'session_id': $.cookie("session_id")};
	request.index = g_current_deck['cards'][index]['index'];
	
	var urltext = "http://www.flashyapp.com/api/deck/" + $.cookie("deck_id") + "/card/delete";
	
	//AJAX - card/delete
	$.ajax({
		url: urltext,
		data: JSON.stringify(request),
		contentType: "application/json",
		type: "POST",
		dataType: "json",
			success: function(json) { 
				if (json.error == 101) alert("Error: You don't have the permissions to access this feature. Please login or create a user account.");
				else if (json.error == 400) alert("Error handling request.");
				else if (json.error == 300) alert("Error: This deck no longer exists.");
				if (json.error == 0){
					alert("Card successfully deleted.");
					location.reload();
				}
			},
			error: function(xhr, status) { 
				console.log(xhr);
				alert( "Error handling request.");
			},
			complete: function(xhr, status) { ; }
	});
}

//Modify the card at the current deck's current index
function modify_card() {
	event.preventDefault();
	
	if (g_current_deck == null) {
		return;
	}
	
	index = g_current_deck['current_index'];
	
	var request = {'username': $.cookie("username"), 'session_id': $.cookie("session_id")};
	request.index = g_current_deck['cards'][index]['index'];
	request.sideA = $("#modify-card-sidea").val();
	request.sideB = $("#modify-card-sideb").val();
	
	var urltext = "http://www.flashyapp.com/api/deck/" + $.cookie("deck_id") + "/card/modify";
	
	//AJAX - modify_card
	$.ajax({
		url: urltext,
		data: JSON.stringify(request),
		contentType: "application/json",
		type: "POST",
		dataType: "json",
		success: function(json) { 
			if (json.error == 101) alert("Error: You don't have the permissions to access this feature. Please login or create a user account.");
			else if (json.error == 400) alert("Error handling request.");
			else if (json.error == 300) alert("Error: This deck no longer exists.");
			if (json.error == 0){
				alert("Card successfully modified.");
			}
			console.log(json);
			location.reload();
		},
		error: function(xhr, status) { 
			console.log(xhr);
			alert( "Error handling request.");
		},
		complete: function(xhr, status) { ; }
	});
}

//Create a new card and append it to the end of the current deck
function create_card() {
	event.preventDefault();
	
	if (g_current_deck == null) {
		return;
	}
	
	var request = {'username': $.cookie("username"), 'session_id': $.cookie("session_id")};
	request.sideA = $("#create-card-sidea").val();
	request.sideB = $("#create-card-sideb").val();
	
	var urltext = "http://www.flashyapp.com/api/deck/" + $.cookie("deck_id") + "/card/create";
	
	//AJAX - create card
	$.ajax({
		url: urltext,
		data: JSON.stringify(request),
		contentType: "application/json",
		type: "POST",
		dataType: "json",
		success: function(json) { 
			if (json.error == 101) alert("Error: You don't have the permissions to access this feature. Please login or create a user account.");
			else if (json.error == 500) alert("Error handling request.");
			else if (json.error == 300) alert("Error: This deck no longer exists.");
			if (json.error == 0){
				alert("New card successfully created.");
				location.reload();
			}
		},
		error: function(xhr, status) { 
			console.log(xhr);
			alert( "Error handling request.");
		},
		complete: function(xhr, status) { ; }
	});
}


$( document ).ready(function() {
    console.log("card-viewer hooks init...");
	
	//hide dialog panels
	hide_delete_deck_dialog();
	hide_modify_deck_dialog();
	hide_delete_card_dialog();
	hide_modify_card_dialog();
	hide_create_card_dialog();
	
    if (($.cookie("username") == null) || ($.cookie("session_id") == null)) {
	console.log("user not logged in, doing nothing");
	return;
    }
		
	//click handlers
    $("#card-content-outer").click(flip_card);
    $("#next").click(next_card);
    $("#prev").click(prev_card);
	
	$("#delete-deck").click(show_delete_deck_dialog);
	$("#delete-deck-confirm").click(delete_deck);
	$("#delete-deck-cancel").click( function() { hide_delete_deck_dialog(); hide_overlay(); });
	
	$("#modify-deck").click(show_modify_deck_dialog);
	$("#modify-deck-confirm").click(modify_deck);
	$("#modify-deck-cancel").click( function() { hide_modify_deck_dialog(); hide_overlay(); });
		
	$("#delete-card").click(show_delete_card_dialog);
	$("#delete-card-confirm").click(delete_card);
	$("#delete-card-cancel").click( function() { hide_delete_card_dialog(); hide_overlay(); });
	
	$("#modify-card").click(show_modify_card_dialog);
	$("#modify-card-confirm").click(modify_card);
	$("#modify-card-cancel").click( function() { hide_modify_card_dialog(); hide_overlay(); });
	
	$("#create-card").click(show_create_card_dialog);
	$("#create-card-confirm").click(create_card);
	$("#create-card-cancel").click( function() { hide_create_card_dialog(); hide_overlay(); });
	
    // if the user had a deck loaded before, load it again
    if ($.cookie("deck_id") != null)
    {
	load_deck({data: { deck_id: $.cookie("deck_id")}});
    }
});

