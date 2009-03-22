
DEFAULT_EMAIL_VAL = "Enter your E-mail Address";
 
 $(function(){
 	
$('div#updates').find('input').preserveDefaultText(DEFAULT_EMAIL_VAL);

$('div.bill').hover(function(){ 	
	$(this).css({"background-color":"#CCCCCC","border-color":"#CCCCCC"});
	$(this).find('div').css({"color":"#000080"});
	},function(){
	$(this).css({"background-color":"#DDDDDD","border-color":"#DDDDDD"});
	$(this).find('div').css({"color":"#000040"});
});

$('div#updates').find('button').click(function(){
	var email = $('div#updates').find('input').val();
	console.log(email); 
	if (email.indexOf('@') == -1) return alert("Make sure you have entered a valid e-mail address");
	if (email.indexOf('@') > -1) {
		
       $('div#updates').find('button').attr('disabled', true);
       
        jQuery.ajax({
	type: "POST",
	url:  "/rpc/post",
	data:
	{
			action: "GetBillUpdates",
			email: email
	},
	success: function(response)
	{ 	 alert("You are now signed up! Check your inbox for a confirmation e-mail.")
	}
});
		}
		
		
	 	});
	 	

 	});
 	
