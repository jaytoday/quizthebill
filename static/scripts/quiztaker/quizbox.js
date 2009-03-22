/*
* Quizbox Library 

*/

(function($)
{
	var opts = {}, 
	imgPreloader = new Image, imgTypes = ['png', 'jpg', 'jpeg', 'gif'], 
	loadingTimer, loadingFrame = 1;

        $(function()
        {
                $.plopquiz.init();
        });

        $.plopquiz =
        {
                quizitemList: Array(),
                currentItem: 0,
                settings:
                {
                        autoStart: true, // debugging only
                        initDone: false,
                        startTime: (new Date()),
                        timeoutDuration: 20000,
                        instructions:
                        {
                                i1complete: false,
                                i2timedOut: false
                        }
                },
                specialTimers:
                {
                        "instructions2": function()
                        {
                        	$("#example_1").hide();
                        	$("#example_2").hide();
                        	$("#example_3").show();
                                
                               // $.plopquiz.specialTimers["instructions2"] = function() {};
                        }
                }
        };

        // this function setups event handlers and ensure everything is setup properly,
        // then call $.plopquiz.start, which actually deals with CSS and loading the quiz
        $.plopquiz.init = function()
        {
                $.ajax({
                        url: '/quiz_frame',
                        complete: function(xhr,status)
                        {
                                $('body').append(xhr.responseText);

                                $('#quiz_wrap')
                                        .bind('quizstarting', function()
                                        {
                                                $(this).show();
                                        })
                                        .bind('quizclosing', function()
                                        {
                                                $(this).hide();

                                                // reset to start of quiz, later this should handle skipping instructions;
                                                $.plopquiz.currentItem = 0;
                                        });

                                $('#quiz_close').click(function()
                                {
                                        $.event.trigger('quizclosing');
                                        
                                        window.location = "/preview/";
                                });

                                $('#quiz_timer')
                                        .bind('quizItemLoaded', function(event, quizItem)
                                        {
                                                var self = this;
                                                if(!quizItem || !quizItem.timed || $.plopquiz.settings.noTimer)
                                                        return;

                                                // reset and start timer.
                                                var reset = function()
                                                {
                                                      $('.timer_inner', self).stop();
                                                        
                                                        $('.timer_inner', self)
                                                                .css('width', '100%');
                                                                
                                                                if (quizItem.item_type == "quiz_item")
								{
									timer_width = $('.timer_bar').width(); // to calculate score
									$('#quiz_answers').find('div').addClass('disabled');
									$('.timer_inner', self).animate({opacity: 1.0}, 2000, function()
									{
										$('#quiz_content').animate({opacity: 1}, 1000);
										$('#quiz_answers').find('div').removeClass('disabled');
									});
								}
                                                                
                                                                $('.timer_inner', self).animate(
                                                                {
                                                                        width: 0
                                                                },
                                                                {
									complete: function()
									{
										if(quizItem.timeout == "reset")
										{
											if(quizItem.timed)
												$.plopquiz.specialTimers[quizItem.timed]();

											$(self).stop();
										      return reset();
										}

										$.plopquiz.submitAnswer(quizItem.timed, quizItem);
									},
									duration: $.plopquiz.settings.timeoutDuration,
									easing: 'linear'
                                                                })
                                                                .show();
						}
                                                reset();
                                        })
                                        .bind('loadingQuizItem', function()
                                        {
                                                $(this).stop();
                                        })
                                        .bind('submitingAnswer', function()
                                        {
                                                $(this).stop();
                                        });

                               
                                //var textHolder = $('#blank').text();
                                var textHolder = '     ';

                                $('#quiz_answers .answer').hover(function()
                                {
                                	if ($(this).attr('id') == 'skip')
						return;

					$('#blank').html($('.answertext', this).text().replace(/\ /g, "&nbsp;"))
					//.css({'padding': '0px 0px'})
					.css({'width': '100px'})
					;
                                        
                                },
                                function()
                                {
                                       $('#blank').text(textHolder)
                                       //.css({'padding': '0px 34px'});
                                      .css({'width': '100px'});
                                })
                                .click(function(e)
                                {
                                	if ($(this).hasClass('disabled')){ return false; }
                              
                                       $.plopquiz.submitAnswer($(this).find('div.answertext').text().replace(/\n/g,"")); 
                                })
                                .each(function()
                                {
                                        //$(this).attr('href', "#" + $(this).attr('id'));
                                });

                                if($.plopquiz.settings.autoStart)
                                        $.plopquiz.start();
                        }
                });

                $('#tab_apply').click($.plopquiz.start);
                $('#description_apply').click($.plopquiz.start);
        }; // $.plopquiz.init

        $.plopquiz.start = function()
        {
                $.event.trigger('quizstarting');
                $.plopquiz.loadItem($.plopquiz.currentItem++);
        }; // $.plopquiz.start

        $.plopquiz.loadItem = function(itemNum)
        {
                var quizItem = $.plopquiz.quizitemList[itemNum];
                
                $.event.trigger('loadingQuizItem');
                $.ajax({
                        url: quizItem.url,
                        complete: function(xhr, s)
                        {
                                $('#quiz_content').css({opacity: 0}).html(xhr.responseText).animate({opacity: 1.0}, 0);

                                $('#quiz_answers .answer')
                                        .hide()

                                for ( var i in quizItem.answers )
                                {
					/* some settings... */
					$('#quiz_content').attr('class', quizItem.item_type + '_content');
					
					$('#quiz_answers').attr('class', quizItem.item_type + '_answers');
					
					$('#quiz_inner').attr('class', quizItem.item_type + '_quiz_inner');
					
					$('.quiz_selection').attr('id', quizItem.item_type + '_quiz_selection');
					
					
					if (quizItem.item_type == 'intro' || quizItem.item_type == 'begin_quiz' || quizItem.item_type == 'quiz_complete'){  
						var this_answer = $('#quiz_answers #confirm');
					}
					else
					{ 
						var this_answer = $('#quiz_answers .answer:eq(' + i + ')'); 
					}

					this_answer
						.show()
						.find('.answertext')
						.html(quizItem.answers[i]);
                                }

                                if(quizItem.timed)
                                        $('#quiz_timer').show();
                                else
                                        $('#quiz_timer').hide();
                               
                                if(!quizItem.noSkip)
                                        $('#skip').show();
                                else
                                        $('#skip').hide();

                                /*
                                 * Setup special cases for instructions here
                                 * does not work well right after ajax load
                                 * and does not allow skipping instruction 1 o 2
                                 */

				if(quizItem.item_type == "intro")
                                {
					if (quizItem.vendor.length > 1){ $('p#employer').find('b').text(quizItem.vendor); }
				}
                                	
                                if(quizItem.item_type == "instructions")
                                {
                                	
                                        var i1mouseOverCount = 0;
                                        var i1mouseOver = function()
                                        {
                                                // unbind is to prevent incrementing on the same button
                                                $(this).unbind('mouseover',i1mouseOver);
                                                if(++i1mouseOverCount >= 2)
                                                {
                                                        $('#example_1,#example_2').toggle();
                                                        $.plopquiz.settings.instructions.i1complete = true;
                                                        i1mouseOverCount = null;
                                                }
                                        };

                                        $("#quiz_answers .answer").mouseover(i1mouseOver);
                                }
                                
				if(quizItem.item_type == "instructions2")
                                {
                                       $('a#skip').hide(); 
                                }


                                if(quizItem.item_type == "begin_quiz")
                                {
					var p = {};
                                        for(var i in $.plopquiz.quizitemList)
                                                if(!p[$.plopquiz.quizitemList[i].proficiency] && $.plopquiz.quizitemList[i].proficiency)
                                                        p[$.plopquiz.quizitemList[i].proficiency] = 0;
                                                else if($.plopquiz.quizitemList[i].proficiency)
                                                        p[$.plopquiz.quizitemList[i].proficiency]++;
                                        if (p.length == 1){ console.log('skip');} //todo: skip if there is only one proficiency
                                        for(i in p)
                                                $("#proficiency_choices").append('<input type="checkbox" value="' + i + '" checked /><span class="proficiency">' + i + '</span><br />');
                                }
                                
                                      if(quizItem.item_type == "quiz_item")
                                {
                                              $('#blank').empty();
                                              $('#quiz_content').css({opacity: 0});
										  }   
               				if(quizItem.item_type == "quiz_complete")
                                {
                                	$('div#confirm').hide();
									// signup binding
									$('div.form_proceed').click(function(){
										
										var current_id  = $(this).attr('id');
										var next_id  = parseInt(current_id) + 1;
										
										if ($('form.signup').find('ul#' + next_id).length == 0){ Register(document.signup);   return;}
										$('form.signup').find('ul#' + current_id).fadeOut(200, function(){ $('form.signup').find('ul#' + next_id).fadeIn(200); });
										
										
										$(this).attr('id', next_id);
									});      
                                       
                                        
                                }                


                                // short delay to ensure everything is loaded
                                setTimeout(function()
                                {
                                        $.event.trigger('quizItemLoaded', [ quizItem ]);
                                },100);
                        },
                        error: function(xhr,s)
                        {
                                console.log("Ajax error: ", xhr,s);
                        }
                });
        };

        $.plopquiz.submitAnswer = function(answer, quizItem)
        {
                $.event.trigger("submitingAnswer");
                // check the answer for special cases
                // this will handle the non-skiping timeout on instructions2,
                // the proficiencies, the score, and any other special boxes
                switch($.plopquiz.quizitemList[$.plopquiz.currentItem - 1].item_type)
                {
                        case "instructions":
                                if(!$.plopquiz.settings.instructions.i1complete)
                                        return;
                                else
                                        $.plopquiz.loadItem($.plopquiz.currentItem++, quizItem);
                        break;

                        case "instructions2":

                                if(!$.plopquiz.settings.instructions.skip_segment){
                               $.plopquiz.settings.instructions.i2timedOut = true;
                               $('.timer_bar').stop();
                                $('.timer_bar').css('width', '100%'); 
                                $('#example_1,#example_3').hide('slow');
                                $('#example_2').show('slow');
                                $('a#skip').show();
                                //click binding
                              $('#quiz_answers').find('#answer1,#answer2').addClass('disabled');
                                $.plopquiz.settings.instructions.skip_segment = "true";
                                        return; }
                                else
                                        $.plopquiz.loadItem($.plopquiz.currentItem++);
                                       $('#quiz_answers').find('#answer1,#answer2').removeClass('disabled');
                        break;

                        case "begin_quiz":
                        
                                var proficiencies = Array();
                                $('#proficiency_choices input:checked').each(function() { proficiencies.push($(this).val()); });
                                $.plopquiz.quizitemList = $.grep($.plopquiz.quizitemList, function(n, i)
                                {
                                        if(n.item_type != "quiz_item")
                                                return true;

                                        for(var i in proficiencies)
                                                if(n.proficiency == proficiencies[i])
                                                        return true;
                                        return false;
                                });
                                $('.timer_bar').css('width', '100%'); 
                                
                                 $.plopquiz.loadItem($.plopquiz.currentItem++);
                        break;

                        case "quiz_item":
                         // ajax call to submit -- (answer, key, vendor)
                         var this_item = $.plopquiz.quizitemList[$.plopquiz.currentItem - 1];
                         var timer_status = $('.timer_bar').width()/timer_width;
                         SubmitScore(answer, timer_status, this_item.key, this_item.vendor);

                                $.plopquiz.loadItem($.plopquiz.currentItem++);
                                $('.timer_bar').css('width', '100%');
                        break;
                        
                        case "quiz_complete":
                        break;
                        
                        default:
                                $.plopquiz.loadItem($.plopquiz.currentItem++);
                        break;
                };
        };



})(jQuery);




