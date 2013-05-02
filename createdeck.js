$( document ).ready(function() {
	
		$("#logged_in").hide();
		
		//if already logged in, hide login message
		if (($.cookie("username") != null) && ($.cookie("session_id") != null)) {
			$("#logged_out").hide();
		
			var logged_in_text = "Welcome back, " + $.cookie("username") + ".";
			$("#logged_in").text(logged_in_text);
			$("#logged_in").show();	
		}	
		
		//var line = "This is a string. \nIt's pretty cool.";
		//var arr = line.split("\n");
		//for (a in arr) console.log(arr[a]);
		
		//AJAX - create new deck from image
		$("#from_image").submit( function(event) {
			event.preventDefault();
			
			$("#from_image").append("<input type='hidden' id='username' name='username'></input> <input type='hidden' id='session_id' name='session_id'></input>");
			
			$("#username").val($.cookie("username"));
			$("#session_id").val($.cookie("session_id"));
			
			$("#from_image").ajaxSubmit({
			url: "http://www.flashyapp.com/api/deck/new/upload_image",
			contentType: "multipart/form-data",
			type: "POST",
			dataType: "json",
			success: function(json) {
				if (json.error == 500) alert("Error: You don't have the permissions to access this feature. Please login or create a user account.");
				if (json.error == 101) alert("Error: You don't have the permissions to access this feature. Please login or create a user account.");
				if (json.error == 200) alert("Error: Please upload a valid image");
				if (json.error == 0) alert("Success!");
				console.log(json);
			},
			error: function(xhr, status) { 
				console.log(xhr);
				alert( "Error handling request.");
			},
			complete: function(xhr, status) { ; }
			});
		});

		//AJAX - send new deck data to server
		$("#from_list").submit(function(event) {
			event.preventDefault();
			
			var request = $("#from_list").serializeObject();
			request.username = $.cookie("username");
			request.session_id = $.cookie("session_id");
			
			if ((request.username == null) || (request.session_id == null))
				alert("Please log in first to access deck creation features");
			else if (request.deck_name == "")
				alert("Please enter a name for your deck.");
			else {
			
				request.cards = createCards(request.list);
				
				/*for (c in request.cards)
				{
					console.log(request.cards[c].sideA, request.cards[c].sideB);
				}*/
				
				console.log(request.username, request.session_id, request.cards, request.deck_name, request.description);
				
				$.ajax({
					url: "http://www.flashyapp.com/api/deck/new/from_lists",
					data: JSON.stringify(request),
					contentType: "application/json",
					type: "POST",
					dataType: "json",
					success: function(json) { 
						if (json.error == 500) alert("Please log in first to access deck creation features.");
						if (json.error == 101) alert("Invalid user account.");
						if (json.error == 0) {
							console.log(json);
							alert("New deck created successfully.");
						}
						location.reload();
					},
					error: function(xhr, status) { alert("Unknown error."); },
					complete: function(xhr, status) { ; }
				});
			}
		});
		
		
	});

//Transforms textarea list of terms into a deck of cards
function createCards(string)
{
	var list = string.split("\n");
	var cards = [];
	
	for (line in list)
	{
		//console.log(list[line]);
		var pair = list[line].split("-");
		card = {sideA : pair[0], sideB : pair[1]};
		//console.log(card.sideA, card.sideB);
		cards.push(card);
	}
	
	return cards;
}

//serializes form data into JSON object.
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