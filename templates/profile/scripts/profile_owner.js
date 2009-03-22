


$(function()
{


        
        $('#sponsor_owner').click(function(){
        	
        	        	ShareProfile();
        	});
        
     



});




function ShareProfile() {
	
   
        	$("#share_profile").dialog({ 
    modal: true,
    resizable: false,
    draggable: true,
    height: 380,
    width: 545,
    overlay: { 
        opacity: 0.5, 
        background: "black" 
    },
        buttons: { 
 
 /*      	
                "Share Your Profile": function() { 
            return false; 
            $(this).find('div').hide();
            $(this).find('div.sponsors').show();
        }
*/
   } 
     
}).show();

$('div.ui-dialog-buttonpane').find('button:first').addClass('clicked'); // initialize on first button
 $('div.ui-dialog-buttonpane > button').click(function(){
 	$(this).parent().find('button').removeClass('clicked');
 	$(this).addClass('clicked');
});

	//  $(this).dialog("close"); 
}
