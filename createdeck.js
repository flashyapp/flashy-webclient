var resize_factor = 1;
var image_width;
var image_height;
var name;

function show_create_deck_dialog()
{	
	
    $("#overlay").show();
    $("#dialog-create-deck").show();
}

function hide_create_deck_dialog()
{
    $("#dialog-create-deck").hide();
}

function show_create_deck_from_list_form()
{
	//move everything else out of the way
	$("#card-content").empty();
	g_current_deck = null;
	$("#divlines").empty(); 
	hide_image_division_options();
	
	//display form
	$("#top-bar").html("<h2>Create Deck from List</h2>");
	$("#create-deck-from-list-form").show();
}

function hide_create_deck_from_list_form()
{
	$("#create-deck-from-list-form").hide();
}

function show_upload_image_dialog()
{
	$("#overlay").show();
	$("#dialog-upload-image").show();
}

function hide_upload_image_dialog()
{
	$("#dialog-upload-image").hide();
}

function show_image_division_options()
{
	$("#option-list").hide();
	$("#image-division-options").show();
}

function hide_image_division_options()
{
	$("#top-bar").html("");
	$("#image-division-options").hide();
	$("#option-list").show();
}

function create_deck_from_image() {
	
	var request = $("#from-image-form").serializeObject();
	request.username = $.cookie("username");
	request.session_id = $.cookie("session_id");
	request.name = name;
	
	var newdivs = new Array(numRows);
	
	for (i = 0; i < numRows; i++)
	{
		newdivs[i] = new Array(2);
	
		if (i != numRows - 1) newdivs[i][0] = Math.round(getHorizontal(i) * resize_factor);
		else newdivs[i][0] = image_height;
		
		newdivs[i][1] = new Array(numCols[i]);
		newdivs[i][1][0] = 0;
		
		for (j = 1; j < numCols[i] - 1; j++)
		{
			newdivs[i][1][j] = Math.round(getVertical(i, j-1) * resize_factor);
		}
		
		newdivs[i][1][j] = image_width;
	}
	
	//console.log(newdivs);
	
	request.divs = newdivs;
	
	var urltext = "http://www.flashyapp.com/api/deck/new/from_image";
	
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
				location.reload();
			}
			console.log(json);
		},
		error: function(xhr, status) { 
			console.log(xhr);
			alert( "Error handling request.");
		},
		complete: function(xhr, status) { ; }
	});
	
	$("#divlines").empty();
	hide_image_division_options();
}

//create new deck from a list of terms
function create_deck_from_list() {
	//event.preventDefault();
	
	var request = $("#from-list-form").serializeObject();
	request.username = $.cookie("username");
	request.session_id = $.cookie("session_id");
	
	//console.log(request);
			
	if ((request.username == null) || (request.session_id == null))
		alert("Please log in first to access deck creation features");
	else if (request.deck_name == "")
		alert("Please enter a name for your deck.");
	else {
		request.cards = createCards(request.list);
		
		//console.log(request.username, request.session_id, request.cards, request.deck_name, request.description);
		
		//AJAX - create deck from list
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
					//console.log(json);
					alert("New deck created successfully.");
				}
				location.reload();
			},
			error: function(xhr, status) { alert("Unknown error."); },
			complete: function(xhr, status) { ; }
		});
	}
}

//uploads the image to be used for creating a deck from an image
function upload_image() {
	//event.preventDefault();
	
	$("#from-image-form").append("<input type='hidden' id='username' name='username'></input> <input type='hidden' id='session_id' name='session_id'></input>");
	
	$("#username").val($.cookie("username"));
	$("#session_id").val($.cookie("session_id"));
	
	$("#from-image-form").ajaxSubmit({
		url: "http://www.flashyapp.com/api/deck/new/upload_image",
		contentType: "multipart/form-data",
		type: "POST",
		dataType: "json",
		success: function(json) {
			if (json.error == 500) alert("Error: You don't have the permissions to access this feature. Please login or create a user account.");
			if (json.error == 101) alert("Error: You don't have the permissions to access this feature. Please login or create a user account.");
			if (json.error == 200) alert("Error: Please upload a valid image");
			if (json.error == 0) {
				name = json.name;
				display_image(json.divs, json.name);
			}
			//console.log(json);
		},
		error: function(xhr, status) { 
			console.log(xhr);
			alert( "Error handling request.");
		},
		complete: function(xhr, status) { ; }
	});
}

