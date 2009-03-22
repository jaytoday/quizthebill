

{# Initialize variables from template tags (these will be cached and used for all users, across all pages!) #}
http_host = "{{http_host}}";

// Include utility scripts 

{% if dev_server %}
{% include "../static/scripts/jquery/jquery-1.3.2.js" %}
{% else %}
{% include "../static/scripts/jquery/jquery-1.3.2.js" %}
// $.getScript("http://ajax.googleapis.com/ajax/libs/jquery/1.3.2/jquery.min.js"); // should we always load local jQuery?
{% endif %}


{% include "../static/scripts/jquery/ui.core.js" %}
{% include "../static/scripts/jquery/ui.dialog.js" %}
{% include "../static/scripts/jquery/ui.draggable.js" %}
{% include "../static/scripts/jquery/ui.tabs.js" %}
{% include "../static/scripts/utils/parallax.js" %}
{% include "../static/scripts/utils/rpc.js" %}
{% include "../static/scripts/utils/preserve_default_text.js" %}
{% include "../static/scripts/utils/console.js" %}

 
$(function(){
	
	$('div.main').removeClass('hide');
	
	
	jqViewport = $('#viewport');
	    /**
     * Recalculate dimensions of layers for parallax effect
     */
    function resizeViewport() {
        var viewWidth = jqViewport.width();
        var viewHeight = jqViewport.height();

       $('.layer.near', jqViewport).css({ width: (viewWidth * 1.4),  height: (viewHeight*1.3)  });
       $('.layer.mid',  jqViewport).css({ width: (viewWidth * 1.15), height: (viewHeight*1.05) });
        $('.layer.far',  jqViewport).css({ width: (viewWidth * 1.04), height: (viewHeight*1.01) });

        
        jqViewport.jparallax({ 
        	                   frameDuration: 40, //save CPU
                               takeoverFactor: 0.68, //time to decay (0-1)
                               takeoverThresh: 0.002 //time to begin (0-1)       
                             }, 
                             
                        {} /* TODO - get animations to be slower      
                             { xtravel: 0.8,ytravel: 0.5 }, // Layer
                             { xtravel: 0.6, ytravel: 0.8 }, // Layer
                             { xtravel: 0.8, ytravel: 0.6 } */
                             
                             ).css({overflow: "hidden"});
    }

resizeViewport();

// Call resizeViewport() each time when window was resized
$(window).resize(resizeViewport);
    



$('input[type=button], button').focus(function()
{
$(this).addClass('focus');
})
.focus(function()
{
// prevents crawling ants
$(this).blur();
}).mousedown(function()
{
$(this).addClass('down');
}).mouseup(function()
{
$(this).removeClass('down');
})
.blur(function()
{
$(this).removeClass('focus');
});

$('input[type=button], button').hover(function()
{
$(this).addClass('hover');      
},function(){
$(this).removeClass('hover');
});


$('div#quick_links a#about_dialog').click(function(){ 
$("div#about_dialog_content").dialog({ 
		modal: true,
		resizable: false,
		draggable: true,
		dialogClass: 'about_dialog',
		height: 370,
		width: 560,
		overlay: { 
		opacity: 0.5, 
		background: "black" 
		},
buttons: { 
	/*
"Intro": function() { 
		$(this).find('div').hide();
		$(this).find('div.about_introduction').show();
},
"Profiles": function() { 
		$(this).find('div').hide();
		$(this).find('div.about_profiles').show()
		
		.find('button').click(function(){
			if ($(this).hasClass('clicked')) return false;
			
			$(this).parent().find('button').removeClass('clicked');
			$(this).addClass('clicked');
			console.log($(this).parents('.about_profiles:first'));
			$(this).parents('.about_profiles:first').find('span.section').hide().end()
			                .find('span#' + $(this).attr('id')).css('display', 'block');

		}).end()
		.find('button:first').addClass('clicked');
		
},
"Sponsers": function() { 
		$(this).find('div').hide();
		$(this).find('div.about_sponsors').show();
},


"Volunteers": function() { 
		$(this).find('div').hide();
		$(this).find('div.about_how_we_grade').show();
},



"How We Grade": function() { 
		$(this).find('div').hide();
		$(this).find('div.about_how_we_grade').show();
}

 */

} 



}).dialog("open").show();

$('div.ui-dialog-buttonpane').find('button:first').addClass('clicked'); // initialize on first button
$('div.ui-dialog-buttonpane > button').click(function(){
$(this).parent().find('button').removeClass('clicked');
$(this).addClass('clicked');
});

});


$('div#quick_links a#contact_dialog').click(function(){ $("div#contact_dialog_content").dialog({ 
		modal: true,
		draggable: true,
		resizable: false,
		dialogClass: 'contact_dialog',
		height: 300,
		width: 405,
		overlay: { 
		opacity: 0.5, 
		background: "black" 
		},
buttons: { 
	
	"Support": function() { 

		$(this).find('div').hide();
		$(this).find('div.contact_support').show().find('div').show();
	
},

"Feedback": function() { 
$('a#uservoice-feedback-tab').click();
	//	$(this).find('div').hide(); $(this).find('div.contact_feedback').show();
}



/*  Temporarily disabled
"Media": function() { 

		$(this).find('div').hide();
		$(this).find('div.contact_media').show();
},
"Sales": function() { 

		$(this).find('div').hide();
		$(this).find('div.contact_sales').show();
}
*/


        
} 

}).dialog("open").show();

$('div.ui-dialog-buttonpane').find('button:first').addClass('clicked'); // initialize on first button
$('div.ui-dialog-buttonpane > button').click(function(){
$(this).parent().find('button').removeClass('clicked');
$(this).addClass('clicked');
});


});



// Take a Quiz link
$('#take_a_quiz').click(function(){  StartQuiz("/js/quiz/?autostart=True"); });


// Hide Flash Objects When Dialog/Widget Is Open

$(".ui-dialog-content").bind("dialogopen", function(){ $('.main').find('object').hide(); });

$("div.ui-dialog-content").bind("dialogclose", function(){ $('.main').find('object').show(); });




//end ready()
});




function Loading(load_duration){
	
	$(function(){
		
var $loader = $('div.loading', 'div.main_wrapper');
var $main = $('div.main', 'div.main_wrapper');
$loader.show();
$main.hide();
$loader.animate({opacity:1}, { duration:0 }).animate({opacity: 1 }, {duration:load_duration , complete:function(){ 
																									$loader.hide();
																									$main.show();
																							}});


});


}




function StartQuiz(script){
	
		$.getScript(script); 
			// resize overlay to document not window
		function drawOverlay(){
		$('div#pq_quiz_overlay').css("height", $(document).height());
		}
		$(window).resize(drawOverlay); // whenever window is resized, overlay will be drawn. 


	$('div#pq_quiz_overlay').show().bind("displayQuiz", function()
                                      { $(this).hide();         }) ;
                                      
}
