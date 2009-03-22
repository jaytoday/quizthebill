var runCode = function(){
    // A little helper function to get an element by class
    // name from the injected HTML
    var select = function(classname){ //TODO: This should only look within our container
        return jQuery('#' + id + ' .' + classname, doc.body);
    }
    
    var default_text = 'Double-Click Here to Start Writing the Quiz Item Text...';
    var default_correct_answer_text = "none selected";
    var default_answer_text = "Click to Edit";
    
 

    
    var setupContainer = function(element){
 
        // position div in center - margins are negative half of height and width
		var margin_left = ( parseInt(element.css('width')) / 2 ); 
		var margin_top = ( parseInt(element.css('height')) / 2 );  
		var top_offset = 300;//( parseInt(document.height) / 2 );
		var left_offset = 800;//( parseInt(document.width) / 2 );
		element.css({
        	'margin-left': -margin_left, 
        	'margin-top': -margin_top, 
        	'top': top_offset,
        	'left': left_offset,
            'position': 'fixed'
        });
               
        // Move the element by the amount of change in the mouse position
        var move = function(event){
            if (element.data('mouseMove')) {
                if (element.data('cancel') == true) 
                    return false;
                
                var changeX = event.clientX - element.data('mouseX');
                var changeY = event.clientY - element.data('mouseY');
                
                var newX = parseInt(element.css('left')) + changeX;
                var newY = parseInt(element.css('top')) + changeY;
                
                element.css({
                    'left': newX,
                    'top': newY
                });
                element.data('mouseX', event.clientX);
                element.data('mouseY', event.clientY);
            }
        }
        
        element.mousedown(function(event){
            element.data('mouseMove', true);
            element.data('mouseX', event.clientX);
            element.data('mouseY', event.clientY);
        });
        
        element.parents(':last').mouseup(function(){
            element.data('mouseMove', false);
        });
        
        element.mouseout(move);
        element.mousemove(move);
        
        var cancel_drag = select('cancel_drag');
        cancel_drag.mousedown(function(event){
            element.data('cancel', true)
        });
        cancel_drag.mouseup(function(event){
            element.data('cancel', false)
        });
    }
    
    setupContainer(select('ubiquity_quizbuilder'));
    
    //if selection length < 1, use text placeholder.
    var initText = function(){
        if (select('statement').text().length < 1) 
            select('statement').text(default_text);
    }
    initText();
    
	var limitChars = function(element, limit, infodiv)
	{
		var text = element.val();	
		var textlength = text.length;
		if(textlength > limit)
		{
			infodiv.html('No characters left.');
			element.val(text.substr(0,limit));
			return false;
		}
		else
		{
			infodiv.html((limit - textlength) +' characters left');
			return true;
		}
	}
	
    select('answer_editor').keypress(function(){
		limitChars(jQuery(this), 400, select('limit_info'));
    }); 
    
    
    select('statement').bind("dblclick", function(){
        var edit_text = jQuery(this).text();
        if (edit_text == default_text) edit_text = '';
        
        jQuery(this).hide();
        select('limit_info').show();
        select('submit_edit').show();
        select('answer_editor').show().val(edit_text).focus();
        limitChars(select('answer_editor'), 400, select('limit_info'));
    });
    
    // Submit edit of quiz item text
    select('submit_edit').bind("click", function(){
        var new_text = select('answer_editor').val();
        select('answer_editor').hide();
		select('statement').show().html(new_text);
		jQuery(this).hide(); // hide button
		select('limit_info').hide();
        initText();
    });
    
    // TODO: This should be local answer service 
    var lookupAlternativeAnswers = function(answer, callback){

        jQuery.ajax({
	type: "POST",
	url:  serverUrl + "/editor/rpc/post",
	dataType: "json",
	data: {
			action: "LoadUbiquityAnswers",
			correct_answer: answer,
			item_text: select('statement').text()
	},
	success: function(response) { 
		callback.call(this, response);
	}, 
	complete: function(data){ 
		}
});
    
    }
    
    // Close button event handler
    select('close').click(function(){
        jQuery('#' + id, doc.body).remove();
        $('object').show();
    });
    
    select('correct_answer').text(default_correct_answer_text);
    
    // Set correct answer
    // TODO: This also gets called on DBLClick, so we lookup answers 
    // when turning the text into a textbox. Needs to be fixed
    select('statement').mouseup(function(){
        if ($(this).data('ready') == false) return false;
        var answer = get_selection();
        if (answer.length < 1) 
            return false;
                if (answer.length > 20) 
            return alert("The correct answer must be shorter than twenty characters");    
            
        select('correct_answer').text(answer);
        select('suggestions').css('display', 'block');
        lookupAlternativeAnswers(answer, function(alternatives){
            select('loading').hide();
            var markup = new Array();
            for (var alt in alternatives) {
                markup.push("<div class='item'><button ><img src='"
                 + serverUrl +
                "/static/stylesheets/img/utils/purple_next_tiny.png'/>"
                +  alternatives[alt] +
                "</button></div>");
            }
            select('suggestions').find('div.items').html(markup.join("\n"));
            answerChoices(); // reset answer choice click event
        });
    }).mousedown(function(){ select('statement').data('ready', false); 
   return setTimeout(function(){ select('statement').data('ready', true);  }, 250);  });
    
    // edit wrong answer text
    select('wrong_answer').find('span').text(default_answer_text).click(function(){
        var new_text = jQuery(this).text();
        if (jQuery(this).text() == default_answer_text) 
            new_text = "";
        
        jQuery(this).hide().parent().find('div.edit').show().find('input').val(new_text).focus().keypress(function(evt){
            if (evt.keyCode == 13) 
                jQuery(this).parent().find('button').click();
        });
        
    });
    
    // update edited wrong answer
    select('wrong_answer').find('button').click(function(){
        var new_text = jQuery(this).parent().find('input').attr('value');
        if (new_text == "") 
            new_text = default_answer_text;
        jQuery(this).parent().hide().parent().find('span').text(new_text).show();
    });
    
    // set wrong answer from suggestion
    var answerChoices = function(){
        select('items').find('div').find('button').click(function(){
            var new_answer = jQuery(this).parent().text();
            var first_answer = select('selected_answers').find('.wrong_answer:eq(0)').find('span');
            select('selected_answers').find('.wrong_answer:eq(1)').find('span').text(first_answer.text());
            first_answer.text(new_answer);
            
        });
    };
    
    // show that subject is ready on change(). Check for 'create new' choice.
    select('subject').change(function(){
        if (jQuery(this).find("option:selected").attr('id') == "new") {
            jQuery(this).find('select').hide().end().find('input').show().end().find('button').show();
            jQuery(this).data('ready', 'input');
            return;
        }
        jQuery(this).data('ready', true);
    });
    
    select('choose_subject').data('ready', false); // will be triggered when subject should be chosen.
    
    
    // show that topic is ready on change(). Check for 'create new' choice.
    select('topic').change(function(){
        if (jQuery(this).find("option:selected").attr('id') == "new") {
            jQuery(this).find('select').hide().end().find('input').show().end().find('button').show();
            jQuery(this).data('ready', 'input');
            return;
        }
        jQuery(this).data('ready', true);
    });
    
    select('cancel_input').click(function(){
        jQuery(this).hide().parent().data('ready', false).find('input').hide().end().find('select').show()
    });
    
    var submit_error = select('submit_error');
    
    ////     Submit Item    /////
    
    select('submit_item').find('button#submit_item').click(function(){
    
        submit_error.hide().text('');
        
        // quiz item text
        var quiz_item_text = select('statement').text();
        if (quiz_item_text == default_text) {
            submit_error.show().text('Specify Quiz Item Text');
            return false;
        }
        // correct answer
        var correct_answer = select('correct_answer').text();
        if (correct_answer == default_correct_answer_text) {
            submit_error.show().text('Specify a Correct Answer');
            return false;
        }
        // wrong answers
        var wrong_answers = new Array();
        var all_answers = true;
        select('selected_answers').find('.wrong_answer span').each(function(i){
            if (jQuery(this).text() == default_answer_text) {
                submit_error.show().text('Specify Wrong Answers');
                all_answers = false;
            }
            wrong_answers.push("'" + jQuery(this).text() + "'");
        });
        if (all_answers == false) 
            return false;
        
        // subject
        var subject = select('subject').find('select').attr('value');
        if (select('choose_subject').data('ready') == false  ) {
            submit_error.show().text('Choose a Subject');
            return false;
        }
        // topic -- this is the key, so ajax call is needed when a new one is entered. 
        var topic_key = select('topic').find('select').attr('value');
        
        // replace correct answer in text with blank span
        quiz_item_text = quiz_item_text.replace(correct_answer, '<span id="blank"></span>');
        
        // send quiz item to server
        // TODO: Use existing method 
        jQuery(this).text("Sending...").attr('disabled', true);
    
        jQuery.ajax({
	type: "POST",
	url:  serverUrl + "/editor/rpc/post",
	data:
	{
			action: "SubmitItem",
			subject_name: subject,
			correct_answer: correct_answer,
			this_url: this_url,
			answers: String(wrong_answers),
			item_text: quiz_item_text,
			topic_key: topic_key,
			item_status: "not_approved",
			ubiquity: "true"
	},
	success: function(response)
	{ 	 select('close').click(); jQuery(doc).trigger('item_submit'); //$('div#editor_container').html(response).trigger("refresh");	
	}
});

    });
    
    
 // remove flash objects while open
 $('object').hide();   
};

