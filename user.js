var LOGIN_FORM = "#login-form";

//show and hide dialogs
function show_login_dialog()
{
    $("#overlay").show();
    $("#dialog-login").show();
}

function hide_login_dialog()
{
    $("#overlay").hide();
    $("#dialog-login").hide();
}

function show_reset_password_dialog()
{
    $("#overlay").show();
    $("#dialog-reset-password").show();
}

function hide_reset_password_dialog()
{
    $("#dialog-reset-password").hide();
}

function show_modify_user_dialog()
{
	$("#overlay").show();
	$("#dialog-modify-user").show();
}

function hide_modify_user_dialog()
{
	$("#dialog-modify-user").hide();
}

function show_ie_dialog()
{
	$("#overlay").show();
	$("#dialog-ie").show();
}

function hide_ie_dialog()
{
	$("#dialog-ie").hide();
}

function load_user_ui_elements()
{
    // set the username
    $("#username-display").text($.cookie("username"))
}

//Log the user into a session and set username, session_id cookies
function login_user() {
    //event.preventDefault();
	console.log("logging in user");
		
	var request = $("#login-form").serializeObject();
    
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
}

//Log the user out of a session and delete username, session_id cookies
function logout_user() {
    console.log("logging out the user");
    $.ajax({
	url: "http://www.flashyapp.com/api/user/logout",
	data: JSON.stringify({username: $.cookie("username"), session_id:$.cookie("session_id")}),
	contentType: "application/json",
	type: "POST",
	dataType: "json",
	success: function(json) {
	    //console.log($.cookie("username"));
	    $.cookie("username", null, {domain: "www.flashyapp.com", path: "/"});
	    $.cookie("session_id", null, {domain: "www.flashyapp.com", path: "/"});
	    $.cookie("deck_id", null, {domain: "www.flashyapp.com", path: "/"});
	    //console.log($.cookie("username"));
	    location.reload();
	},
	error: function(xhr, status) { console.log(xhr); },
	complete: function(xhr, status) { ; }
    });
}

//Adds a new user to the temporary files and 
function signup_user() {
    //event.preventDefault();
	console.log("signing up user");
		
	var request = $("#signup-form").serializeObject();
    
	//Check to see if username is valid
	var username_valid = validate_username(request.username);
	if (!username_valid) alert("Please enter a valid username.");
			
	//Check to see if password is valid
	var password_valid = validate_password(request.password); 
	if (!password_valid) alert("Please make sure you have entered your password correctly.");			
			
	//Check to see if email is valid
	var email_valid = validate_email(request.email);
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
}

function reset_password() {
	//event.preventDefault();
	
	var request = new Object();
	request.username = $("#reset-password-username").val();
	request.email = $("#reset-password-email").val();
	
	//AJAX - reset password
	$.ajax({
		url: "http://www.flashyapp.com/api/user/reset_password",
		data: JSON.stringify(request),
		contentType: "application/json",
		type: "POST",
		dataType: "json",
		success: function(json) {
			if (json.error == 0) {
				alert("We have reset your password. Please check your email within the hour to receive and change your new password.");
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
}

//Change the user's password
function modify_user() {
	//event.preventDefault();
	
	var request = new Object();
	request.old_password = $("#modify-user-old-password").val();
	request.new_password = $("#modify-user-new-password").val();
	request.cf_new_password = $("#modify-user-cf-new-password").val();
	request.username = $.cookie("username");
			
	var password_valid = ((request.new_password != "") && (request.new_password === request.cf_new_password)); 
	if (!password_valid) alert("Please make sure you have entered your new password correctly.");
	
	//AJAX - modify user
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
}

//These should be made more useful later
function validate_username(username) {
	return (username != "");
}

function validate_password(password) {
	return (password != "");
}

function validate_email(email) {
	return (email != "");
}

//click handler for login form
function hook_login_form() {
    console.log("hooking the login form")
    
	$("#login-form").submit(function(event) {
		event.preventDefault();
		login_user();
    });
}

//click handler for signup form
function hook_signup_form() {
    console.log("hooking the signup form")
    
	$("#signup-form").submit(function(event) {
		event.preventDefault();
		signup_user();
    });
}

//adapted from http://stackoverflow.com/questions/4169160/javascript-ie-detection-why-not-use-simple-conditional-comments
//determines if browser is Internet Explorer
function ie() {

    var undef,
        v = 3,
        div = document.createElement('div'),
        all = div.getElementsByTagName('i');

    while (
        div.innerHTML = '<!--[if gt IE ' + (++v) + ']><i></i><![endif]-->',
        all[0]
    );

    return v > 4 ? v : undef;

}

//execute on load
$( document ).ready( function() {
	console.log("User function hooks loading...");
	
	//hide dialogs
	hide_reset_password_dialog();
	hide_modify_user_dialog();
	hide_ie_dialog();
	
	// wrap the login form
	hook_login_form();
	// wrap the logout button
	$("#logout-button").click(logout_user);
	// wrap the signup form
	hook_signup_form();
	// handlers for reset password
	$("#reset-password").click( function() { hide_login_dialog(); show_reset_password_dialog(); });
	$("#reset-password-confirm").click(reset_password);
	$("#reset-password-cancel").click( function() { hide_reset_password_dialog(); show_login_dialog(); });
	// handlers for modify user
	$("#modify-user").click(show_modify_user_dialog);
	$("#modify-user-confirm").click(modify_user);
	$("#modify-user-cancel").click( function() { hide_modify_user_dialog(); hide_overlay(); });
	
	$("#ie-continue").click( function() { hide_ie_dialog();
		if ($("#dialog-login").is(":hidden")) hide_overlay(); });	
	
	//Check if internet explorer -- not supported
	if (ie()) show_ie_dialog();
		
	// if the user isn't logged in
	if (($.cookie("username") == null) || ($.cookie("session_id") == null)) {
	    console.log("User not logged in, showing login dialog")
	    // display the login panel
	    show_login_dialog();
	    return;
	}
	
	hide_login_dialog();
	load_user_ui_elements();

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

