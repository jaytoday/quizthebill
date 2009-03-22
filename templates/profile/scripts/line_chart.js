
      google.load("visualization", "1", {packages:["linechart"]});
      
      // Set a callback to run when the API is loaded.
      google.setOnLoadCallback(drawlineChart);  
     

  
      function drawlineChart(){
       var data = new google.visualization.DataTable();

        data.addColumn('string', 'Year');
        data.addColumn('number', 'Links');
        data.addColumn('number', 'Widgets');
        data.addColumn('number', 'Site');
        data.addRows(3);
        data.setValue(0, 0, 'Oct 23-Oct 30');
        data.setValue(0, 1, 300);
        data.setValue(0, 2, 200);
        data.setValue(0, 3, 600);
        data.setValue(1, 0, 'Oct 31-Nov 7');
        data.setValue(1, 1, 870);
        data.setValue(1, 2, 1160);
        data.setValue(1, 3, 700);
        data.setValue(2, 0, 'Nov 8-Nov 15');
        data.setValue(2, 1, 1070);
        data.setValue(2, 2, 520);
        data.setValue(2, 3, 1220);



        var chart = new google.visualization.LineChart(document.getElementById('line_chart'));
        chart.draw(data, {width: 500, height: 115, titleY: "", titleX: "", legendBackgroundColor: '#F7F5F4', backgroundColor: '#F7F5F4'});
        console.log($('div#chartArea'));
        
$(document).ready(function()
{
        	
		});
        
	}


        	
        	
