var runCode = function(){
    // A little helper function to get an element by class
    // name from the injected HTML
    var select = function(classname){ //TODO: This should only look within our container
        return jQuery('#' + id + ' .' + classname, doc.body);
    }
    
    var default_text = 'Double-Click Here to Start Writing the Quiz Item Text...';
    var default_correct_answer_text = "none selected";
    var default_answer_text = "Click to Edit";
    
    //container is draggable
    var makeDraggable = function(element){
    
        element.css({
            'left': 200,
            'top': 100,
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
    
    makeDraggable(select('ubiquity_quizbuilder'));
    
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
    
    var lookupAlternativeAnswers = function(answer, callback){
        var lookupUrl = "http://www.freebase.com/api/service/search?limit=6&query=" + encodeURI(answer);
        jQuery.getJSON(lookupUrl, function(data){
            var alternatives = new Array();
            if(!data.result) {
            	alert(data.messages.message);
            	return;
            }
            for (var result in data.result) {
                var suggestion = data.result[result].name;
                if (suggestion.toLowerCase() == answer.toLowerCase()) 
                    continue;
                alternatives.push(suggestion);
            }
            callback.call(this, alternatives);
        });
    }
    
    // Close button event handler
    select('close').click(function(){
        jQuery('#' + id, doc.body).remove();
    });
    
    select('correct_answer').text(default_correct_answer_text);
    
    // Set correct answer
    // TODO: This also gets called on DBLClick, so we lookup answers 
    // when turning the text into a textbox. Needs to be fixed
    select('statement').mouseup(function(){
        var answer = CmdUtils.getSelection();
        if (answer.length < 1) 
            return false;
        select('correct_answer').text(answer);
        select('suggestions').css('display', 'block');
        lookupAlternativeAnswers(answer, function(alternatives){
            select('loading').hide();
            var markup = new Array();
            for (var alt in alternatives) {
                markup.push("<div style='height: 13px; margin: 10px 0; cursor:pointer; clear: left;'><button " +
                "style='float:left; cursor:pointer; margin: -4px 4px 0px 0;'><img src='" +
                serverUrl +
                "/static/stylesheets/img/utils/purple_next_tiny.png" +
                "'/></button>" +
                alternatives[alt] +
                "</div>");
            }
            select('suggestions').find('div.items').html(markup.join("\n"));
            answerChoices(); // reset answer choice click event
        });
    });
    
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
        if (select('subject').data('ready') != true) {
            submit_error.show().text('Choose a Subject');
            return false;
        }
        // tags
        var tags = select('tags').find('input').text();
        // location of current page
        var this_url = CmdUtils.getWindow().location.href;
        
        // send quiz item to server
        jQuery(this).text("Sending...").attr('disabled', true);
        jQuery.ajax({
            type: "GET",
            url: serverUrl + "/quizbuilder/rpc",
            data: 'action=NewQuizItem&arg0="' +
            quiz_item_text +
            '"&arg1="' +
            correct_answer +
            '"&arg2="(' +
            wrong_answers +
            ')"&arg3="' +
            subject +
            '"&arg4="' +
            tags +
            '"&arg5="' +
            this_url +
            '"',
            error: function(data){
            	alert(data);
            },
            success: function(data){
            }
        });
    });
};

