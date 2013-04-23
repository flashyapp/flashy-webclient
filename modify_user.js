$( document ).ready(function() {

		//hide logged-in features
		$("#logged_in").hide();
		$("#form").hide();

		//if logged in, display change password form
		if (($.cookie("username") != null) && ($.cookie("session_id") != null)) {
			$("#logged_in").show();
			$("#form").show();
		}
		
		//AJAX - Change password
		$("#form").submit(function(event) {
			event.preventDefault();
			var request = $("#form").serializeObject();
			request.username = $.cookie("username");
			
			var password_valid = ((request.new_password != "") 
				&& (request.new_password === request.cf_new_password)); 
			if (!password_valid) alert("Please make sure you have entered your new password correctly.");
			
			if (password_valid) {
				$.ajax({
					url: "http://www.flashyapp.com/api/user/modify",
					data: JSON.stringify(request),
					contentType: "application/json",
					type: "POST",
					dataType: "json",
					success: function(json) { 
						if (json.error == 0) { 
							alert("Password changed successfully.");
							location.reload();
						}
						else if (json.error == 101) 
							alert("The old password you entered was incorrect. Please try again.");
					},
					error: function(xhr, status) { 
						console.log(xhr);
						alert("Error handling request."); 
					},
					complete: function(xhr, status) { ; }
				});
			}	
		});
		
		//AJAX - Reset password via email
		$("#reset_password").submit(function(event) {
			event.preventDefault();
			var request = $("#reset_password").serializeObject();
			
			$.ajax({
				url: "http://www.flashyapp.com/api/user/reset_password",
				data: JSON.stringify(request),
				contentType: "application/json",
				type: "POST",
				dataType: "json",
				success: function(json) {
					if (json.error == 0) {
						alert("We have reset your password and sent a replacement to your email address. Please check your email within the hour to receive and change your new password.");
						location.reload();
					}
					else if (json.error == 101)
						alert("The username you entered did not match the email address you entered. Please try again.");
				},
				error: function(xhr, status) {
					console.log(xhr);
					alert("Error handling request.");
				},
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