//displays the uploaded image
function display_image(divs, name) {
		
	var w;
	var h;
	
	//adapted from http://stackoverflow.com/questions/623172/how-to-get-image-size-height-width-using-javascript
	var img = new Image();
	img.onload = function() {
		image_width = this.width;
		image_height = this.height;
		
		w = image_width;
		h = image_height;
		
		//get correct resize factor for image
		resize_factor = 1;
		while ((h > 500) || (w > 700))
		{
			resize_factor = resize_factor * 1.5;
			h = h / 1.5;
			w = w / 1.5;
		}
		
		//console.log(w, h, resize_factor);
		
		//move everything else out of the way
		hide_upload_image_dialog();
		hide_overlay();
		$("#card-content").empty();
		g_current_deck = null;
		hide_create_deck_from_list_form();
		
		//position div at center
		$("#divlines").css("height", image_height / resize_factor);
		$("#divlines").css("width", image_width  / resize_factor);
		$("#divlines").css("top", 250 - (image_height / (resize_factor * 2)));
		$("#divlines").css("left", 350 - (image_width / (resize_factor * 2)));
		
		//draw resized image
		$("#divlines").append("<img src='http://www.flashyapp.com/resources/tmp/" + name 
		+ "' alt='preview' class='image' id='image' height=" + image_height / resize_factor
		+ " width=" + image_width / resize_factor + "></img>");
		
		//draw image division lines
		drawImageLines(divs);
		
		$("#top-bar").html("<h2>Fix Image Line Division</h2>");
		show_image_division_options();		
	}	
	
	//load the image off-screen first to get height and width
	img.src = "http://www.flashyapp.com/resources/tmp/" + name;
	img.style.position = "absolute";
	img.style.left = -9999;
	img.style.visibility = "hidden";
	document.body.appendChild(img);
	document.body.removeChild(img);		
}

//Transforms textarea list of terms into a deck of cards
function createCards(string)
{
	var list = string.split("\n");
	var cards = [];
	
	for (line in list)
	{
		//console.log(list[line]);
		var pair = list[line].split("|");
		card = {sideA : pair[0], sideB : pair[1]};
		//console.log(card.sideA, card.sideB);
		cards.push(card);
	}
	
	return cards;
}

function hook_from_list_form() {
        
	$("#from-list-form").submit(function(event) {
		event.preventDefault();
		create_deck_from_list();
    });
}

function hook_upload_image() {
	
	$("#from-image-form").submit(function(event) {
		event.preventDefault();
		var request = $("#from-image-form").serializeObject();
		if (request.deck_name == "") alert("Please enter a name for your deck.");
		else upload_image();
	});
}

