$( document ).ready(function() {

	//if already logged in, show welcome text
	if (($.cookie("username") != null) && ($.cookie("session_id") != null)) {						
			var logged_in_text = "Welcome back, " + $.cookie("username") + ".";
			$("#logged_in").text(logged_in_text);
			$("#logged_in").show();					
	}
});