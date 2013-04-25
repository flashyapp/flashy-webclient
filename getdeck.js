$( document ).ready(function() {

	$("#logged_in").hide();
		
	//if already logged in, hide login message
	if (($.cookie("username") != null) && ($.cookie("session_id") != null) 
		&& ($.cookie("deck_id") != null)) {
		
		$("#logged_out").hide();
		
		$("#logged_in").show();
		
		var delete_setup = false;
		var modify_setup = false;
		var card_setup = false;
		var create_setup = false;
		
		//this will store the current deck info after the first AJAX call
		var current_deck = null;
			
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
					display(json);
					current_deck = json;
				}
			},
			error: function(xhr, status) { 
				console.log(xhr);
				alert( "Error handling request.");
			},
			complete: function(xhr, status) { ; }
		});
		
		//AJAX - delete deck
		$("#delete").click(function(event) {
			event.preventDefault();
			
			var request = {'username': $.cookie("username"), 'session_id': $.cookie("session_id")};
			var urltext = "http://www.flashyapp.com/api/deck/" + $.cookie("deck_id") + "/delete";
			
			var deletethis = true;
			
			$("#delete_dialog").dialog({
				buttons: [ { text: "Delete", click: function() { $(this).dialog("close"); } },
						   { text: "Cancel", click: function() { deletethis = false; $(this).dialog("close"); } } ],
				modal: true,
				title: "Delete Deck",
				close: function() {
					
					if (deletethis) $.ajax({
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
								location.href = "decklist.html";
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
			
			if (!delete_setup) {
				$("#delete_dialog").append("<p>Confirm deletion of deck?</p>");
				delete_setup = true;
			}
			$("#delete_dialog").dialog("open");
			
		});
		
		//AJAX - modify deck
		$("#modify").click(function(event) {
			event.preventDefault();
			
			var request = {'username': $.cookie("username"), 'session_id': $.cookie("session_id")};
			var urltext = "http://www.flashyapp.com/api/deck/" + $.cookie("deck_id") + "/modify";
			
			var modifythis = true;
			
			$("#modify_dialog").dialog({
				buttons: [ { text: "Modify", click: function() { $(this).dialog("close"); } },
						   { text: "Cancel", click: function() { modifythis = false; $(this).dialog("close"); } } ],
				modal: true,
				title: "Modify Deck",
				close: function() {
					
					request.name = $("#name_modify").val();
					request.description = $("#description_modify").val();
					
					if (modifythis) $.ajax({
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
			});
						
			if (!modify_setup) {
				$("#modify_dialog").append("<p>Please enter the desired name and description of this deck:</p>"
					+ "Deck Name: <input type='text' id='name_modify' /> <br>"
					+ "Description: <input type='text' id='description_modify' /> <br>");
				$("#name_modify").val(current_deck.name);
				$("#description_modify").val(current_deck.description);
				modify_setup = true;
			}
			$("#modify_dialog").dialog("open");
			
		});
		
		//View cards
		$("#view_cards").click(function(event) {
			
			event.preventDefault();
			
			var index = 0;
			var side = "A";
			
			$("#card_list").dialog({
				buttons: [  { text: "Previous Card", click: function() { 
								index = index - 1;
								side = "A";
								if (index == -1) index = current_deck.cards.length - 1;
								$("#card_viewer").text("");
								$("#card_viewer").append(current_deck.cards[index].sideA) } },
								
						    { text: "Back", click: function() {
								$("#card_viewer").text("");
								$(this).dialog("close"); } },
						   
						    { text: "Next Card", click: function() { 
								index = index + 1;
								side = "A";
								if (index == current_deck.cards.length) index = 0;
								$("#card_viewer").text("");
								$("#card_viewer").append(current_deck.cards[index].sideA); } },

							{ text: "Delete this Card", click: function() { 
								deleteCard(current_deck.cards[index]); } },
							
							{ text: "Modify this Card", click: function() { 
								modifyCard(current_deck.cards[index]); } } ],
				modal: true,
				title: "Card Viewer",
				close: function() { ; }
			});
			
			//Card viewer flip functionality
			$("#card_viewer").click(function(event) {
				event.preventDefault();
			
				
				if (side == "A") {
					side = "B";
					$("#card_viewer").text("");
					$("#card_viewer").append(current_deck.cards[index].sideB);
				}
				
				else if (side == "B") {
					side = "A";
					$("#card_viewer").text("");
					$("#card_viewer").append(current_deck.cards[index].sideA);
				}				
			});
			
			if (!card_setup) {
				card_setup = true;
			}
			$("#card_viewer").text("");
			$("#card_viewer").append(current_deck.cards[0].sideA);
			$("#card_list").dialog("open");
		});
		
		//AJAX - Create a new card
		$("#new_card").click(function(event) {
			event.preventDefault();
			
			var request = {'username': $.cookie("username"), 'session_id': $.cookie("session_id")};
			var urltext = "http://www.flashyapp.com/api/deck/" + $.cookie("deck_id") + "/card/create";
			
			var createthis = true;
			
			$("#create_dialog").dialog({
				buttons: [ { text: "Create", click: function() { $(this).dialog("close"); } },
						   { text: "Cancel", click: function() { createthis = false; $(this).dialog("close"); } } ],
				modal: true,
				title: "Create New Card",
				close: function() {
					
					request.sideA = $("#new_sidea").val();
					request.sideB = $("#new_sideb").val();
					
					if (createthis) $.ajax({
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
			});
						
			if (!create_setup) {
				$("#create_dialog").append("<p>Please enter the text for each side of the new card:</p>"
					+ "Side A: <input type='text' id='new_sidea' /> <br>"
					+ "Side B: <input type='text' id='new_sideb' /> <br>");
				create_setup = true;
			}
			$("#create_dialog").dialog("open");
			
		});
				
	}		
});

function deleteCard(index) {
	$("#card_options").text("");
	$("#card_options").append("Are you sure you want to delete this card? <button id='delete_card'>" 
							+ "Yes</button><button id='delete_cancel'>No</button>");
							
	$("#delete_cancel").click( function(event) {
		event.preventDefault();
		
		$("#card_options").text("");
		//$("#card_viewer").text(.sideA);
	});
	
	$("#delete_card").click( function(event) {
		event.preventDefault();
		
		var request = {'username': $.cookie("username"), 'session_id': $.cookie("session_id")};
		request.index = index;
		
		var urltext = "http://www.flashyapp.com/api/deck/" + $.cookie("deck_id") + "/card/delete"; 
		
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
	});
}

function modifyCard(index) {
	$("#card_options").text("");
	$("#card_options").append("Please enter the new text for side A and side B: <br> Side A : " 
							+ "<input type='text' id='side_a' /> <br> Side B: <input type='text' id='side_b' />"
							+ "<button id='modify_card'>Modify</button><button id='modify_cancel'>Cancel</button>");
							
	$("#modify_cancel").click( function(event) {
		event.preventDefault();
		
		$("#card_options").text("");
		//$("#card_viewer").text(.sideA);
	});
	
	$("#modify_card").click( function(event) {
		event.preventDefault();
		
		var request = {'username': $.cookie("username"), 'session_id': $.cookie("session_id")};
		request.sideA = $("#side_a").val();
		request.sideB = $("#side_b").val();
		request.index = index;
		
		var urltext = "http://www.flashyapp.com/api/deck/" + $.cookie("deck_id") + "/card/modify"; 
		
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
						location.reload();
					}
				},
				error: function(xhr, status) { 
					console.log(xhr);
					alert( "Error handling request.");
				},
				complete: function(xhr, status) { ; }
		});
	});
}

function display(json) {
	var nametext = "<p>" + json.name + "</p>";
	var desctext = "<p>" + json.description + "</p>";
	var cardtext = "<p>Number of cards in deck: " + json.cards.length + "</p>";
	
	$("#deck_info").append(nametext, desctext, cardtext);
}

//serializes form data into JSON object
//taken from http://stackoverflow.com/questions/1184624/convert-form-data-to-js-object-with-jquery
$.fn.serializeObject = function()
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
};