function drawImageLines(divs) {

	var rowIndex = 0;
	var colIndex = 0;
	
	window.numRows = divs.length;
	window.numCols = [divs.length];
	window.divs = divs;
	
	for (i = 0; i < numRows; i++)
		numCols[i] = divs[i][1].length;
	
	var x1 = parseInt($(".image").css("left"));
	var y1 = parseInt($(".image").css("top"));
	var x2 = parseInt($("#image").attr("width")) + parseInt($(".image").css("left"));
	var y2 = parseInt($("#image").attr("height")) + parseInt($(".image").css("top"));

	console.log(x1 + " " + y1 + " " + x2 + " " + y2); 
		
	drawImageBox(x1, y1, x2, y2);
	var boxHeight = Math.abs(y1 - y2);
	var boxWidth = Math.abs(x1 - x2);
	
	var prevY = y1;
	for (i = 0.0; i < numRows - 1; i++)
	{
		var y = divs[i][0] / resize_factor;	
		var yid = "row" + rowIndex;
		drawHorizontalLine(x1, y, x2, y, rowIndex);
		
		colIndex = 0;
		for (j = 1.0; j < divs[i][1].length - 1; j++)
		{
			var x = divs[i][1][j] / resize_factor;
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
		var x = divs[i][1][j] / resize_factor;
		var xid = "row" + rowIndex + "col" + colIndex;
		drawVerticalLine(x, prevY, x, y2, xid);
		colIndex++;
	}
}

//add horizontal line to divlines
function add_horizontal()
{
	var x1 = 0;
	var x2 = parseInt($("#box").css("width"));
	var y = parseInt($("#box").css("height")) - 5;
	var index = numRows;
	
	drawHorizontalLine(x1, y, x2, y, numRows - 1);
	
	numCols[numRows] = numCols[numRows - 1];
	
	for (i = 0; i < numCols[numRows] - 2; i++)
	{
		if (numRows - 2 < 0) var h = parseInt($("#row" + (numRows - 1)).css("height"));
		else var h = parseInt($("#row" + (numRows - 1)).css("height")) - parseInt($("#row" + (numRows - 2)).css("height"));
		$("#row" + (numRows - 1) + "col" + i).css("height", h);		
		
		var x = parseInt($("#row" + (numRows - 1) + "col" + i).css("left"));
		//console.log(x);
		var y1 = y;
		var y2 = y + 5;
		var xid = "row" + numRows + "col" + i;
		drawVerticalLine(x, y1, x, y2, xid);
	}
	
	numRows++;
}

//add a vertical line to every horizontal div in divlines
function add_vertical()
{
	var x = parseInt($("#box").css("width")) - 5;
	var y1 = 0;
	for (i = 0; i < numRows; i++)
	{
		//console.log(numCols[i]);
		if (i != numRows - 1) var y2 = parseInt($("#row" + i).css("top"));
		else var y2 = parseInt($("#box").css("height"));
		var xid = "row" + i + "col" + (numCols[i] - 2);
		
		drawVerticalLine(x, y1, x, y2, xid);
		
		y1 = y2;
		numCols[i]++;
	}
}

//removes the last horizontal line in divlines, along with all attached verticals
function delete_horizontal()
{
	numRows--;
	
	$("#row" + (numRows - 1)).remove();
	
	for (i = 0; i < numCols[numRows] - 2; i++)
	{
		var h = parseInt($("#box").css("height")) - parseInt($("#row" + (numRows - 1)).css("height"));
		console.log(h);
		$("#row" + (numRows-1) + "col" + i).css("height", h)
		$("#row" + numRows + "col" + i).remove(); 
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
			for (i = 0; i < numCols[index] - 1; i++)
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

$( document ).ready(function() {
	
	//hide dialogs
	hide_create_deck_dialog();
	hide_create_deck_from_list_form();
	hide_upload_image_dialog();
	hide_image_division_options();
	
	console.log("showing create deck script");
	
	//click handlers
	$("#create-deck").click(show_create_deck_dialog);
	$("#create-deck-cancel").click( function() { hide_create_deck_dialog(); hide_overlay(); });
	$("#create-deck-from-list").click( function () { hide_create_deck_dialog(); hide_overlay(); 
		show_create_deck_from_list_form(); });
	$("#create-deck-from-image").click( function() { hide_create_deck_dialog();
		show_upload_image_dialog(); });
	hook_from_list_form();
	$("#upload-image-cancel").click( function() { hide_upload_image_dialog(); hide_overlay(); });
	hook_upload_image();
	$("#image-submit").click(create_deck_from_image);
	$("#image-cancel").click( function() { $("#divlines").empty(); hide_image_division_options(); });
	$("#add-horizontal").click(add_horizontal);
	$("#add-vertical").click(add_vertical);
	$("#delete-horizontal").click(delete_horizontal);
});