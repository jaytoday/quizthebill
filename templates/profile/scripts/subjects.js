 {% include "../../../static/scripts/utils/s3slider.js" %}
 
{% include "../../../static/scripts/jquery/jquery.jsupload.0.1.min.js" %}

SLIDER_TIMEOUT = 5000;

		$(function () {


// setup thumbnails
$('div#subject_thumb_container > div').each(function(n){
    var this_subject = $('#' + $(this).attr('id'), 'div#subject_frame_container');
    var this_frame = $('.subject_frame', this_subject);
    
	$(this).click(function(){

      $('h2#subject_selection').text( $(this).text());
      $('div#subject_thumb_container > div').removeClass('selected');
      $(this).addClass('selected'); $('.subject').hide(); this_subject.show(); this_frame.s3Slider({ timeOut: SLIDER_TIMEOUT }); 
 	});
  	
	// remove default image if there are custom images (if we will never have subjects without pictures, this isn't necessary)
	if ($(this).find('li').length > 1) { 
	    this_frame.find('li:first').remove();  $(this).find('li:first').remove();  
	}

});
$('div:first' ,'div#subject_thumb_container').click(); // Open first subject
        
		

$('button.edit').click(function(){
    var this_blurb = $(this).parent().parent().find('div.blurb_text'); 
    var blurb_text = this_blurb.html();
    this_blurb.hide().parent().find('textarea').val(blurb_text).show().focus().keyup()
    .end().find('button.edit').hide().end().find('button.save').show(); 
       });
       
       $('button.save').click(function(){ 
           var this_textarea = $(this).parent().parent().find('textarea'); 
           var blurb_text = this_textarea.val();
           // save text via ajax call
           SaveBlurb(blurb_text, $(this).attr('id'));
           this_textarea.hide().parent().find('div.limit').hide().end()
                                        .find('div.blurb_text').html(blurb_text).show()
           .end().find('button.save').hide().end().find('button.edit').show(); 
              });


$('div.blurb_text').bind('dblclick', function() { $(this).parent().find('button.edit').click(); })


	// textarea character count for aboutme section
	 	$('textarea', 'div.blurb').keyup(function(){
	 	    var limit_id = $(this).parent().find('.limit').show().attr('id');
	limitChars($(this).attr('id'), 450, limit_id);
});


// Upload New Image
$('.upload_picture').find('button').each(function(){ 
var subject_name = $(this).parent().attr('id');
var subject_frame = $(this).parent().parent().find('div.subject_frame');
$(this).jsupload({
    // Location of the serverside upload script
    action: '/profiles/rpc/post/subject_img/' + subject_name,
    // File upload name
    name: 'subject_img',
    // Function that gets called when file upload is starting
    onSubmit: function(filename) {
      //You can do filename validation here
      //and return false to cancel the upload
      subject_frame.hide('fast').parent().find('.loading').show('fast');
      
    },
    // Function that gets called when file upload is completed
    onComplete: function(result){
      //Result is what we got from server script
      if (result == "error"){ console.log('error uploading image!'); return; }
      subject_frame.parent().find('.loading').hide('fast');
      subject_frame.html(result).find('li:first').remove().end()
                   .show().s3Slider({ timeOut: SLIDER_TIMEOUT });
    }
    }); }); 



$('ul.subject_nav').tabs();

$('div.footer').find('button.save').hide();




SetupAdminRights();


		
		}); //end onReady


 function SubmitSettingsEdit() {
// get the different pieces of data, and submit them

// TODO: We can use jQuery.serialize() for fast form serialization
$('div.main').hide();$('div.loading').show();

	$.ajax({
		type: "POST", 
		url: '/employer/rpc/post',
		datatype: "json",
		data:
			{
					action: "settings",
					sponsor: this_sponsor, // defined in sponsor_settings.html
					sponsorship_message: $('textarea#sponsor_message').attr('value'),
					quiz_subject: $('#quiz_subjects').data('subject')
			},
		error: function() { AjaxError(); },
		success: function(response) { onEditSuccess(response); }
});			


	                      
}
	


function AjaxError() {
console.log('ajax error!');
return;
// TODO...
$('div.loading').hide(); $('div.main').show(); 
		$('.form_error').show()
		  .find('a').click(
		  function(){ $('a#contact_dialog').click(); } );
return false;
}

 








	function onEditSuccess(response){

	if (eval(response) != "OK") { // error message.
		return AjaxError(); }
	
	//window.location=profile_path;
}
function CancelSettingsEdit(){
$('div.main').hide();$('div.loading').show();	
//window.location=profile_path;
}



function limitChars(textid, limit, infodiv)
{
	var text = $('#'+textid).val();	
	var textlength = text.length;
	if(textlength > limit)
	{
		//$('#' + infodiv).html("You've reached the "+limit+" limit ");
		$('#'+textid).val(text.substr(0,limit));
		return false;
	}
	else
	{
		$('#' + infodiv).html((limit - textlength) +' characters left');
		return true;
	}
}


function SaveBlurb(blurb_text, this_subject_name)
{


	$.ajax({
		type: "POST", 
		url: '/profiles/rpc/post',
		datatype: "json",
		data:
			{
					action: "subject_blurb",
					subject_name: this_subject_name, 
					new_blurb: blurb_text
			},
		error: function() { AjaxError(); },
		success: function(response) {  }
	});
    
    
}

function SetupAdminRights() {
	$('div.lower_level').find('button.rights').click(function(){ ChangeRights( $(this) ); });
}

function ChangeRights(button){

	var this_choice = button.parent().find("option:selected");
	if (this_choice.length < 1) return alert("Please select a user"); 
	var user = this_choice.attr('id');
	var rights_action = button.attr("id");
    if (rights_action == "remove_admin") {
	if (user ==  this_choice.parents(".current_admins:first").attr('id')) return alert("E-mail support@plopquiz.com to remove your own administrator status");
    }
	// Todo: loading...
	var container = button.parents(".admin_rights:first");
	var subject_name = container.attr('id');


	$.ajax({
		type: "POST", 
		url: '/profiles/rpc/post',
		datatype: "json",
		data:
			{
					action: "change_rights",
					rights_action: rights_action, 
					user: user,
					subject: subject_name,
			},
		error: function() { AjaxError(); },
		success: function(response) { container.html(response);  },
		complete: function() { SetupAdminRights(); } 
	});	

	
}
