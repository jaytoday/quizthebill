/*
* Quizbox Library 

*/

(function()
{
        var opts = {}, 
        imgPreloader = new Image, imgTypes = ['png', 'jpg', 'jpeg', 'gif'], 
	loadingTimer, loadingFrame = 1;

	$.fn.quizbox = function(settings)
	{
		opts.settings = $.extend({}, $.fn.quizbox.defaults, settings);

		$(this).data('opts', opts);

		$.fn.quizbox.init();

		$.fn.quizbox.defaults =
		{
			hideOnContentClick: false,
			zoomSpeedIn: 500,
			zoomSpeedOut: 500,
			frameWidth: 600,
			frameHeight: 410,
			overlayShow: false,
			overlayOpacity: 0.4,
			itemLoadCallback: null
		};

		return $(this).each(function()
		{
			var o = $.metadata ? $.extend({}, opts.settings, $(this).metadata()) : opts.settings;

			$(this).unbind('click').click(function()
			{
				$.fn.quizbox.start(this, o); 
				return false;
			});
		});
	};

	$.fn.quizbox.start = function(el, o)
	{
		if (opts.animating) return false;

		opts.itemArray	= [];
		opts.itemNum	= 0;


                $.ajax({
                        url: '/rpc?action=Init&_=' + (new Date().getTime()),
                        async: false
                });

		if (o.overlayShow) {
			$("#quiz_wrap").prepend('<div id="quiz_overlay"></div>');
			$("#quiz_overlay").css({'width': $(window).width(), 'height': $(document).height(), 'opacity': o.overlayOpacity});

			if ($.browser.msie)
			{
				$("#quiz_wrap").prepend('<iframe id="quiz_bigIframe" scrolling="no" frameborder="0"></iframe>');
				$("#quiz_bigIframe").css({'width': $(window).width(), 'height': $(document).height(), 'opacity': 0});
			}

			//$("#quiz_overlay").click($.fn.quizbox.close);
		}

		if (jQuery.isFunction(o.itemLoadCallback))
		{
			o.itemLoadCallback.apply(this, [opts]);

			var c	= $(el).children("img:first").length ? $(el).children("img:first") : $(el);
			var tmp	= {'width': c.width(), 'height': c.height(), 'pos': $.fn.quizbox.getPosition(c)}

			for (var i = 0; i < opts.itemArray.length; i++)
			{
				opts.itemArray[i].o = $.extend({}, o, opts.itemArray[i].o);

				if (o.zoomSpeedIn > 0 || o.zoomSpeedOut > 0)
					opts.itemArray[i].orig = tmp;
			}
		}
		else
		{
			if (!el.rel || el.rel == '')
			{
				var item = {url: el.href, title: el.title, o: o};

				if (o.zoomSpeedIn > 0 || o.zoomSpeedOut > 0)
				{
					var c = $(el).children("img:first").length ? $(el).children("img:first") : $(el);
					item.orig =
					{
						'width': c.width(),
						'height': c.height(),
						'pos': $.fn.quizbox.getPosition(c)
					}
				}

			opts.itemArray.push(item);

			}
			else
			{
				var arr = $("a[@rel=" + el.rel + "]").get();

				for (var i = 0; i < arr.length; i++)
				{
					var tmp = $.metadata ? $.extend({}, o, $(arr[i]).metadata()) : o;
					var item =
					{
						url: arr[i].href,
						title: arr[i].title,
						o: tmp
					};

					if (o.zoomSpeedIn > 0 || o.zoomSpeedOut > 0)
					{
						var c = $(arr[i]).children("img:first").length ? $(arr[i]).children("img:first") : $(el);
						item.orig =
						{
							'width': c.width(),
							'height': c.height(),
							'pos': $.fn.quizbox.getPosition(c)
						};
					}

					if (arr[i].href == el.href) opts.itemNum = i;
						opts.itemArray.push(item);
				}
			}
		}

		$.fn.quizbox.changeItem(opts.itemNum);
        };

        $.fn.quizbox.changeItem = function(n)
        {
                $.fn.quizbox.showLoading();

                opts.itemNum = n;

                $("#quiz_nav").empty();
                $("#quiz_outer").stop();
                $("#quiz_title").hide();
                $(document).unbind("keydown");

                imgRegExp = imgTypes.join('|');
                imgRegExp = new RegExp('\.' + imgRegExp + '$', 'i');

                var url = opts.itemArray[n].url;



                if (url.match(/#/))
                {
                        var target = window.location.href.split('#')[0];
                        target = url.replace(target,'');

                        $.fn.quizbox.showItem('<div id="quiz_div">' + $(target).html() + '</div>');

                        $("#quiz_loading").hide();

                } else if (url.match(imgRegExp))
                {
                        $(imgPreloader).unbind('load').bind('load', function()
                        {
                                $("#quiz_loading").hide();

                                opts.itemArray[n].o.frameWidth	= imgPreloader.width;
                                opts.itemArray[n].o.frameHeight	= imgPreloader.height;

                                $.fn.quizbox.showItem('<img id="quiz_img" src="' + imgPreloader.src + '" />');

                        })
                        .attr('src', url + '?rand=' + Math.floor(Math.random() * 999999999) );
                }
                else
                {
                        $.fn.quizbox.showItem('<iframe id="quiz_frame" scrolling="no" onload="$.fn.quizbox.showIframe()" name="quiz_iframe' + Math.round(Math.random()*1000) + '" frameborder="0" hspace="0" src="' + url + '"></iframe>');
                }
        };

	$.fn.quizbox.showIframe = function()
	{
		$("#quiz_loading").hide();
		$("#quiz_frame").show('slow');

		/* preview answer in iframe */

		var blankspan = $('.blank', window.frames[0].document);
		blankspan.css({'padding': '0px 34px'});
		$('.answer').hover(function()
		/* if id is skip, don't do this */
		{
			if (this.id != "skip") 
			{
				blankspan.fadeTo(1,0.5);
				blankspan.css({'padding': '0px 3px'});
				blankspan.html($(this).text());
			}
			blankspan.fadeTo("slow", 1);
		},
		function()
		{
			blankspan.empty();
			blankspan.css({'padding': '0px 34px'});
			blankspan.fadeTo(100, 0.5);
		});
	}

	$.fn.quizbox.showItem = function(val)
	{
		$.fn.quizbox.preloadNeighborImages();

		 var viewportPos = $.fn.quizbox.getViewport();
		 var itemSize = $.fn.quizbox.getMaxSize(viewportPos[0] - 50, viewportPos[1] - 100,
							opts.itemArray[opts.itemNum].o.frameWidth,
							opts.itemArray[opts.itemNum].o.frameHeight);

		 var itemLeft = viewportPos[2] + Math.round((viewportPos[0] - itemSize[0]) / 2) - 20;
		 var itemTop = viewportPos[3] + Math.round((viewportPos[1] - itemSize[1]) / 2) - 40;

		 /* =========== */
		 /* = Dimension properties = */
		 /* =========== */
		 var itemSizes =
		 {
			 "score":
			 {
				 'left': 143,
				 'top': 0,
				 'width': 381,
				 'height': 365
			 },
			 "intro": 
			 {
				 'left': 143,
				 'top': 0,
				 'width': 392,
				 'height': 410
			 },
			 "instructions": 
			 {
				 'left': 143,
				 'top': 0,
				 'width': 392,
				 'height': 400
			 },
			 "instructions2": 
			 {
				 'left': 143,
				 'top': 0,
				 'width': 392,
				 'height': 415
			 },
			 "begin_quiz": 
			 {
				 'left': 143,
				 'top': 0,
				 'width': 370,
				 'height': 410
			 },
			 "*": 
			 {
				 'left': 73,
				 'top': 10,
				 'width': 512,
				 'height': 404
			 }
		 }
		 // if there is not item_type, use the default;
		 var itemOpts = (opts.itemArray[opts.itemNum].item_type != "quiz_item") ?
			itemSizes[opts.itemArray[opts.itemNum].item_type] :
			itemSizes["*"];
		 
		if (opts.active) 
		{
			$('#quiz_content').show("normal", function()
			{
				$("#quiz_content").empty();

				$("#quiz_outer").animate(itemOpts, "normal", function()
				{
					$("#quiz_content").append($(val)).show();
					$.fn.quizbox.updateDetails();
				});
			 });
		}
		else
		{
			opts.active = true;

			$("#quiz_content").empty();

			if ($("#quiz_content").is(":animated"))
			{	 
			}

			if (opts.itemArray[opts.itemNum].o.zoomSpeedIn > 0)
			{
				opts.animating = true;
				itemOpts.opacity = "show";
				$("#quiz_outer").css({
					'top':  20, //opts.itemArray[opts.itemNum].orig.pos.top - 18,
					'left': opts.itemArray[opts.itemNum].orig.pos.left - 18,
					'height': opts.itemArray[opts.itemNum].orig.height,
					'width': opts.itemArray[opts.itemNum].orig.width + 50
				});

				$("#quiz_content").append($(val)).show();

				$("#quiz_outer").animate(itemOpts, opts.itemArray[opts.itemNum].o.zoomSpeedIn, function()
				{
					opts.animating = false;
					$.fn.quizbox.updateDetails();
				});
			}
			else
			{
				$("#quiz_content").append($(val)).show();
				$("#quiz_outer").css(itemOpts).show();
				$.fn.quizbox.updateDetails();
			}
		}
	};

	$.fn.quizbox.updateDetails = function()
        {
		$("#quiz_bg,#quiz_close").show();

		/* =========== */
		/* = Update Button Display = */
		/* =========== */

		function startTimer(cb)
		{
			if($.fn.quizbox._t)
			{
				clearTimeout($.fn.quizbox._t);
				$('.timer_bar').stop().css('width', '100%');
			}
			// Start timer --Morgan
			$.fn.quizbox._t = setTimeout(function()
			{
			    
				$('.timer_bar').animate(
				{
					width: 0
				},
				{
					duration: 14000,
					easing: 'linear',
					complete: (function()
					{					
						if(!cb)
						return function()
						{
							$('#timeout').click();  
							$('.timer_bar').css('width', '100%');
							$.fn.quizbox._t = false;
						};
					
                                                return cb;
                                        })()
                                });
                         },3000);
                };


                /* Fill in titles for answer keys - redundant! make this more robust before something blows up*/
		if (opts.itemArray[opts.itemNum].item_type == "quiz_item")
		{
			$('#quiz_title').show();
			$('#quiz_title div.buttons').hide(); 
			$('#quiz_answers').show();           

			/* TODO change to toggle */
			$('#answer1').empty();     
			$('#answer2').empty();
			$('#answer3').empty();
			$('#answer1').html(opts.itemArray[opts.itemNum].answer1);     
			$('#answer2').html(opts.itemArray[opts.itemNum].answer2);
			$('#answer3').html(opts.itemArray[opts.itemNum].answer3);
			$('#quiz_answers div.arrow').html('<img src="/static/stylesheets/img/pinkarrow.png"/>');
			startTimer();
			var click_status = [];
			click_status[opts.itemNum] = false;

			$('#quiz_answers').find('a').click(function()
			{
				if (click_status[opts.itemNum] == false)
				{
					$.fn.quizbox.submit_answer(this);

					click_status[opts.itemNum] = true;
					return click_status;
				}
			});
		}
		else if (opts.itemArray[opts.itemNum].item_type == "intro")
		{
			/* hide answers and show hidden intro choices */
			$('#quiz_title').show();
			$('#quiz_title div.buttons').hide(); 
			$('#quiz_intro').fadeIn('slow');  

			$('#choose_quiz').html(opts.itemArray[opts.itemNum].choose_quiz);
		}
		else if (opts.itemArray[opts.itemNum].item_type == "instructions")
		{
			$('#example_2', window.frames[0].document).hide();
			$('#example_1', window.frames[0].document).fadeIn('slow');
			$('#quiz_title').show();
			$('#quiz_title div.buttons').hide();   
			$('#quiz_instructions').show();  
			$('#answer1 .answertext').html(opts.itemArray[opts.itemNum].answer1);     
			$('#answer2 .answertext').html(opts.itemArray[opts.itemNum].answer2);
			$('#answer1,#answer2').mouseover(function(e)
			{
				$(this).not('.hovered').addClass('hovered');
				if($(this).parent().find('.hovered').length > 1 && $('#example_2', window.frames[0].document).is(':hidden'))
				{
					$('#example_1,#example_2', window.frames[0].document).toggle('slow');

					$('#quiz_instructions').find('#answer1,#answer2').click(function() {
						$.fn.quizbox.submit_answer(this);
					});
				}
			});
		}
		else if (opts.itemArray[opts.itemNum].item_type == "instructions2")
		{
			//$('#example_1', window.frames[0].document).show();
			$('#example_2', window.frames[0].document).hide();

			$('#quiz_title').show();
			$('#quiz_title div.buttons').hide();
			$('#quiz_instructions2').show();  

			$('#answer1 .answertext').html(opts.itemArray[opts.itemNum].answer1);

			$('.timer_bar').css('margin-left', '-10px');
			$('.timer_bar').css('width', '112%');

			$('#answer2 .answertext').html(opts.itemArray[opts.itemNum].answer2)
                        $('#quiz_instructions2')
                        .find('#answer1,#answer2').click(function()
                        {

                                $('#example_1,#example_3', window.frames[0].document).hide('slow');
                                $('#example_2', window.frames[0].document).show('slow');
                                clearTimeout($.fn.quizbox._t);
                                $('.timer_bar').stop();
                                $('.timer_bar').css('width', '112%'); 

                                // bind the skip button
                                $('#skip').click(function() { $.fn.quizbox.submit_answer(this); });
                                $('#quiz_instructions2').find('#answer1,#answer2').unbind('click');
                        });


			var timerCb = function()
			{
				$('.timer_bar').css('width', '100%');						
				$('#example_1,#example_2', window.frames[0].document).hide();
				$('#example_3', window.frames[0].document).show();
				startTimer(timerCb);
			};
			startTimer(timerCb);

		}
		else if (opts.itemArray[opts.itemNum].item_type == "begin_quiz")
		{
			$('#quiz_title').show();
			$('#quiz_title div.buttons').hide();
			$('#quiz_begin_quiz').show();
			$('.timer_bar').css('margin-left', '0px'); 
			$('#startquiz').click(function()
			{
				opts.itemArray = jQuery.grep(opts.itemArray, function(e,i)
				{
					return (
						($('#proficiency_choices', window.frames[0].document).find('[@value=' + e.proficiency + ']:checked').length > 0) ||
						(!e.proficiency)
					       );
				});
				$.fn.quizbox.submit_answer(this);

			});
		}
		else if (opts.itemArray[opts.itemNum].item_type == "score")
		{
			$('#quiz_title').show();
			$('#quiz_title div.buttons').hide();
			$('#quiz_score').show();
		}
		else
		{
			$('#quiz_title').hide();
		}

		if (opts.itemArray[opts.itemNum].o.hideOnContentClick)
		{
			$("#quiz_content").click($.fn.quizbox.close);
		}
		else
		{
			$("#quiz_content").unbind('click');
		}

		$(document).keydown(function(event)
		{
			if (event.keyCode == 27)
			{
				//$.fn.quizbox.close();
			}
			else if(event.keyCode == 37 && opts.itemNum != 0)
			{
				$.fn.quizbox.changeItem(opts.itemNum - 1);
			}
			else if(event.keyCode == 39 && opts.itemNum != (opts.itemArray.length - 1))
			{
				$.fn.quizbox.changeItem(opts.itemNum + 1);
			}
		});
	};

	$.fn.quizbox.preloadNeighborImages = function()
	{
		if ((opts.itemArray.length - 1) > opts.itemNum)
		{
			preloadNextImage = new Image();
			preloadNextImage.src = opts.itemArray[opts.itemNum + 1].url;
		}

		if (opts.itemNum > 0)
		{
			preloadPrevImage = new Image();
			preloadPrevImage.src = opts.itemArray[opts.itemNum - 1].url;
		}
	};

	$.fn.quizbox.close = function()
	{
		if (opts.animating)
			return false;

		// kill animation to window does not reopen on 'skip' --Morgan
		$('.timer_bar').stop();

		$(imgPreloader).unbind('load');
		$(document).unbind("keydown");

		$("#quiz_loading,#quiz_title,#quiz_close,#quiz_bg").hide();

		$("#quiz_nav").empty();

		opts.active	= false;

		if (opts.itemArray[opts.itemNum].o.zoomSpeedOut > 0) 
		{
			var itemOpts =
			{
				'top': opts.itemArray[opts.itemNum].orig.pos.top - 18,
				'left': opts.itemArray[opts.itemNum].orig.pos.left - 18,
				'height': opts.itemArray[opts.itemNum].orig.height,
				'width': opts.itemArray[opts.itemNum].orig.width,
				'opacity': 'hide'
			};

			opts.animating = true;

			$("#quiz_outer").animate(itemOpts, opts.itemArray[opts.itemNum].o.zoomSpeedOut, function()
			{
				$("#quiz_content").hide('fast').empty();
				$("#quiz_overlay,#quiz_bigIframe").remove();
				opts.animating = false;
			});
		}
		else
		{
			$("#quiz_outer").hide();
			$("#quiz_content").hide().empty();
			$("#quiz_overlay,#quiz_bigIframe").fadeOut("fast").remove();
		}
	};

	$.fn.quizbox.showLoading = function()
	{
		clearInterval(loadingTimer);

		var pos = $.fn.quizbox.getViewport();

		$("#quiz_loading").css({'left': ((pos[0] - 40) / 2 + pos[2]), 'top': ((pos[1] - 40) / 2 + pos[3])}).show();

                // running the animation while everything else is going on is causing a lot of delays -Morgan
		//loadingTimer = setInterval($.fn.quizbox.animateLoading, 66);
	};

	$.fn.quizbox.animateLoading = function(el, o)
	{
		if (!$("#quiz_loading").is(':visible'))
		{
			clearInterval(loadingTimer);
			return;
		}

		$("#quiz_loading > div").css('top', (loadingFrame * -40) + 'px');

		loadingFrame = (loadingFrame + 1) % 12;
	};

	/* =========== */
	/* = Create Buttons = */
	/* =========== */

	$.fn.quizbox.init = function()
	{
		/* Create Answer Buttons */
		if ($('#quiz_wrap').length < 1)
                {
                        $.ajax({
                                url: '/quiz_frame',
                                complete: function(xhr,status)
                                {
                                        $('body').append(xhr.responseText);

                                        /* initialize automatic countdown...if it reaches zero, changeItem +1 */
                                        $("#minutes-box").hide();

                                        /* effect on answer hover */

                                        $(".answer").hover(function()
                                        {
                                                $(this).css({
                                                        'font-variant': 'small-caps',
                                                        'letter-spacing': '.00em'
                                                });
                                        }, function()
                                        {
                                                $(this).css({ 'font-variant': 'normal','letter-spacing': '.01em' });
                                        });
                                        
                                        $(".notanswer").hover(function()
                                        {
                                                $(this).css({
                                                        'font-variant': 'small-caps',
                                                        'letter-spacing': '.01em'
                                                });
                                        }, function()
                                        {
                                                $(this).css({ 'font-variant': 'normal','letter-spacing': '.12em' });
                                        });

                                        $('#take_quiz').click(function()
                                        {
                                                submit_answer(this);
                                        });

                                        var submit_answer = $.fn.quizbox.submit_answer = function(answer)
                                        {     
                                                if(answer.id == "skip")
                                                {
                                                        var answer_text = "skip_item";
                                                }
                                                else if(answer.id == "timeout")
                                                {
                                                
                                                        var answer_text = "timeout";
                                                }
                                                else
                                                {
                                                        var answer_text = $(answer).text();
                                                }

                                                if(opts.itemArray[opts.itemNum].item_type == "quiz_item")
                                                {
                                                        var answer_slug = opts.itemArray[opts.itemNum].slug;

                                                        SubmitScore(answer_text, answer_slug);
                                                } 

                                                if(opts.itemArray[opts.itemNum].item_type == "score")
                                                {
                                                        return false;
                                                }

                                                if(answer.id == "choose_quiz")
                                                { 
                                                        /* TODO cycle through quiz choices */
                                                        var selection = $('#quiz_selections', window.frames[0].document);
                                                        selection.find('#quiz_selections').toggle();

                                                        return false;
                                                }
                                                /* proceed to next item */
                                                $.fn.quizbox.changeItem(opts.itemNum + 1);
                                                return false;
                                        }        

                                        if ($.browser.msie)
                                        {
                                                $("#quiz_inner").prepend('<iframe id="quiz_freeIframe" scrolling="no" frameborder="0"></iframe>');
                                        }

                                        if (jQuery.fn.pngFix)
                                                $(document).pngFix();

                                        $("#quiz_close").click($.fn.quizbox.close);
                                }
                        });

			function timeleft(timetype)
			{
				var days=0, hours=0, mins=0;
				var e = new Date(2008,11,25,0,0,0);
				var now  = new Date();
				var left = e.getTime() - now.getTime();

				left = Math.floor(left/1000);
				days = Math.floor(left/86400);
				left = left%86400;
				hours=Math.floor(left/3600);
				left=left%3600;
				mins=Math.floor(left/22);
				left=left%60;
				secs=Math.floor(left);

				switch(timetype)
                                {
					case "s":
						return secs;
					break;
					case "m":
						return mins;
					break;
					case "h":
						return hours;
					break;
					case "d":
						return days;
					break;
				}
			}

			function set_start_count()
			{
				set_minute_count();
			}

			function set_minute_count()
			{
				m = timeleft('m');
				$('#minutes-count').text(m.toString()+ ' minute(s)');
			}

			function update_minute()
			{
				var now = new Date();
				var mw = $('#minutes-outer').css('width');
				mw = mw.slice(0,-2);
				var s = now.getSeconds(); 
				sleft = (60 - s);

				if (sleft == 0)
				{
					sleft=60;
				}

				m = ((sleft/60)*mw).toFixed();
				$('#minutes-inner').css({width:m});
				return sleft*1000;
			}

			function reset_minute()
                        {
				$('#minutes-inner').width($('#minutes-outer').width());
				start_countdown_minute();
			}

			function start_countdown_minute()
                        {
				set_minute_count();
				$('#minutes-inner').animate({width: 0}, update_minute(),reset_minute);
				//update_minute());
			}          

			/* =========== */
			/* = Click Binding = */
			/* =========== */

			/* submit answers and proceed to next question */
		} 

	}; /* end init fn */

	$.fn.quizbox.getPosition = function(el)
	{
		var pos = el.offset();

		pos.top	+= $.fn.quizbox.num(el, 'paddingTop');
		pos.top	+= $.fn.quizbox.num(el, 'borderTopWidth');

		pos.left += $.fn.quizbox.num(el, 'paddingLeft');
		pos.left += $.fn.quizbox.num(el, 'borderLeftWidth');

		return pos;
	};

	$.fn.quizbox.num = function (el, prop)
	{
		return parseInt($.curCSS(el.jquery?el[0]:el,prop,true))||0;
	};

	$.fn.quizbox.getPageScroll = function()
	{
		var xScroll, yScroll;

		if (self.pageYOffset)
		{

			yScroll = self.pageYOffset;
			xScroll = self.pageXOffset;
		}
		else if (document.documentElement && document.documentElement.scrollTop)
		{

			yScroll = document.documentElement.scrollTop;
			xScroll = document.documentElement.scrollLeft;
		}
		else if (document.body)
		{

			yScroll = document.body.scrollTop;
			xScroll = document.body.scrollLeft;	
		}

		return [xScroll, yScroll]; 
	};

	$.fn.quizbox.getViewport = function()
	{
		var scroll = $.fn.quizbox.getPageScroll();

		return [$(window).width(), $(window).height(), scroll[0], 0]; //  scroll[1] - goes up from 0 to 30 in Safari, although hard-coding 0 doesn't solve the problem.
	};

	$.fn.quizbox.getMaxSize = function(maxWidth, maxHeight, imageWidth, imageHeight)
	{
		var r = Math.min(Math.min(maxWidth, imageWidth) / imageWidth, Math.min(maxHeight, imageHeight) / imageHeight);
		return [Math.round(r * imageWidth), Math.round(r * imageHeight)];
	};
})(jQuery);
