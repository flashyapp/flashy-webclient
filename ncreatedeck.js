$( document ).ready(function() {
	
		/*$("#logged_in").hide();*/
		
		//if already logged in, hide login message
		if (($.cookie("username") != null) && ($.cookie("session_id") != null)) {
			/*$("#logged_out").hide();
		
			var logged_in_text = "Welcome back, " + $.cookie("username") + ".";
			$("#logged_in").text(logged_in_text);
			$("#logged_in").show();	
		}*/	
		
		//var line = "This is a string. \nIt's pretty cool.";
		//var arr = line.split("\n");
		//for (a in arr) console.log(arr[a]);
		
		$("#newdeck").click( function(event) {
			event.preventDefault();
			$("#createdeck").show();
			$("#getdeck").hide();
			$("#deckplaceholder").hide();
		});
		
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
				if (json.error == 0) {
					displayImage(json.divs, json.name);
				}
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
		}
		
	});
	
//
function displayImage(divs, name)
{
	$("#divlines").append("<img src='http://www.flashyapp.com/resources/tmp/" + name 
		+ "' alt='preview' class='image' id='image'></img> <br>");
	
	var w;
	var h;
	
	//adapted from http://stackoverflow.com/questions/623172/how-to-get-image-size-height-width-using-javascript
	var img = new Image();
	img.onload = function() {
		w = this.width;
		h = this.height;
		$("#image").attr("width", w);
		$("#image").attr("height", h);
		//console.log(this.width + "x" + this.height);
		drawImageLines(divs);
		$("#divlines").dialog("option", "minHeight", h + 150);
		$("#divlines").dialog("option", "minWidth", w + 150);
	}	
	
	img.src = "http://www.flashyapp.com/resources/tmp/" + name;
	
	var submitthis = 0;
	
	$("#divlines").dialog({
		buttons: [ { text: "Submit", click: function() { submitthis = 1; $(this).dialog("close"); } },
				   { text: "Cancel", click: function() { $(this).dialog("close"); } } ],
		modal: true,
		title: "Adjust line splitting",
		close: function() { 
			if (submitthis) {
				
				var request = $("#from_image").serializeObject();
				request.username = $.cookie("username");
				request.session_id = $.cookie("session_id");
				request.name = name;
				
				var newdivs = new Array(divs.length);
								
				for (i = 0; i < divs.length; i++)
				{
					newdivs[i] = new Array(2);
					
					if (i != divs.length - 1) newdivs[i][0] = getHorizontal(i);
					else newdivs[i][0] = parseInt($("#box").css("height")) - parseInt($("#box").css("top"));
					
					newdivs[i][1] = new Array(divs[i][1].length);
					newdivs[i][1][0] = 0;
					
					for (j = 1; j < divs[i][1].length - 1; j++)
					{
						newdivs[i][1][j] = getVertical(i, j-1);
					}
					
					newdivs[i][1][j] = parseInt($("#box").css("width")) - parseInt($("#box").css("left"));
				}
				
				console.log(newdivs);
				
				request.divs = newdivs;
				
				var urltext = "http://www.flashyapp.com/api/deck/new/from_image";
				
				if ((request.username == null) || (request.session_id == null))
					alert("Please log in first to access deck creation features");
				else if (request.deck_name == "")
					alert("Please enter a name for your deck.");
				else {
					$.ajax({
						url: urltext,
						data: JSON.stringify(request),
						contentType: "application/json",
						type: "POST",
						dataType: "json",
						success: function(json) { 
							if (json.error == 101) alert("Error: You don't have the permissions to access this feature. Please login or create a user account.");
							else if (json.error == 500) alert("Error handling request.");
							else if (json.error == 201) alert("Error: Please upload the image to our servers first.");
							if (json.error == 0){
								alert("Deck successfully created.");
								location.href = "decklist.html";
							}
							console.log(json);
						},
						error: function(xhr, status) { 
							console.log(xhr);
							alert( "Error handling request.");
						},
						complete: function(xhr, status) { ; }
					});
				}
			}
			
			$("#divlines").text("");
		}			
	});
	
}



