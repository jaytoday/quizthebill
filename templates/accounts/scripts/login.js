
 
$(function(){
	
	/* Reset Account Access */
	
 $('a#reset').click(function(){
			$('div.login_box div#proxy_login').hide();
			$('div.login_box div#reset_account').show();
			$('input#email_address').preserveDefaultText('your email address');
			$(this).hide();
			$(this).parent().find('a#login_options').css({'display': 'inline'});
		});
		
		$('div.login_box').find('#login_options').click(function(){
			$('div.login_box div#reset_account').hide();
			$('div.login_box div#proxy_login').show();
			 $('span.note').find('#login_options').hide();
			 $('span.note a#reset').css({'display': 'inline'});
			 
		});
		
				
		$('div.login_box div#reset_account button#submit').click(function(){
			
			var submit_button = $(this);
			
					var checking = $(this).parent().find('div#checking');
					var error_text = $(this).parent().find('div#error');
					error_text.hide();
					
				var email = $("input#email_address").val();
				if (email == "" ) {
				error_text.text('Enter Your Registered E-mail Address'); 
				error_text.show();
				return false;
			  }
				if (email.indexOf("@") == -1) {
				error_text.text('Invalid E-mail Address'); 
				error_text.show();
				return false;
			  }

					
				
				submit_button.attr('disabled', true);
				checking.show();
				// ajax call
				$.ajax({
				type: "POST", 
				url: '/accounts/rpc/post',
				datatype: "json",
				data:
					{
							action: "reset",
							email: email
					},
				success: function(response) { 

					submit_button.attr('disabled', false);
					checking.hide();
					
					if (eval(response) == "OK") {
						$('div.login_box div#reset_account div#submit_email').hide();
						$('div.login_box div#reset_account div#submit_email_success').show();
					}
					else {
					error_text.text("This E-mail Address Is Not Linked To A PlopQuiz Account"); 
				    error_text.show();	
					}
				
				}     
				});	
			
							
		});
		
		
	$('div#pq_login_link a').click(function(){
		if ($(this).attr('id') == "email") {
			
			$(this).hide('slow');
			$(this).parent().find('a#proxy').show('slow');
			
		}
		
		if ($(this).attr('id') == "proxy"){
			
			$(this).hide('slow');
			$(this).parent().find('a#email').show('slow');
			
		}
});
 
});
 
function PrivacyPolicy() {
	
        	$("#privacy_policy").dialog({ 
    modal: true,
    resizable: false,
    draggable: true, 
    height: 380,
	width: 535,
    overlay: { 
        opacity: 0.5, 
        background: "black" 
    },
        buttons: { 
        "Ok": function() { 
            $(this).dialog("close"); 
        }
    } 
     
}).show();  // show() is to show hidden dialog 

}
