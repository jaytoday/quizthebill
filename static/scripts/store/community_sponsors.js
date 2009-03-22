  $(function() {
    $('.error').hide();  
    console.log($("button#sponsor_submit"));
    
    
    
    // Submit Sponsor Application
    $("button#sponsor_submit").click(function() {

      // validate and process form here
      
      $('.error').hide();
      
      
  	  var name = $("input#name").val();
  		if (name == "") {
        $("label#name_error").show();
        $("input#name").focus();
        return false;
      }
  		var email = $("input#email").val();
  		if (email == "" ) {
        $("label#email_error").show();
        $("input#email").focus();
        return false;
      }
  		if (email.indexOf("@") == -1) {
        $("label#valid_email_error").show();
        $("input#email").focus();
        return false;
      }
     
     $('div#sponsor_application').hide('slow');
     $('div#submit_success').show('slow');
     
     // ajax call
     	$.ajax({
		type: "POST", 
		url: '/employer/rpc/post',
		datatype: "json",
		data:
			{
					action: "apply",
					name: name, 
					email: email
			},
		success: function(response) { }
});			
     
    });


// Take a Quiz link
$('a#preview_quiz').click(function(){ 
	$.getScript("/js/quiz/?autostart=True");
});    
    
FeedScroll();
    
  });
  

  
  
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
