$( document ).ready(function() {

	//if already logged in, show welcome text
	if (($.cookie("username") != null) && ($.cookie("session_id") != null)) {

		//Show welcome text
		var logged_in_text = "<p>Welcome back, " + $.cookie("username") 
			+ ". <a href='#' id='logout'>Logout</a> </p>"
			+ "<p> <a href='modify_user.html'>Change/Reset Password</a>";
		$("#logged_in").append(logged_in_text);
		$("#logged_in").show();					
	
		//Hide login functionality
		$("#logged_out").hide();
	}
	//if not, hide most functionality
	else { 
		;
	}
	
	//hide functionality until called
	$("#createdeck").hide();
	$("#getdeck").hide();
	
	//AJAX - LOGIN - send user data to server
	$("#login_data").submit(function(event) {
		event.preventDefault();
		var request = $("#login_data").serializeObject();
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
	
	//AJAX - Logout
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