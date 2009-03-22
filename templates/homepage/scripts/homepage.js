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


$(function()
{

$('div#right_corner').hide();

$('div#take_quiz').hover(function(){ 
	
	$(this).css({"background-color":"#CCCCCC","border-color":"#CCCCCC"});
	$(this).find('h1').css({"color":"#000080"});
},function(){
$(this).css({"background-color":"#DDDDDD","border-color":"#DDDDDD"});
$(this).find('h1').css({"color":"#000040"});
});


$('input#employer_name').preserveDefaultText("what's the name of your business?");



$('div#quiz_list > ul').find('div').click(function(){ 
                                                    // $.getScript("/js/quiz/" + $(this).attr('id') + "?autostart=True");
                                                     window.location="/quiz/" + $(this).attr('id');
									                 });



MottoAnimation();
	
FeedScroll();	
	
});

     



function MottoAnimation() 
{
	if ($('#smart').length < 1) { return false; }
	var ml = Number($('#smart').css('marginLeft').replace(/p[xt]/,''));
	ml = (ml == 25) ? 318 : 25;

	setTimeout(function()
	{
		$('#smart').animate({
			opacity: 0.5
		},
		{
			complete: function()
			{

				$('#smart').animate({
					marginLeft:	100
				},
				{
					complete: function()
					{
						
					var text = $('#smart').text();
					if (ml == 25){$('#smart').text("show")}
					else {$('#smart').text("know")}		
						
			$('#smart').animate({
					marginLeft:	ml
				});
						
						$('#smart').animate({
							opacity: 1
						});

						setTimeout(MottoAnimation,1800);
					}
				});
			}
		});
	},900);
}






//scroll through action feed items
function FeedScroll(){	
	
	//if ($("#action_feed > div").length < 6) ExtendFeed();
	
var scroll_feed = setTimeout(function()
		{
		$("#action_feed > div:first").animate({opacity: 0, height: 0 }, {duration:800, complete:function(){ 
			$(this).remove(); $("#action_feed").append($(this).animate({opacity: 1, height: 100 }));    
			}});
		
		FeedScroll();
		}, 6000);
}

/*
 *  This is not necessary if we won't be doing memcache/ajax combo for newsfeed.
function ExtendFeed(){	
	
	console.log('extending!');
	
	$.ajax({
		url: '/homepage/rpc?action=extend_feed',
		//dataType: "json",
		cache: false,
		success: function(html){ console.log(html);  $("#action_feed").append(html);  }, // code in quiz_item_load.js
});

	}

* 
* */
