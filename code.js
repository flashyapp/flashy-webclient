$( document ).ready(function() {
		
		//Change image from front to back. Will eventually implement ajax for generic cards
		$("img").click(function(event) {
			if ( $("img").attr("src") == "http://www.flashyapp.com/user_images/1.jpg")
			{
				event.preventDefault();
				$("img").attr("src", "http://www.flashyapp.com/user_images/4.gif");
			}
			else if ( $("img").attr("src") == "http://www.flashyapp.com/user_images/4.gif")
			{
				event.preventDefault();
				$("img").attr("src", "http://www.flashyapp.com/user_images/1.jpg");
			}
		});
});