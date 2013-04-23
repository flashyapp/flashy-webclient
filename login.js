$( document ).ready(function() {

		$("#logged_in").hide();
		$("#logout").hide();
		
		//if already logged in, hide login form
		if (($.cookie("username") != null) && ($.cookie("session_id") != null)) {
			$("#form").hide();
			$("#logged_out").hide();
			
			var logged_in_text = "Welcome back, " + $.cookie("username") + ".";
			$("#logged_in").text(logged_in_text);
			$("#logged_in").show();
			
			var logout_text = "Logout";
			$("#logout").text(logout_text);
			$("#logout").show();
		}
		
		//console.log($.cookie("username"));
		//console.log($.cookie("session_id"));
		
		//AJAX - LOGIN - send user data to server
		$("#form").submit(function(event) {
			event.preventDefault();
			var request = $("#form").serializeObject();
			$.ajax({
				url: "http://www.flashyapp.com/api/user/login",
				data: JSON.stringify(request),
				contentType: "application/json",
				type: "POST",
				dataType: "json",
				success: function(json) { 
					if (json.error == 0) {
						$.cookie("username", request.username, {
							expires: 30,
							domain: "www.flashyapp.com",
							path: "/"
						});
						$.cookie("session_id", json.session_id, {
							expires: 30,
							domain: "www.flashyapp.com",
							path: "/"
						});
						//console.log(request.username);
						//console.log($.cookie("username"));
						location.reload();
					}
					else if (json.error == 103) alert("Too many sessions (This should never actually appear.");
					else if (json.error == 101) alert("Invalid username or password.");
				},
				error: function(xhr, status) { 
					console.log(xhr);
					alert( "Error handling request.");
				},
				complete: function(xhr, status) { ; }
			});
		});
		
		$("#logout").click(function(event) {
			event.preventDefault();
			var request = {'username': $.cookie("username"), 'session_id': $.cookie("session_id")};
			$.ajax({
				url: "http://www.flashyapp.com/api/user/logout",
				data: JSON.stringify(request),
				contentType: "application/json",
				type: "POST",
				dataType: "json",
				success: function(json) {
					//console.log($.cookie("username"));
					$.cookie("username", null, {domain: "www.flashyapp.com", path: "/"});
					$.cookie("session_id", null, {domain: "www.flashyapp.com", path: "/"});
					//console.log($.cookie("username"));
					location.reload();
				},
				error: function(xhr, status) { console.log(xhr); },
				complete: function(xhr, status) { ; }
			});
		});
});

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