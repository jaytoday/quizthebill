
/*
 * 
 * Global Settings
 * 
 */
  
 var DEFAULT_ANSWER_TEXT = 'No Selection';
 var DEFAULT_ANSWER_INPUT_TEXT = 'write a custom answer';
 var DEFAULT_TOPIC_CHOICE =  "Pick a Topic";
 var DEFAULT_TOPIC_TEXT = 'write a new topic';
 var NEW_TOPIC_TEXT = "New Topic";
 var DEFAULT_QUIZ_ITEM_TEXT = 'Double-click here to start writing quiz item text...'; // also kept in jeditable


$(function(){
 
  $('div#editor_container').bind("refresh", function(){
  	   
 var quiz_count = parseInt( $('div.quiz_item').length ) +1;
 var scroll_width = parseInt($('div.quiz_item:first').css('width') ) * quiz_count;
 $('div#quiz_items').css('width', scroll_width);

         

// Set Initialization Triggers For Items
 $('.quiz_item').bind("initiate", function(){ initiateItem( $(this) )  })
                .bind("loadAnswers", function(){ loadAnswers( $(this) ) });

// Initiate Item Slider
item_sliderInit();
   
// Setup navigation
 $('div.nav_header').click(function(){
 	$(this).parent().find('div.list').hide('fast').end()
 	                .find('div.nav_header').removeClass('selected').end()
 	                .find('div.list.' + $(this).attr('id')).show('fast').end().end()
 	       .addClass('selected');
 
 }).each(function(){ $(this).append("&nbsp;&nbsp;(" + $(this).parent().find('div.list.' + $(this).attr('id')).find('li').length + ")"); });

 $('div.nav_header:first').click();
 

}).trigger("refresh");
          
}); // end of onReady




