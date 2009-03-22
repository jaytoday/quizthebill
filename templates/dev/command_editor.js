CmdUtils.CreateCommand({
    name: "quiz",
    icon: "http://www.plopquiz.com/favicon.ico",
    homepage: "http://www.plopquiz.com/preview/homepage",
    author: {
        name: "Ben Dowling",
        email: "ben.m.dowling@gmail.com"
    },
    license: "GPL",
    description: "Generate a PlopQuiz Quiz Item",
    help: "Select the quiz statement, or type it in after the command",
    takes: {"statement": noun_arb_text},
    
    preview: function(pblock, statement){
        // Display the quiz statement. Either the user selection or the text they write
        var statement = CmdUtils.getSelection() || statement.text;
        var html = "<p><b>Quiz Statement:</b><br/><div id='statement'>" + statement + "</div></p>"
        pblock.innerHTML = html;
    },
    
    execute: function(statement){

        /*
         *
         * Setup Variables - Abstract differences between ubiquity and portable editor
         *
         */       

        var this_url = CmdUtils.getWindow().location.href;      
        var get_selection = function(){ return CmdUtils.getSelection(); };
        var statement = get_selection() || statement.text;
        var doc = CmdUtils.getDocument();
        var serverUrl = "http://localhost:8080";
        
        var id = "pq-injected-data";
        
        jQuery.ajax({
            type: "POST",
            url: serverUrl + "/ubiquity/",
            data:    {
            get: "html",
            text: statement },
    
    
            error: function(data){
                jQuery(doc.body).append("<div id='error'>" + data + "</div>");
            },
            success: function(data){
                // Remove existing injected data
                jQuery('#' + id, doc.body).remove();
                jQuery('head', doc).append('<link rel="stylesheet" type="text/css"  href="' + serverUrl + '/static/html/quizbuilder/ubiquity.css" />');
                jQuery.post(serverUrl + '/ubiquity/?get=js', function(script){
                    eval(script); // jQuery.getScript() doesn't work in Ubiquity sandbox.
                    // Inject remote data
                    jQuery(doc.body).append("<div id='" + id + "'>" + data + "</div>");
                    runCode();
                });
            },
          complete: function(data){  $(doc).data('context', "this should be text or title of the document"); }
        });
    }
});


