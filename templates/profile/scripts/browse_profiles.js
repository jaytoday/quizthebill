		$(function(){

$('div#right_corner').find('span').text('');

	    var scroll_width = 250 * $('.pb_container').find('.user').length;
	    console.log(scroll_width);
$('.pb_container').find('.profiles').css('width', scroll_width);  


	    profile_sliderInit();
	    
	    
	    $('input:checkbox').checkbox();


        $('div.embed_code').hide(); // get rid of embed codes

			
		});
