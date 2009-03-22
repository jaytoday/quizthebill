/*
 * 
 * This script still doesn't delete or destroy_everything. 
 *
 */  

function RestoreInit(){
	
	if ($('a#restore_all_data').length > 1) return false;
	
	var response = $('a#restore_all_data').parent().find('div.response');
	
	response_html = "Refreshing Datastore......"
	
	response.append(response_html);
	
	var data_types = Array(); 
	
	$('a.load').each(function(i){  data_types[i] = $(this).attr('id'); });
	
    
    data_type = data_types.shift(); 
    response.append("<br/> <br/> now restoring " + data_type);
    runRestore(data_types, data_type, response);


	


}




function runRestore(data_types, data_type, response){
	

	$.ajax(
                                {
                                        type: "GET", 
                                        url:  "/dev/rpc",
                                        data:
                                        {
                                                action: "load_data",
                                                arg0: '"' + data_type + '"'
                                        },
                                        success: function(response_html)
                                        {
	
	
	if (response_html.indexOf("Data Load Is Finished") != -1)  { 
		response.append("<br/> <br/> " + data_type + " is finished restoring.")
		data_type = data_types.shift();
		if (data_type == undefined) {
			$.ajax( {url:  "/dev/rpc",data: { action: "refresh_profile_images" },  success: function(response_html){
				
				response.append("<br/><br/><br/> <br/> <b>restore process is complete!</b> ");
				
				}  });
                                        
                                        return;
		}
		
		response.append("<br/> <br/> now restoring " + data_type);
		runRestore(data_types, data_type, response);
	
	} else  runRestore(data_types, data_type, response);    // Cycle is not completed yet     
	
	}
	
	
});



// set timeout

// return "error"

}

