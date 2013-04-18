$( document ).ready(function() {
		
		//AJAX - send new user data to server
		$("#form").submit(function(event) {
			event.preventDefault();
			var userinfo = $("#form").serializeObject();
			$.ajax({
				url: "http://www.flashyapp.com/api/user/create_user",
				data: userinfo,
				type: "POST",
				dataType: "json",
				success: function(json) { alert("New user created."); },
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
