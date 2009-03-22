/*
 * 
 * This code is badly in need of a tune-up. It needs more efficient use of:
 * 
 *  selector context,
 * selectors and events in loops, 
 * ID selectors instead of CLASS selectors, wherever possible
 * chaining,
 * no DOM manipulation just for data
 * everything wrapped in a single element for DOM insertion
 * for SEO-important sections, add in unimportant markup in JS
 *
 */ 


{% include "../../../static/scripts/jquery/jquery.magicpreview.js" %}
{% include "../../../static/scripts/jquery/jquery.jsupload.0.1.min.js" %}
 
	


		$(function () {

			// Example 1
			$('form.signup input:text').magicpreview('mp_');
			// Example 2
			$('form.signup :text').magicpreview('p_');
			$('form.signup textarea').magicpreview('p_');
			$('form.signup  select').magicpreview('p_');



						$('div#submit_profile').click(function(){
				
	SubmitProfileEdits();
			});
			
			$('div.form_cancel').click(function(){
			onEditCancel()
		});
		
	$('div#cycle_img').click(function(){
			CyclePictures();
		});

 
 SetupImageUpload();
		
   //start off with no new image data
   $('div#photo').data('new_image', '');
    $('div.cancel').hide();
		
		
		// textarea character count for aboutme section
		 	$('textarea.aboutme').keyup(function(){
 		limitChars('aboutme', 80, 'chars_left');
 	});
 	limitChars('aboutme', 80, 'chars_left');
 	
		
		
		});

// Setup RPC methods
var server = {};
var item_count = 0;

InstallFunction(server, 'SubmitProfileEdits', 'accounts');
InstallPostFunction(server, 'SubmitPicture', 'profiles');

 function SubmitProfileEdits() {

$('div.main').hide(); $('div.loading').show();

// TODO: We can use jQuery.serialize() for fast form serialization
  
 var aboutme = $('textarea.aboutme').attr('value');
 var photo = $('div#photo').data('new_image');
 server.SubmitProfileEdits(eval('document.signup.fullname.value'),
 	                          eval('document.signup.email.value'),
	                          eval('document.signup.location.value'), 
	                          eval('document.signup.webpage.value'), 
	                          eval('document.signup.work_status.value'), 
	                          eval('document.signup.aboutme.value'),
	                          photo,
	                          onEditSuccess //-- this would ensure that webpage and email values are valid.
	                          );
                      
	                      
}
	


function UploadError() {

// notify the user of the uploading error

	
}


function RefreshImage(img_id){
	
$('div#photo > img').hide();
$('div#photo').append('<img class="new" src="/image/profile/?img_id=' + img_id + '&size=large />');
$('div#photo').data('new_image', img_id);
$('div.cancel').show();
} 



function SetupImageUpload(){
	
	 $('div#change_img').jsupload({
  // Location of the serverside upload script
  action: '/profiles/picture_upload/',
  // File upload name
  name: 'img',

  // Function that gets called when file upload is starting
  onSubmit: function(filename) {
    //You can do filename validation here
    //and return false to cancel the upload
  },
  // Function that gets called when file upload is completed
  onComplete: function(result){
    //Result is what we got from server script
    if (result == "error"){ UploadError(); return; }
    RefreshImage(result);
  }
  });
  
}

function CancelPhotoUpload(){
	$('div#photo > img.new').hide();
	$('div#photo > img.old').show();
	$('div#photo').data('new_image', '');
	$('div.cancel').hide();
}



function getNextPicture(photo_keys){
	
	
	var count = jQuery.inArray($('div#photo').data('new_image'), photo_keys) + 1;
	
	if (count >= photo_keys.length) { count = 0; }
	

	var img_id = photo_keys[count]
	RefreshImage(img_id)
	
	
}


	function onEditSuccess(response){
			//TODO make sure that response has no errors
			
				if (response != "OK") { // error message.
				return AjaxError(); 
 }

	window.location=redirect_path;
}



function AjaxError() {

$('div.loading').hide(); $('div.main').show(); 
		$('#form_error').show()
		  .find('a').click(
		  function(){ $('a#contact_dialog').click(); } );
return false;
}


function onEditCancel(){
$('div.main').hide(); $('div.loading').show();
	
window.location=redirect_path;
}

function CyclePictures(){

getNextPicture(photo_keys);

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
		$('#' + infodiv).html((limit - textlength) +' characters left.');
		return true;
	}
}

