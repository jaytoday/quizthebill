 {% include "../../../static/scripts/utils/s3slider.js" %}
 
{% include "../../../static/scripts/jquery/jquery.jsupload.0.1.min.js" %}

SLIDER_TIMEOUT = 5000;
DEFAULT_NEW_SUBJECT_TEXT = "Subject Name";
DEFAULT_LINK_TITLE = "Link Description";
DEFAULT_LINK_URL = "http://";
DEFAULT_VIDEO_URL = "http://youtube.com/";	
DEFAULT_INVITE_TEXT = "Enter an E-mail Address";	
		
		$(function () {

       		

/*
 * 
 *   Refresh Subjects - Setup and initiate thumbnails
 * 
 */

var subjects_container = $('div#subjects_container');

subjects_container.bind("initiate", function(){

if (subjects_container.data('busy') == true) return false;
subjects_container.data('busy', true);

	var thumb_container = subjects_container.find('div#subject_thumb_container');
	 thumb_container.find('div.subject_thumb').each(function(n){
	 	
	 	
		var this_subject = $('#' + $(this).attr('id'), 'div#subject_frame_container');
		
		$(this).click(function(){
				if (thumb_container.data('busy') == true) return false;
				thumb_container.data('busy', true);
			  $('h2#subject_selection').text( $(this).text());
			  $('div#subject_thumb_container > div').removeClass('selected');
			  $(this).addClass('selected'); 
			  $('div.subject').hide().removeClass('selected'); this_subject.show().addClass('selected');
			  this_subject.trigger("initiate");  
			return setTimeout(function(){ thumb_container.data('busy', false);  }, 500);  
			  });
			
			// remove default image if there are custom images (if we will never have subjects without pictures, this isn't necessary)
			if ($(this).find('li').length > 1) { $(this).find('li:first').remove();  }

	});



/*
 * 
 *  Initiate Subject Event
 * 
 */
{% include "initiate_subject.js" %}
/*
 * 
 *  End Initiate Subject
 * 
 */




	$('div:first' , thumb_container).click(); // Open first subject       		
				
return setTimeout(function(){ subjects_container.data('busy', false);  }, 500); 

 		}); //end subject initiate

subjects_container.trigger("initiate");

     		


/*
 * 
 * Page Options
 * 
 */ 

// Create New Subject

//create_new_subject
$('button#create_new_subject').click(function(){  CreateNewSubject(subjects_container); });

	$('button.find_more_subjects').click(function(){ RefreshSubjects(subjects_container); });	

		}); //end onReady






/*
 * 
 *  Initiate Subject Methods
 * 
 */
{% include "subject_methods.js" %}
/*
 * 
 *  End Subject Methods
 * 
 */
