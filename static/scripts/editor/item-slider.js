

// when the DOM is ready...
function item_sliderInit(wrong_answers) {
    
    var $panels = $('#editor_container .quiz_items > div');

    var $container = $('#editor_container .quiz_items');

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
    var $scroll = $('#editor_container .scroller').css('overflow', 'hidden');

    
    // handle nav selection
function selectNav() {
	$(this)
	.parents('ul:first')
		.find('a')
			.removeClass('selected')
		.end()
	.end()
	.removeClass('queue')
	.addClass('selected');

    }

    $('#editor_container > .item_navigation').find('a').click(selectNav);

    
function trigger(item) {
var el = $('.item_navigation').find('a[href="#' + item.id + '"]');
selectNav.call(el);
if ( $(item).data('triggered') == true) return false;
$(item).data('triggered', true);
/*
 * 
 * Load Answers
 * 
 */

$(item).trigger("initiate");
 
return;
 
  }

                     

    var scrollOptions = {
        target: $scroll, // the element that has the overflow

        // can be a selector which will be relative to the target
        items: $panels,

        navigation: '.item_navigation a',
        
        cycle: 'true',
        lazy: 'true', // for dynamic content

        // allow the scroll effect to run both directions
        axis: 'x',

        onAfter: trigger, // our final callback
        
        force: true,

        offset: -50,//offset,

        // duration of the sliding effect
        duration: 500,

    };

    // apply serialScroll to the slider - we chose this plugin because it 
    // supports// the indexed next and previous scroll along with hooking 
    // in to our navigation.
    $('#editor_container').serialScroll(scrollOptions);

    // now apply localScroll to hook any other arbitrary links to trigger 
    // the effect
    $.localScroll(scrollOptions);



 
}
