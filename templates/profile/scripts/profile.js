

$(function()
{

	$('a#toggle').click(function(){$('div#portfolio').find('div.report_section').toggleClass('hidden');}
	);
        $('div#right_corner').find('span').text('');

        $('.profile ul').tabs();
        



});


