    
      // Load the Visualization API and the piechart package.
      google.load("visualization", "1", {packages:["piechart"]});
      
      // Set a callback to run when the API is loaded.
      google.setOnLoadCallback(drawChart);
      
  
      
      // Callback that creates and populates a data table, 
      // instantiates the pie chart, passes in the data and
      // draws it.
      function drawChart() {
        var data = new google.visualization.DataTable();
        data.addColumn('string', 'Task');
        data.addColumn('number', 'Hours per Day');
        data.addRows(5);
        data.setValue(0, 0, 'Smart Grid');
        data.setValue(0, 1, 11);
        data.setValue(1, 0, 'Green Computing');
        data.setValue(1, 1, 2);
        data.setValue(2, 0, 'Cogeneration');
        data.setValue(2, 1, 2);
        data.setValue(3, 0, 'Regulations');
        data.setValue(3, 1, 2);
        data.setValue(4, 0, 'Tax Policies');
        data.setValue(4, 1, 7);

        var chart = new google.visualization.PieChart(document.getElementById('chart_div'));
        chart.draw(data, {width: 510, height: 150, is3D: true, backgroundColor: '#F7F5F4', legendBackgroundColor: '#F7F5F4', title: ''});


      }

