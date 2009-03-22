

function RefreshSubjects(subjects_container) {
	
if (subjects_container.data('refreshing') == true) return false;
subjects_container.data('refreshing', true);

// subjects_container.find('.mini_loading').show();

var offset = parseInt(subjects_container.find('div.quiz_subjects').attr('id'));

	$.ajax({
		type: "POST", 
		url: '/editor/rpc/post',
		datatype: "json",
		data:
			{
					action: "refresh_subjects",
					offset: offset
			},
		error: function() { subjects_container.html("Error Refreshing Subjects"); },
		success: function(response) { subjects_container.html(response);  },
		complete: function(data) { subjects_container.data('refreshing', false); subjects_container.trigger('initiate'); 
		//subjects_container.find('div.quiz_subjects').attr('id', offset + OFFSET_JUMP); 
		}
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


function SaveBlurb(blurb_text, this_subject)
{


	$.ajax({
		type: "POST", 
		url: '/editor/rpc/post',
		datatype: "json",
		data:
			{
					action: "subject_blurb",
					subject_name: this_subject.name, 
					new_blurb: blurb_text
			},
		error: function() { AjaxError(); },
		success: function(response) {  }
	});  
}


function AddLink(link_url, link_title, this_subject)
{
var links_container = this_subject.find('.links_container');
if (links_container.data('busy') == true) return false;
links_container.data('busy', true);
links_container.find('li').hide().end().find('.mini_loading').show();

	$.ajax({
		type: "POST", 
		url: '/editor/rpc/post',
		datatype: "json",
		data:
			{
					action: "add_link",
					subject_name: this_subject.name, 
					link_url: link_url,
					link_title: link_title
			},
		error: function() { links_container.html("Error Adding Link"); },
		success: function(response) { 
			if (response == "error") return alert("Error adding link");
			links_container.html(response);  },
		complete: function(data) { links_container.data('busy', false); this_subject.trigger("initiate_links"); }
	});  
}


function RemoveLink(link_key, this_subject)
{

var links_container = this_subject.find('.links_container');
if (links_container.data('busy') == true) return false;
links_container.data('busy', true);

links_container.find('li').hide().end().find('.mini_loading').show();

	$.ajax({
		type: "POST", 
		url: '/editor/rpc/post',
		datatype: "json",
		data:
			{
					action: "remove_link",
					subject_name: this_subject.name, 
					link_key: link_key
			},
		error: function() { links_container.html("Error Adding Link"); },
		success: function(response) {  links_container.html(response);  },
		complete: function(data) { links_container.data('busy', false); this_subject.trigger("initiate_links"); }
	});  
}

function ChangeVideo(new_video_url, this_subject)
{

var video_container = this_subject.find('.video_container');
if (video_container.data('busy') == true) return false;
video_container.data('busy', true);

video_container.find('object').hide().end().find('.mini_loading').show();

	$.ajax({
		type: "POST", 
		url: '/editor/rpc/post',
		datatype: "json",
		data:
			{
					action: "change_video",
					subject_name: this_subject.name, 
					new_video_url: new_video_url
			},
		error: function() { video_container.html("Error Adding Video"); },
		success: function(response) { video_container.html(response);  },
		complete: function(data) { video_container.data('busy', false); }
	});  
}


function DeleteSubjectImage(this_img, this_subject)
{

if (this_img.data('busy') == true) return false;
this_img.data('busy', true);
var subject_images = this_subject.find('div.subject_images');
var img_key = this_img.attr('id');

subject_images.find('div').hide().end().find('.mini_loading').show();

	$.ajax({
		type: "POST", 
		url: '/editor/rpc/post',
		datatype: "json",
		data:
			{
					action: "delete_subject_image",
					subject_name: this_subject.name, 
					img_key: img_key
			},
		error: function() { subject_images.html("Error Adding Video"); },
		success: function(response) {  subject_images.html(response); this_subject.trigger("initiate_images");  },
		complete: function(data) { this_img.data('busy', false); }
	});  
}


function SetupAdminRights(this_subject) {
	$('div.lower_level', this_subject).find('button.rights').click(function(){ ChangeRights( $(this) ); });
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
		url: '/editor/rpc/post',
		datatype: "json",
		data:
			{
					action: "change_rights",
					rights_action: rights_action, 
					user: user,
					subject_name: subject_name,
			},
		error: function() { AjaxError(); },
		success: function(response) { container.html(response);  },
		complete: function() { SetupAdminRights(); } 
	});	

	
}



function CreateNewSubject(subjects_container) {
var new_subject_dialog = $("div#new_subject");
        	new_subject_dialog.dialog({ 
    modal: true,
    resizable: false,
    draggable: true,
    dialogClass: 'create_subject', 
    height: 320,
	width: 665,
    overlay: { 
        opacity: 0.8, 
        background: "black" 
    },
        buttons: { 
        "Create This Subject": function() { 
           var subject_name = $(this).find('input').val();

          if (subject_name == DEFAULT_NEW_SUBJECT_TEXT || subject_name.length < 4) return alert('Please enter a subject name at least four characters long.'); 
          if (new_subject_dialog.data('busy') == true) return false;
         new_subject_dialog.data('busy', true);
         
        $.ajax({
		type: "POST", 
		url: '/editor/rpc/post',
		datatype: "json",
		data:
			{
					action: "create_new_subject",
					subject_name: subject_name
			},
		error: function() { AjaxError(); },
		success: function(response) { 
			if (response == "exists") return alert("Sorry. A subject with this name already exists.")
			subjects_container.html(response);
			new_subject_dialog.dialog("close");			
			  },
		complete: function(data) { new_subject_dialog.data('busy', false); subjects_container.trigger('initiate');  }
	});	
            
        }
    } 
     
}).dialog("open").show()
  .find('input').val(DEFAULT_NEW_SUBJECT_TEXT).preserveDefaultText(DEFAULT_NEW_SUBJECT_TEXT).focus();  // show() is to show hidden dialog 

}



function JoinSubject(this_subject)
{


	$.ajax({
		type: "POST", 
		url: '/editor/rpc/post',
		datatype: "json",
		data:
			{
					action: "join_subject",
					subject_name: this_subject.name
			},
		error: function() { AjaxError(); },
		success: function(response) { this_subject.find('div.member_section').html(response);  },
		complete: function(){ this_subject.trigger('member_section');  }
	});  
}



function SendInvite(this_subject, email_address)
{

if (this_subject.invite.data('busy') == true) return false;
this_subject.invite.data('busy', true);

	$.ajax({
		type: "POST", 
		url: '/editor/rpc/post',
		datatype: "json",
		data:
			{
					action: "send_invite",
					subject_name: this_subject.name, 
					email_address: email_address
			},
		error: function() { },
		success: function(response) {  $('input', this_subject.invite).val(DEFAULT_INVITE_TEXT); if (response != "OK") return false;
		var successful = this_subject.invite.find('div.success'); successful.text("Your invite was successfully sent to " + email_address).show('slow');
		return setTimeout(function(){ successful.hide('slow');  }, 5000);    },
		complete: function(data) { this_subject.invite.data('busy', false); }
	});  
}