function initiateItem(item){   



          
// Setup Wrong Answers          	 
item.answer_previews = item.find('span.wrong', 'div.answer_preview');
item.answer_previews.each(function(){ 
  var this_input = $(this).parent().find('input');
  if ($(this).text().length < 1) { $(this).text(DEFAULT_ANSWER_TEXT); this_input.preserveDefaultText(DEFAULT_ANSWER_TEXT); }
  else {  this_input.val($(this).text()); }
});


// Setup Correct Answer
item.correct_answer = item.find('span.correct', 'div.answer_preview');
item.correct_answer.each(function(){ 
	console.log($(this).parent().find('button')); 
$(this).parent().find('button').bind("update", function(){ item.trigger("loadAnswers"); });
var this_input = $(this).parent().find('input');
if ($(this).text().length < 1) { $(this).text(DEFAULT_ANSWER_TEXT); this_input.preserveDefaultText(DEFAULT_ANSWER_TEXT); }
else {  this_input.val($(this).text()); }
});



// Edit Answer Previews 
item.find('.answer_preview').find('span').click(function(){
// edit answer value
var this_answer_span = $(this).parent().find('span.selection'); 
this_answer_span.data('submit_this', false);
var this_input = $(this).parent().find('input'); 
var these_spans = $(this).parent().find('span');
var edit_div = $(this).parent().find('div.edit_answer');
if (this_answer_span.text() != DEFAULT_ANSWER_TEXT) { this_input.val(this_answer_span.text()); }
these_spans.hide();
edit_div.show(); this_input.focus().keypress(function(evt){ if (evt.keyCode == 13) edit_div.find('button').click(); });

       edit_div.find('button').click(function(){
		// new answer value is submitted
		var new_answer = this_input.val(); 
		if (new_answer == DEFAULT_ANSWER_INPUT_TEXT || new_answer == '') { var new_value = DEFAULT_ANSWER_TEXT; }
		else { var new_value = new_answer; } 
		if (new_value != this_answer_span.text()) { $(this_answer_span.data('answer_link')).data('preview_index', -10); } //unlink from answer candidate
		$(this).parent().hide();
		this_answer_span.text(new_value); these_spans.show(); this_answer_span.data('submit_this', true); 
		if (new_value != DEFAULT_ANSWER_TEXT) $(this).trigger("update");  
		return;  });  
		        
return;  }); 



// Setup Quiz Item Content         
item.content = item.find('div.content', 'div.quiz_item_content');
if (item.content.text().length < 1) item.content.text(DEFAULT_QUIZ_ITEM_TEXT);
item.content.editable(function(value, id){ item.content.data('submit_this', true); UpdateContent(value, item);} , {
		//loadurl : "/quizbuilder/rpc?action=Jeditable&arg0=" + $(this),
		 event     : "dblclick",//"editable",
		type      : "autogrow",
		autogrow : { lineHeight : 27 },
		// submit    : "OK",
		// indicator : "<img src='/static/stylesheets/img/ajax-loader.gif'>",
		onblur    : "submit",
		// cancel    : "Cancel",
		tooltip   : "Double-Click to Edit",
		width     : '610px',
		cssclass : "editable"
		}).mousedown(function(){ item.content.data('ready', false); 
		                         return setTimeout(function(){ item.content.data('ready', true);  }, 450);  })
		  .mouseup(function(){ 			
		    if (item.content.data('ready') != true) return false;          
			if (document.getSelection().length > 0){
			// Set New Correct Answer
			item.correct_answer.text(document.getSelection());
			return item.trigger("loadAnswers"); }		
			else { return item.content.data('submit_this', false);  } //$(this).trigger("editable"); why does no selection mean that content is not ready? 	   	
             }); 


// Refresh blank preview spans after edit
item.bind("refresh_blanks", function(){ // On a hover over an answer, preview its text in the item content.
 	 var correct_answer_text = item.correct_answer.text();
 	 var answer_span = item.find('span#blank', 'div.content').text(correct_answer_text); // .removeClass('no_hover')
	item.answer_candidates.hover(function() { answer_span.html($(this).text().replace(/ /g, "&nbsp;")); },
	function() { answer_span.text(correct_answer_text); });       
     });



// Change Topic of Quiz Item
 item.find('div.item_topic')
     .find("option:first").text(DEFAULT_TOPIC_CHOICE).end()
     .change(function() {
            var $item_topic = $(this);
            if ($(this).find("option:selected").text() == NEW_TOPIC_TEXT)  {
             item.find('div.item_topic')
            $(this).find("select").hide().end()
                   .find('div.edit_topic').show().find('input').preserveDefaultText(DEFAULT_TOPIC_TEXT).end()
                                                 .find('button').click(function(){ return RefreshTopics($item_topic); }); 
          } 
          });
          
                    
  
        
          
// wait until answers are loaded
item.bind("initiateAnswers", function() {
       		
       		
       item.answer_candidates = item.find('div.ac_wrapper');
       
        item.answer_candidates.click(function(){ 
        this_answer = $(this);
        item.answer_previews.find('button').click();
/*
*
* Check if answer has already been chosen
*
*/ 

if ( this_answer.data('selected') == true ){   
		// if answer text is already there, remove it 
		this_answer.removeClass('selected').data('selected', false); 
		var preview_index = this_answer.data('preview_index');
		if (preview_index < 0) return false; // link has been cancelled


		 $( item.answer_previews[preview_index] ).text(DEFAULT_ANSWER_TEXT).data('answer_link', false);
		 // next step - for every answer between the answer preview and answerpreview.length, 
		 // move it back one
		for (a=(preview_index + 1); a < item.answer_previews.length; a++){
			$( item.answer_previews[a - 1] ).text( $(item.answer_previews[a]).text() )
									 .data('answer_link', $(item.answer_previews[a]).data('answer_link') ); 
			$($( item.answer_previews[a - 1] ).data('answer_link'))
									 .data('preview_index', parseInt(a - 1));
			$(item.answer_previews[a]).text(DEFAULT_ANSWER_TEXT).data('answer_link', false);
		continue;  } //endfor  */
  return false; } //endif
        
        /*
        *
        * Proceed with adding item
        *
        */
        
        item.answer_candidates.removeClass('selected').data('selected', false).data('preview_index', -1 ); 

       for (a = (item.answer_previews.length - 1); a > 0; a-- ){ 

           if ( $(item.answer_previews[a - 1]).text() == DEFAULT_ANSWER_TEXT) continue;
          $( item.answer_previews[a] ).text( $(item.answer_previews[a - 1]).text() ).data('answer_link', $(item.answer_previews[a - 1]).data('answer_link') ); 
          $($( item.answer_previews[a] ).data('answer_link'))
                                   .data('preview_index', a).addClass("selected").data('selected', true); 
                     
           continue;  }  
        // add new answer to previews
       $(item.answer_previews[0]).text(this_answer.text()).data('answer_link', $(this));
        // highlight chosen answer  button
        $(this).addClass("selected").data('selected', true).data('preview_index', 0 );
        
        
        return;
        
    	});



}); // end initiateAnswers		


// Submit Item
$('button.submit_item', item).click(function(){  SubmitItem(item); });



// Start Loading Answers
$(item).trigger("loadAnswers"); 


 }  // end initiateItem			
        			





