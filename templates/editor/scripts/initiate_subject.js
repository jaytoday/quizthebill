 
 $('div.subject').each(function(){ $(this).bind("initiate", function() {
 
 	var this_subject = $(this);
 	if (this_subject.data('triggered') == true) return false;
 	this_subject.data('triggered', true); 
 	this_subject.name = this_subject.find('div.top_level').attr('id');




 	 
/* Edit Description (re-use when possible) */
$('button.edit', this_subject).click(function(){
    var this_blurb = $(this).parent().parent().find('div.blurb_text'); 
    var blurb_text = this_blurb.html();
    this_blurb.hide().parent().find('textarea').val(blurb_text).show().focus().keyup()
    .end().find('button.edit').hide().end().find('button.save').show(); 
       });
       
       $('button.save', this_subject).click(function(){ 
           var this_textarea = $(this).parent().parent().find('textarea'); 
           var blurb_text = this_textarea.val();
           // save text via ajax call
           SaveBlurb(blurb_text, this_subject);
           this_textarea.hide().parent().find('div.limit').hide().end()
                                        .find('div.blurb_text').html(blurb_text).show()
           .end().find('button.save').hide().end().find('button.edit').show(); 
              });
              
$('div.blurb_text', this_subject).bind('dblclick', function() { $(this).parent().find('button.edit').click(); })

	// textarea character count for aboutme section
	 	this_subject.find('textarea.description').keyup(function(){
	 	    var limit_id = $(this).parent().find('.limit').show().attr('id');
	limitChars($(this).attr('id'), 450, limit_id);
});
/* End Description */



/* Edit Links */ 
	
// Add Link	
$('button.add_link', this_subject).click(function(){
var add_button = $(this).hide();
var edit_div = $(this).parent().find('div.new_link');
var link_title_input = edit_div.find('input.title').val(DEFAULT_LINK_TITLE).preserveDefaultText(DEFAULT_LINK_TITLE);
var link_url_input = edit_div.find('input.url').val(DEFAULT_LINK_URL).focus();
	
	// Save New Link
	edit_div.show().find('button.save_link').click(function(){
		var link_url = link_url_input.val();
		var link_title = link_title_input.val();		
		AddLink(link_url, link_title, this_subject);		
		edit_div.hide(); 
		add_button.show();		
		}); 

});

this_subject.bind("initiate_links", function(){	
// Remove Link
$('.links_container', this_subject).find('button.remove').click(function(){
var check = confirm("Delete this link?");if (check) { RemoveLink($(this).attr('id'), this_subject);	}		
});

}); this_subject.trigger("initiate_links");


 /* End Links */      


/* Edit Links */ 
	
// Change Video
$('button.change_playlist', this_subject).click(function(){
	var change_button = $(this); change_button.hide();
var edit_div = $(this).parent().find('div.change_playlist'); edit_div.show();
edit_div.find('button').show();
var change_video_input = edit_div.find('input');
edit_div.find('button').click(function(){ edit_div.hide(); change_button.show(); ChangeVideo(change_video_input.val(), this_subject); });	

});

var subject_images = this_subject.find('div.subject_images');

// Upload New Image
$('.upload_picture', this_subject).find('button').jsupload({
    // Location of the serverside upload script
    action: '/editor/rpc/post/subject_img/' + this_subject.name,
    // File upload name
    name: 'subject_img',
    // Function that gets called when file upload is starting
    onSubmit: function(filename) {
      //You can do filename validation here
      //and return false to cancel the upload
    subject_images.find('div').hide().end().find('div.mini_loading').show('fast');
      
    },
    // Function that gets called when file upload is completed
    onComplete: function(response){
      //Result is what we got from server script
      if (response == "error"){ console.log('error uploading image!'); return; }
     subject_images.html(response); this_subject.trigger("initiate_images");  }
    }); 


// Initiate Images - Delete Picture and events with subject frame
this_subject.bind("initiate_images", function() {
this_subject.delete_pictures = this_subject.find('div.delete_pictures > div').click(function(){	
	var this_img = $(this);
	var confirm_delete = confirm("Are you sure you want to delete this image?");	
	if (confirm_delete) { DeleteSubjectImage(this_img, this_subject); }
	});
	
// Initiate Subject Frame
var this_frame = $('.subject_frame', this_subject);
if (this_frame.find('li').length > 1) { $(this).find('li:first').remove();  }
this_frame.s3Slider({ timeOut: SLIDER_TIMEOUT });


/* Initiate Quiz Button */

this_subject.find('button.quiz_button').click(function(){
		$.getScript("/js/quiz/" + this_subject.name + "?autostart=True"); 
			// resize overlay to document not window
		function drawOverlay(){
		$('div#pq_quiz_overlay').css("height", $(document).height());
		}
		$(window).resize(drawOverlay); // whenever window is resized, overlay will be drawn. 


	$('div#pq_quiz_overlay').show().bind("displayQuiz", function()
                                      { $(this).hide();         }) ;
});


}).trigger("initiate_images");


//Join New Subjects
$('button.join', this_subject).click(function(){ 
	if ($(this).data('busy') == true) return false;
	 $(this).data('busy', true);
	 return JoinSubject(this_subject);	 
	 });
	 
	 
this_subject.bind("member_section", function() {
	var member_section = $(this_subject).find('div.member_section');
// Invite others to join subject by e-mail address
this_subject.invite = $(member_section).find('div.invite_contributors');
$('input', this_subject.invite).preserveDefaultText(DEFAULT_INVITE_TEXT);
$('button', this_subject.invite).click(function(){
	var invite_value = $('input', this_subject.invite).val();
	if (invite_value == DEFAULT_INVITE_TEXT || invite_value == "" || invite_value.indexOf('@') < 0) return alert("Please enter a valid e-mail address"); 
	return SendInvite(this_subject, invite_value); 
	 });
	 
});	this_subject.trigger('member_section');   // end member section 



	 
$('ul.subject_nav', this_subject).tabs();

$('div.footer', this_subject).find('button.save').hide();

SetupAdminRights(this_subject);



$('.hide', this_subject).hide();

}); }); // end subject initiate