function drawImageLines(divs) {

	var rowIndex = 0;
	var colIndex = 0;
	
	window.numRows = divs.length;
	window.divs = divs;
	
	var x1 = parseInt($(".image").css("left"));
	var y1 = parseInt($(".image").css("top"));
	var x2 = parseInt($("#image").attr("width")) + parseInt($(".image").css("left"));
	var y2 = parseInt($("#image").attr("height")) + parseInt($(".image").css("top"));

	//console.log(x1 + " " + y1 + " " + x2 + " " + y2); 
		
	drawImageBox(x1, y1, x2, y2);
	var boxHeight = Math.abs(y1 - y2);
	var boxWidth = Math.abs(x1 - x2);
	
	var prevY = y1;
	for (i = 0.0; i < numRows - 1; i++)
	{
		var y = divs[i][0];	
		var yid = "row" + rowIndex;
		drawHorizontalLine(x1, y, x2, y, rowIndex);
		
		colIndex = 0;
		for (j = 1.0; j < divs[i][1].length - 1; j++)
		{
			var x = divs[i][1][j];
			var xid = yid + "col" + colIndex;
			drawVerticalLine(x, prevY, x, y, xid);
			colIndex++;
		}
		
		prevY = y;
		rowIndex++;
	}
	
	//bottom row
	colIndex = 0;
	for (j = 1.0; j < divs[i][1].length - 1; j++)
	{
		var x = divs[i][1][j];
		var xid = "row" + rowIndex + "col" + colIndex;
		drawVerticalLine(x, prevY, x, y2, xid);
		colIndex++;
	}
}


function drawImageBox(x1, y1, x2, y2, imageid) {

	var width = Math.abs(x1 - x2);
	var height = Math.abs(y1 - y2);
	var box = "<div id='box' class='box'> </div>";
	
	$("#divlines").append(box);
	
	$("#box").css({
		left: x1,
		top: y1,
		width: width,
		height: height,
		position: 'absolute'
	});
}

//draw a horizontal line - adapted from http://stackoverflow.com/questions/3157089/javascript-draw-line-with-jquery
function drawHorizontalLine(x1, y1, x2, y2, index) {

	var width = Math.abs(x1 - x2);
	var id = "row" + index;
	var line = "<div id='" + id + "' class='line'> </div>";
	
	$("#divlines").append(line);
	
	$("#"+ id).css({
		left: x1,
		top: y1,
		width: width,
		height: 0,
		position: 'absolute',		
		backgroundColor: '#000'
	});
	
	$("#"+ id).draggable({
		axis: "y",
		containment: '#box',
		drag: function() {
			//change length of vertical lines
			for (i = 0; i < window.divs[index][1].length - 1; i++)
			{
				//top row
				if (index == 0) {
					$("#row" + index + "col" + i).css("height", parseInt($("#" + id).css("top")) - parseInt($("#box").css("top")));
					$("#row" + (index + 1) + "col" + i).css("top", $("#" + id).css("top"));
					$("#row" + (index + 1) + "col" + i).css("height", parseInt($("#row" + (index + 1)).css("top")) - parseInt($("#" + id).css("top"))); 
				}
				//bottom row
				else if (index == window.numRows - 2) {
					
					$("#row" + index + "col" + i).css("height", parseInt($("#" + id).css("top")) - parseInt($("#row" + (index - 1)).css("top")));
					$("#row" + (index + 1) + "col" + i).css("top", $("#" + id).css("top"));
					$("#row" + (index + 1) + "col" + i).css("height", parseInt($("#box").css("top")) + parseInt($("#box").css("height")) - parseInt($("#" + id).css("top"))); 
				}
				//everything else
				else {
					$("#row" + index + "col" + i).css("height", parseInt($("#" + id).css("top")) - parseInt($("#row" + (index - 1)).css("top")));
					$("#row" + (index + 1) + "col" + i).css("top", $("#" + id).css("top"));
					$("#row" + (index + 1) + "col" + i).css("height", parseInt($("#row" + (index + 1)).css("top")) - parseInt($("#" + id).css("top"))); 
					//console.log($("#row" + index + "col" + i).css("height"));
				}
			}
		}
	});
}

//draw a vertical, draggable line
function drawVerticalLine(x1, y1, x2, y2, xid) {

	var height = Math.abs(y1 - y2);
	var id = xid;
	var line = "<div id='" + id + "' class='line'> </div>";
	
	$("#divlines").append(line);
	
	$("#"+ id).css({
		left: x1,
		top: y1,
		width: 0,
		height: height,
		position: 'absolute',		
		backgroundColor: '#000'
	});
	
	$("#"+ id).draggable({
		axis: "x",
		containment: '#box'
	});
}

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

//return the y-position of a horizontal line
function getHorizontal(index)
{
	return parseInt($("#row" + index).css("top")) - parseInt($("#box").css("top"));
}

//return the x-position of a vertical line
function getVertical(index, jindex)
{
	return parseInt($("#row" + index + "col" + jindex).css("left")) - parseInt($("#box").css("left"));
}

//serializes form data into JSON object.
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