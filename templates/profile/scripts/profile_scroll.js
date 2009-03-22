

{% include "../../../static/scripts/scroll/jquery.scrollTo-min.js" %}
{% include "../../../static/scripts/scroll/jquery.localscroll-1.2.5.js" %}
{% include "../../../static/scripts/scroll/jquery.serialScroll-1.2.1.js" %}
{% include "award_slider.js" %}

$(function()
{

{% if scroll.awards %}
$('#award_scroll_nav').show();
{% include "award_slider.js" %}
{% endif %}


{% if scroll.sponsors %}
$('#sponsor_scroll_nav').show();
{% include "sponsor_slider.js" %} 
{% endif %}


 });
 