function UpdateContent(value,item){ 

var value = value.split('\n').join('<br/>');
value = value.split('??').join('<span id="blank">&nbsp;</span>'); 
if (value.length < 1) item.content.html(DEFAULT_QUIZ_ITEM_TEXT)
else item.content.html(value);
setTimeout(function(){ item.trigger("refresh_blanks");  }, 500); 

return(value); 

}



function RefreshTopics(item_topic){
  if (item_topic.data('busy') == true) return false;
  
 
  var new_topic = item_topic.find('input').val();
  if (new_topic.length < 1 || new_topic == DEFAULT_TOPIC_TEXT) return alert("Please write a topic name");
  
  item_topic.find('div.edit_topic').hide('fast').end()
  .find('div.loading').show('fast').end()
            .data('busy', true);
            
$.ajax({

	type: "POST",
	url:  "/editor/rpc/post",
	data:
	{
			action: "NewTopic",
			subject_name: item_topic.attr('id'),
			topic_name: new_topic
	},
	success: function(response)
	{ 	$('div.item_topic').html(response); item_topic.data('busy', false);	}
	});
			   
return; 
    
}


function SubmitItem(item){
  if (item.data('submitting') == true) return false;
  
  // Validate Data Before Sending
	var subject_name = $('div.subject_name', item).text();
	var this_topic = $('div.item_topic', item).find("option:selected");
	var topic_name = this_topic.text();
	if (topic_name == DEFAULT_TOPIC_CHOICE || topic_name == NEW_TOPIC_TEXT) { alert("Please choose a topic"); return false; } 
	var topic_key = this_topic.val();
	var answers = Array();
	var ready_to_send = true;
	
	$('span.wrong', item).each(function(){
		if (ready_to_send == false) return false; 
		if ($(this).text() == DEFAULT_ANSWER_TEXT || $(this).data('submit_this') == false) { alert("Please choose wrong answers"); ready_to_send = false; return false; } 
		answers.push($(this).text()); });
if (ready_to_send == false) return false; 

	// Validate Correct Answer
	if (item.correct_answer.text() == DEFAULT_ANSWER_TEXT || item.correct_answer.data('submit_this') == false) { alert("Please choose a correct answer"); return false; } 		
	answers.push(item.correct_answer.text()); 	
	
	var item_text = item.content.text();
	if (item_text == DEFAULT_QUIZ_ITEM_TEXT || item.content.data('submit_this') == false) { alert("Please specify an item text"); return false; }
   // replace correct answer in text with blank span
   item_text = item_text.replace(item.correct_answer.text(), '<span id="blank"></span>');
        	
	var item_status = "false";
	var status_select = item.find('div.details').find('select');
	if (status_select.attr('disabled') == false) var item_status = status_select.find("option:selected").val();
	 
	// Send Ajax Call
	item.data('submitting', true);
	var this_button = $('button.submit_item', item).attr('disabled', "true").addClass('disabled').text('sending...'); 
	var item_key = this_button.attr('id');
	
  // do we also want to collect the answer suggestions, or do we let them float away like tears in the rain?


$.ajax({
	type: "POST",
	url:  "/editor/rpc/post",
	data:
	{
			action: "SubmitItem",
			subject_name: subject_name,
			topic_key: topic_key,
			correct_answer: item.correct_answer.text(),
			answers: String(answers),
			item_text: item_text,
			item_status: item_status,
			item_key: item_key
	},
	success: function(response)
	{ 	$('div#editor_container').html(response).trigger("refresh");	}
});

// $.get('/debug/?quiz_item=' + item_key); -- Debug quiz item with key
return; 
    
}
