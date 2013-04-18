$( document ).ready(function() {
		
		//AJAX - send new deck data to server
		$("#from_list").submit(function(event) {
			event.preventDefault();
			var userinfo = $("#from_list").serializeObject();
			$.ajax({
				url: "http://www.flashyapp.com/api/deck/new/from_list",
				data: userinfo,
				type: "POST",
				dataType: "json",
				success: function(json) { alert("New deck created."); },
				error: function(xhr, status) { alert("Unknown error."); },
				complete: function(xhr, status) { ; }
				});
		});
		
		
});

$( document ).ready(function() {

	//AJAX - create deck from image
		$("#from_image").submit(function(event) {
			event.preventDefault();
			var image = $("#from_image input[name=file]").val();
			$.ajax({
				url: "http://www.flashyapp.com/api/deck/new/from_image",
				data: image,
				contentType: "multipart/form-data",
				type: "POST",
				dataType: "json",
				success: function(json) { alert("New deck created from image."); },
				error: function(xhr, status) { alert("Unknown error."); },
				complete: function(xhr, status) { ; }
				});
		});
});

//serializes form data into JSON object
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