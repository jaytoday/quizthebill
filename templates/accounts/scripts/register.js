
 
 {% include "../../../static/scripts/utils/typewatch.js" %} 
 


$(function(){
	
//TODO: Check for invalid chars, like $ and <, etc.

var notice = $('div#notice');

$('input#nickname').preserveDefaultText('your name');
$('input#email_address').preserveDefaultText('your email address');


$('input#nickname').keydown(function(){ $('input#nickname').data('availability', 'unknown');  }); // just for sneaky fast people

$('input#nickname').typeWatch( 
 {
    callback:function(){ NicknameCheck(notice); },
    wait:300,          // milliseconds
    highlight:true
}
);


$('div#submit_nickname').click(function(){ SubmitName(); });

NicknameCheck(notice);


// flyer
$('#flyer a').css('top', '50%').show().animate({left: "100%"},17000);

});



function SubmitName(){

	var $nickname = $('input#nickname');
	var $email = $('input#email_address');
	var $signup_reminder = $('div#signup_reminder');
	
	if($nickname.data('availability') == 'unknown') {
				NicknameCheck($('div#notice'));
				return setTimeout(function(){ SubmitName(); }, 1000);  // still unknown
	}
	$signup_reminder.empty();
	if ($nickname.val().length < 4) { $signup_reminder.text('Your nickname must be at least 4 characters long.').show(); $nickname.addClass('invalid').focus(); return false; } //hasn't chosen a valid name yet 
	if($nickname.data('availability') != 'available') { $signup_reminder.text("The nickname you've entered isn't available.").show(); $nickname.addClass('invalid'); return false; } //hasn't chosen a valid name yet 
	if($email.val().indexOf('@') == -1) { $signup_reminder.text('Enter a valid e-mail address so you can recover your account.').show(); $email.addClass('invalid').focus(); return false; } //hasn't chosen a valid name yet 
	$('div.loading').show();
	$('div.main').hide();
	window.location="/register?nickname=" + $nickname.val() + "&email=" + $email.val();
	
}

function NicknameCheck(notice){
	
	notice.find('span').hide().end().find('span#checking').show();
	var nickname = $('input#nickname').val();
	
	if (nickname.length < 4) { notice.find('span#checking').hide().end().find('span#too_short').show();  return false; }
	
$.ajax({
		url: http_host + '/accounts/rpc?',
        data:
			{
					action: "nickname_check",
					arg0: '"' + nickname + '"'
			},
		success: function(response) { 
			
			var response =  eval(response);

			notice.find('span#checking').hide().end().find('span#' + response).show();
			
			$('input#nickname').data('availability', response) 
			
			} 
		

});


}
