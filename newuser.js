$( document ).ready(function() {
		
		//AJAX - send new user data to server
		$("#form").submit(function(event) {
			event.preventDefault();
			var request = $("#form").serializeObject();
			$.ajax({
				url: "http://www.flashyapp.com/api/user/create_user",
				data: request,
				contentType: "application/json",
				type: "POST",
				dataType: "json",
				success: function(json) {
					if (json.username_s == 0) alert("Error handling username status.");
					if (json.password_s == 0) alert("Error handling password status");
					if (json.email_s == 0) alert("Error handling email status");
					alert("New user created."); },
				error: function(xhr, status) { 
					//var json = $.parseJSON(xhr.responseText);
					console.log(request);
					if (json.username_s == 0) alert("Invalid username.");
					if (json.password_s == 0) alert("Invalid password.");
					if (json.email_s == 0) alert("Invalid email address.");
					if ((json.username_s == 1) && (json.password_s == 1) 
						&& (json.email_s == 1)) alert("Unknown error."); },
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