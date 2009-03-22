$(document).ready(function()
{
	
	// Show messages based on whether user has awards and sponsorships
	var has_awards = "False";	
{% for award in user.awards %}
if ("{{ forloop.first }}") has_awards = "True";
 
if ($('.{{ forloop.counter }}_has_subject_image').length > 0) 
   {  
     $('li#{{ forloop.counter }}_default_subject_image').remove();
     $('#award_{{ forloop.counter }}').s3Slider({ timeOut: 5300 });  {# load slider for this award#} 
   }
else  $('li#{{ forloop.counter }}_default_subject_image').show(); {# show default image, no slider #}
{% endfor %}  

{% if not user.is_sponsor %}
if (has_awards != "True") $('#main_nav').find('a[href="#report_card"]').click();
{% endif %}


if (($('div.award_img').length == 0)) $('div#no_award_note').show();


 });
 
