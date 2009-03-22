
/*
 * 
 *  Load Answers
 * 
 */


function loadAnswers(item) {
var wrong_answers = $('div.answer_candidates', item);
var answers_container = wrong_answers.parents('.answers_container:first');
// var answers_container = ('.answers_container', item);
if (answers_container.data('busy') == true) return false;
answers_container.data('busy', true)
	             .find('div.answers_scroll').hide('fast').end()
	             .find('div.loading').show('fast');

$.ajax({
	
	type: "POST",
	url:  "/editor/rpc/post",
	dataType: "html",
	data: {
			action: "LoadAnswers",
			correct_answer: $('span.correct', item).text(),
			item_text: $('div.quiz_item.content', item).text()
	},
	success: function(response) { 
		// TODO catch errors
		answers_container.html(response).data('busy', false);
	}, 
	complete: function(data){ 
		wrong_answers = $('div.answer_candidates', item);
		item.trigger("initiateAnswers").trigger("refresh_blanks"); 
		answerSliderInit(wrong_answers, answers_container); 
		}
});



	
	
}


/*
 * 
 * Answer Slider
 * 
 */

function answerSliderInit(wrong_answers, answers_container) {
	
	 

    var $panels = $(wrong_answers).find('div.ac_wrapper');
    
    if ($panels.length < 1) { console.log('problem dr jones!');
    return; setTimeout(function() { answerSliderInit(wrong_answers, answers_container); },
           40); }
    	
    	
    var scroll_width = 160 * $panels.length; wrong_answers.css('width', scroll_width);  
    var $container = answers_container;
    var $index = $container.attr('id');

    // if false, we'll float all the panels left and fix the width 
    // of the container
    var horizontal = true;

    // float the panels left if we're going horizontal
    if (horizontal) {
        $panels.css({
            'float' : 'left',
            'position' : 'relative' // IE fix to ensure overflow is hidden
        });

    }

    // collect the scroll object, at the same time apply the hidden overflow
    // to remove the default scrollbars that will appear
    var $scroll = $('.answers_scroll', $container).css('overflow', 'hidden');

    // apply our left + right buttons
    $scroll
        .prepend('<img class="scrollButtons answer_prev answer_prev' + $index + '" src="/static/stylesheets/img/utils/scroll_left.png" />')
        .append('<img class="scrollButtons answer_next answer_next' + $index + '" src="/static/stylesheets/img/utils/scroll_right.png" />');

	 var $prev = 'img.answer_prev' + $index; 
	 var $next = 'img.answer_next' + $index;


    // go find the navigation link that has this target and select the nav
    function trigger(data) {
 
    }

    var scrollOptions = {
        target: $scroll, // the element that has the overflow

        // can be a selector which will be relative to the target
        items: $panels,

        // selectors are NOT relative to document, i.e. make sure they're unique
        prev: $prev, 
        next: $next,

        // allow the scroll effect to run both directions
        axis: 'x',
        
        step: 5,
        
        exclude: 4,

        onAfter: trigger, // our final callback

        // offset: 0,

        // duration of the sliding effect
        duration: 500

        // easing - can be used with the easing plugin: 
        // http://gsgd.co.uk/sandbox/jquery/easing/
        // easing: 'swing'
    };

    // apply serialScroll to the slider - we chose this plugin because it 
    // supports// the indexed next and previous scroll along with hooking 
    // in to our navigation.
    $container.serialScroll(scrollOptions);

}
