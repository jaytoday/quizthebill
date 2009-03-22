
jQuery.fn.extend({
preserveDefaultText: function(defaultValue, replaceValue)
	{
		$(this).focus(function()
		{
			if(typeof(replaceValue) == 'undefined')
				replaceValue = '';
			if($(this).val() == defaultValue)
				$(this).val(replaceValue);
		});

		$(this).blur(function(){
			if(typeof(replaceValue) == 'undefined')
				replaceValue = '';
			if($(this).val() == replaceValue)
				$(this).val(defaultValue);
		});
		return this;
	}
});

$(document).ready(function () {
    /**
     * Recalculate dimensions of layers for parallax effect
     */
    function resizeViewport() {
        var jqViewport = $('#viewport');
        var viewWidth = jqViewport.width();
        var viewHeight = jqViewport.height();

        $('.layer.near', jqViewport).css({ width: (viewWidth * 1.4),  height: (viewHeight*1.3)  });
        $('.layer.mid',  jqViewport).css({ width: (viewWidth * 1.15), height: (viewHeight*1.05) });
        $('.layer.far',  jqViewport).css({ width: (viewWidth * 1.04), height: (viewHeight*1.01) });

        jqViewport.jparallax({});
    }

    resizeViewport();

    // Call resizeViewport() each time when window was resized
    $(window).resize(resizeViewport);

    $('#viewport').css({overflow: "hidden"});
    $('#flyer a').show().animate({left: "100%"},24000);


	$('form#signup #email').preserveDefaultText('nobel@macarthur.com');

	// hover and focus fx
	$('input').focus(function()
	{
		$(this).addClass('focus');
	})
	.blur(function()
	{
		$(this).removeClass('focus');
	});

	$('#signup input[type=button]').hover(function()
	{
		$(this).addClass('hover');
	},function(){
		$(this).removeClass('hover');
	});
	// button click behavior
	$('#signup .button:not(.disable)').click(function()
	{
		var email = $('#email').val();
		server.List(email,function()
		{
			$('form#signup input').hide();
			$('#add_success').show('fast');
		});

	}).focus(function()
	{
		// prevents crawling ants
		$(this).blur();
	}).mousedown(function()
	{
			$(this).addClass('down');
	}).mouseup(function()
	{
		$(this).removeClass('down');
	});

	MottoAnimation();
});





function MottoAnimation()
{
	var ml = Number($('#smart').css('marginLeft').replace(/p[xt]/,''));
	ml = (ml == 29) ? 221 : 29;

	setTimeout(function()
	{
		$('#smart').animate({
			opacity: .5
		},
		{
			complete: function()
			{
				$('#smart').animate({
					marginLeft:	ml
				},
				{
					complete: function()
					{
						$('#smart').animate({
							opacity: 1
						});

						setTimeout(MottoAnimation,1800);
					}
				});
			}
		});
	},1400);
}



// Server object that will contain the callable methods
var server = {};
var item_count = 0;

// Insert 'Add' as the name of a callable method
InstallFunction(server, 'List', 'quiztaker');  //app should be changed
InstallFunction(server, 'Init', 'quiztaker');

function ListAdd(email) {
	server.List(email, onAddSuccess);
	// There should be a callback for success
}

function onAddSuccess(response)
{
	$('div#add_success').show('fast');
}
