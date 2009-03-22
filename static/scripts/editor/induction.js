


jQuery(function($) {
	
	
// Setup RPC methods
var server = {};
var item_count = 0;

InstallFunction(server, 'RetrieveProficiencies', 'quizbuilder');

InstallFunction(server, 'SubmitContentUrl', 'quizbuilder');

InstallFunction(server, 'GetTopicsForProficiency', 'quizbuilder');


wrong_answers = [];
answer_in_array = [];



$('.proficiency_name').preserveDefaultText('proficiency');
$('.url_name').preserveDefaultText('url');


server.RetrieveProficiencies("all", AfterRetrieveProficiencies);  // Create list of proficiencies 


function AfterRetrieveProficiencies(response){ 

var proficiencies = parseJSON(response);




 $.each(proficiencies, function(t, proficiency){
$('div#url_proficiencies').append('<div class="input_float"><input type="checkbox" id="' + t + '" name="proficiency" value="' + proficiency.name + '" unchecked ><span>' + proficiency.name + '</span><br/></div>')

.find('input[@name="proficiency"]').click(function(){
$('input[@name="proficiency"]').setValue($(this).attr("value"));    });

proficiency_sum = t + 1;
return proficiency_sum;
});


$('input[@name="proficiency"]').setValue(proficiencies[0].name);  //default


$('#submit_url').click(function () {

        for (j = 0; j < proficiency_sum; j++) {
if (eval('document.content_url.proficiency[' + j + '].checked') == true) {
    var proficiency = eval('document.content_url.proficiency[' + j + '].value')
    }}

    server.GetTopicsForProficiency(proficiency, function(response){ 
    	var topics = response;
     server.SubmitContentUrl(document.content_url.url.value, proficiency, function(response){  
    		BuildQuizEditor(response, topics); });
		});
    
    
   
    
    
$('form#content_url').hide();
$('div#loading_items').show();
    
});


}




 

});

