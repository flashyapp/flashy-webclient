$( document ).ready(function() {
		
		//Change image from front to back. Will eventually implement ajax for generic cards
		$("img").click(function(event) {
			if ( $("img").attr("src") == "http://www.flashyapp.com/user_images/11.png")
			{
				event.preventDefault();
				$("img").attr("src", "http://www.flashyapp.com/user_images/12.png");
			}
			else if ( $("img").attr("src") == "http://www.flashyapp.com/user_images/12.png")
			{
				event.preventDefault();
				$("img").attr("src", "http://www.flashyapp.com/user_images/11.png");
			}
		});
});