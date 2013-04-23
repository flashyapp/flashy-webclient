$( document ).ready(function() {
		
		//AJAX - send new user data to server
		$("#form").submit(function(event) {
			event.preventDefault();
			var request = $("#form").serializeObject();
			
			//Check to see if username is valid
			var username_valid = (request.username != "");
			if (!username_valid) alert("Please enter a valid username.");
			
			//Check to see if password is valid
			var password_valid = ((request.password != "") && (request.password === request.cf_password)); 
			if (!password_valid) alert("Please make sure you have entered your password correctly.");			
			
			//Check to see if email is valid
			var email_valid = ((request.email != "") && (request.email === request.cf_email));
			if (!email_valid) alert("Please make sure you have entered your email address correctly.");
			
			if (username_valid && password_valid && email_valid)	{			
				//Send to server
				$.ajax({
					url: "http://www.flashyapp.com/api/user/create_user",
					data: JSON.stringify(request),
					contentType: "application/json",
					type: "POST",
					dataType: "json",
					success: function(json) {
						if (json.username_s == 0) alert("Invalid username");
						if (json.password_s == 0) alert("Invalid password");
						if (json.email_s == 0) alert("Invalid email");
						if ((json.username_s == 1) && (json.password_s == 1) && (json.email_s == 1)) 
							alert("New user created."); },
					error: function(xhr, status) { 
						console.log(xhr);
						alert("Error handling request"); },
					complete: function(xhr, status) { ; }
				});
			}
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