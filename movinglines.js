$(document).ready(function() {

	var rowIndex = 0;
	var colIndex = 0;
	
	window.numRows = 5;
	window.numCols = 5;
	
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
		var y = (i+1) * y2 / numRows;	
		var yid = "row" + rowIndex;
		drawHorizontalLine(x1, y, x2, y, rowIndex);
		
		colIndex = 0;
		for (j = 0.0; j < numCols - 1; j++)
		{
			var x = (j+1) * x2 / numCols;
			var xid = yid + "col" + colIndex;
			drawVerticalLine(x, prevY, x, y, xid);
			colIndex++;
		}
		
		prevY = y;
		rowIndex++;
	}
	
	//bottom row
	colIndex = 0;
	for (j = 0.0; j < numCols - 1; j++)
	{
		var x = (j+1) * x2 / numCols;
		var xid = "row" + rowIndex + "col" + colIndex;
		drawVerticalLine(x, prevY, x, y2, xid);
		colIndex++;
	}
});


function drawImageBox(x1, y1, x2, y2, imageid) {

	var width = Math.abs(x1 - x2);
	var height = Math.abs(y1 - y2);
	var box = "<div id='box' class='box'> </div>";
	
	$('body').append(box);
	
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
	
	$('body').append(line);
	
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
			for (i = 0; i < window.numCols - 1; i++)
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
	
	$('body').append(line);
	
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