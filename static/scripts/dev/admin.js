$(function(){

$('#submit_business').click(function(){
	
//	console.log('click');
	$.ajax(
                                {
                                        url:  "/dev/rpc",
                                        data:
                                        {
                                                action: "add_business",
                                                arg0: '"' + $('input#business_name').val() + '"'
                                        },
                                        success: function(response)
                                        {
//	console.log(response)               

}
});
});



$('a.delete').click(function(){

var this_link = $(this);

	$.ajax(
                                {
                                        url:  "/dev/rpc",
                                        data:
                                        {
                                                action: "delete_data",
                                                arg0: '"' + $(this).attr('id') + '"'
                                        },
                                        success: function(response)
                                        {
	// console.log(response.split('Status')[0]);
	this_link.parent().find('div.response').append(response.split('Status')[0]);                   
	
	}
});
});



$('a.load').click(function(){
	

LoadData($(this));


});


$('a#restore_all_data').click(function(){
	
var check = confirm("Do you want to restore backup data? Existing data may be deleted!");

if (check) {
	RestoreInit();
}
else window.location="/dev/admin";


});


$('a#mailout').click(function(){

var mail_type = prompt("What Mail Type?"); 

MailOut(mail_type);

});


}); // end of onLoad



function LoadData(this_link){

	$.ajax(
                                {
                                        url:  "/dev/rpc",
                                        data:
                                        {
                                                action: "load_data",
                                                arg0: '"' + this_link.attr('id') + '"'
                                        },
                                        success: function(response)
                                        {
	
	
	
	this_link.parent().find('div.response').append(response.split('Status')[0]);    
	
	if (response.indexOf("Data Load Is Finished") != -1)  { 
		return;
	
	}
	      LoadData(this_link);    // Cycle is not completed yet     
	
	}
});

}



function MailOut(mail_type){

	$.ajax(
                                {
                                        url:  "/dev/rpc",
                                        data:
                                        {
                                                action: "mailout",
                                                arg0: '"' + mail_type + '"'
                                        },
                                        success: function(response)
                                        {
	
	$('a#mailout').parent().find('div.response').append(response.split('Status')[0]);    
	
	if (response.indexOf("Mailout Is Finished") != -1)  { 
		return;
	
	}
	      MailOut(mail_type);    // Cycle is not completed yet     
	
	}
});

}


{% include "../../static/scripts/dev/restore.js" %}
