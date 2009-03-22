// **************************************************************************
// Copyright 2008 Tavs Dokkedahl
// Contact: http://www.jslab.dk/contact.php
// More info: http://www.jslab.dk/tools.plot.php
//
// This file is part of the JSLab Plot Tool Program.
//
// The JSLab Plot Tool Program is NOT free software. You are free to look at
// how the program is created and be inspired but you are not allowed to copy
// or distribute any part of the source code.
// ***************************************************************************

/***************************************************
*
*  JSLab Plot Tool
*  
****************************************************/

// Namespace
if (!window.JSL)
  JSL = {};

JSL.Plot = {};

/***************************************************
*
*  JSLab Plot Options
*  
****************************************************/

JSL.Plot.OptDefault =
  {
    axisType: 'axisFitUniform',
    axisLength: 600,
    axisTicks: 50,
    axisTickFreq: 10,
    res: 500,
    color: '#00f',
    func: 'functionNormal'
  };

JSL.Plot.Opt = JSL.Plot.OptDefault;

JSL.Plot.setOptions =
  function() {
    var opt = {};
    // Get axis type
    if (document.getElementById('axisFitUniform').checked)
      opt.axisType = 'axisFitUniform';
    else if (document.getElementById('axisFit').checked)
      opt.axisType = 'axisFit';
    else if (document.getElementById('axisCenter').checked)
      opt.axisType = 'axisCenter';
    // Get axis length
    opt.axisLength = JSL.Plot.axisLength.value * 1;
    // Get number of ticks
    opt.axisTicks = JSL.Plot.axisTicks.value * 1;
    // Get tick frequency
    opt.axisTickFreq = JSL.Plot.axisTickFreq.value * 1;
    // Get resolution
    opt.res = JSL.Plot.graphRes.value * 1;
    // Get color
    opt.color = JSL.Plot.graphColor.value;
    // Get function type
    if (document.getElementById('functionNormal').checked) {
      opt.func = 'functionNormal';
      // Change function name
      JSL.Plot.eq.previousSibling.innerHTML = '&fnof;(x)';
      JSL.Plot.interval.previousSibling.innerHTML = 'x in';
    }
    else if (document.getElementById('functionParameter').checked) {
      opt.func = 'functionParameter';
      // Change function name
      JSL.Plot.eq.previousSibling.innerHTML = '&fnof;(t)';
      JSL.Plot.interval.previousSibling.innerHTML = 't in';
    }
    JSL.Plot.Opt = opt;
  };
  
JSL.Plot.getOptions =
  function(defaults) {
    var opt = defaults ? JSL.Plot.OptDefault : JSL.Plot.Opt;
    // Set axis type
    document.getElementById(opt.axisType).checked = true;
    // Set axis length
    JSL.Plot.axisLength.value = opt.axisLength;
    // Set number of ticks
    JSL.Plot.axisTicks.value = opt.axisTicks;
    // Set tick frequency
    JSL.Plot.axisTickFreq.value = opt.axisTickFreq;
    // Set resolution
    JSL.Plot.graphRes.value = opt.res;
    // Set color
    JSL.Plot.graphColor.value = opt.color;
    // Set function type
    document.getElementById(opt.func).checked = true;
  };

/***************************************************
*
*  JSLab Plot Create function and plot
*  
****************************************************/

JSL.Plot.create =
  function() {
    // If no input just return
    if (!JSL.Plot.eq.value)
      return;
    // Try to create function from equation
    try {
      if (JSL.Plot.Opt.func == 'functionNormal') {
        var f = JSL.Plot.createNormal(JSL.Plot.eq.value);
        // Any error in converting function to string is just a warning
        try {
          var info = '';
          var body = f.toString().match(/\{([\s\S]*)\}/m)[1];
          // IE and Opera do not terminate functions with semicolon so we have
          // to add a bogus trailing ;
          if (document.createEventObject || window.opera)
            body += ';_'
          body = body.split(/;/gm);
          var tmp;
          for(var i=0; i<body.length - 2; i++) {
            tmp = body[i].match(/var\s+([^=\s])+\s*=\s*(.*)/);
            info += tmp[1] + '=' + tmp[2] + ', ';
          }
          if (info)
            info = ' , ' + info.substring(0,info.length-2);
          info = 'Interpreted JavaScript function: y = ' + body[body.length-2].replace(/return\s*/,'') + info + ' ,  x in ';
        }
        catch(err) {
          info = 'JSL.Plot Warning: Failed to convert function to string: ' + err.message;
        }
      }
      else if (JSL.Plot.Opt.func == 'functionParameter') {
        var f = JSL.Plot.createParameter(JSL.Plot.eq.value);
        // Any error in converting function to string is just a warning
        try {
          var info = '';
          var body = f.toString().match(/\{([\s\S]*)\}/m)[1];
          body = body.split(/;/gm);
          var tmp;
          var body2 = '';
          for(var i=0; i<body.length - 2; i++) {
            tmp = body[i].match(/var\s+([^=\s])+\s*=\s*(.*)/);
            if (tmp[1] == 'y')
              body2 += tmp[2] + ')';
            else if (tmp[1] == 'x')
              body2 = '(' + tmp[2] + ' , ' + body2;
            else
              info += tmp[1] + '=' + tmp[2] + ', ';
          }
          if (info)
            info = ' , ' + info.substring(0,info.length-2);
          info = 'Interpreted JavaScript function: (x,y) = ' + body2 + info + ' ,  t in ';
        }
        catch(err) {
          info = 'JSL.Plot Warning: Failed to convert function to string: ' + err.message;
        }
      }
      // Try to evaluate function
      try {
        f(1);
      }
      catch(err) {
        throw new Error('JSL.Plot: Failed to evaluate function: ' + err.message);
      }
      // Get interval
      var tmp = JSL.Plot.interval.value;
      // Check interval
      if (!/^[^,]+,[^,]+$/.test(tmp))
        throw new Error('JSL.Plot: Interval must be two real values separated by a comma.');
      tmp = tmp.split(',');
      // Try to evaluate interval values
      try {
        var xa = eval(Math.Eval.replace(tmp[0]));
        var xb = eval(Math.Eval.replace(tmp[1]));
      }
      catch(err) {
        throw new Error('JSL.Plot: Failed to evaluate interval: ' + err.message);
      }
      // Swap values so ax is always < than xb
      if (xa == xb)
        throw new Error('JSL.Plot: Interval values must differ.');
      if (xa > xb) {
        tmp = xa;
        xa = xb;
        xb = tmp;
      }
      info += '[' + xa + ' ; ' + xb + ']';
    }
    catch(err) {
      if (!err.warning) {
        if (!/^JSL|Math/.test(err.message))
          err.message = 'Unrecoverable error: ' + err.message;
        JSL.Plot.info.innerHTML = err.message;
        return;
      }
      else
        JSL.Plot.info.innerHTML = err.message;
    }
    JSL.Plot.info.innerHTML = info;
    // Remove previous plot if it exist
    if (JSL.Plot.coord) {
      // Should be unnessesary with try
      try {
        if (JSL.Plot.coord.zoomBox) {
          document.body.removeChild(JSL.Plot.coord.zoomBox);
          JSL.Plot.coord.zoomBox = null;
        }
        document.body.removeChild(JSL.Plot.coord);
      }
      catch(err) {
      }
    }
    // Create a coordinate system
    // 0: x-position of coord.
    // 1: y-position of coord.
    // 2: length of axis
    // 3: Number of ticks for axis
    // 4: tick label frequency
    JSL.Plot.coord = Math.Coord(100, 150, JSL.Plot.Opt.axisLength, JSL.Plot.Opt.axisTicks, JSL.Plot.Opt.axisTickFreq);
    // Plot a graph f for x in [xa,xb]
    // 0: function to plot
    // 1: min of x
    // 2: max of x
    // 3: number of points
    // 4: how to draw plot
    if (JSL.Plot.Opt.func == 'functionNormal')
      JSL.Plot.coord.plot(f, xa, xb, JSL.Plot.Opt.res, JSL.Plot.Opt.axisType, JSL.Plot.Opt.color);
    else if (JSL.Plot.Opt.func == 'functionParameter')
      JSL.Plot.coord.plotParam(f, xa, xb, JSL.Plot.Opt.res, JSL.Plot.Opt.axisType, JSL.Plot.Opt.color);
    // Append coord to document
    document.body.appendChild(JSL.Plot.coord);
  };

JSL.Plot.createNormal =
  function(s) {
    // Strip whitespace and trailing ;
    s = s.replace(/\s+|;*$/g,'');
    s = s.replace(/return/g,'return ');
    // Take out variables
    var m = s.split(';')
    var v = '';
    for(var i=0; i<m.length-1; i++) {
      var tmp = m[i].split('=');
      v += 'var ' + tmp[0] + '=' + Math.Eval(tmp[1]) + ';';
    }
    s = Math.Eval(m[m.length-1]);
    // Try to create function
    try {
      var f = new Function('x', v + 'return ' + s);
    }
    catch(err) {
      throw new Error('JSL.Plot: Failed to create function: ' + err.message);
    }
    return f;
  };

JSL.Plot.createParameter =
  function(s) {
    // Strip whitespace and trailing ;
    s = s.replace(/\s+|;*$/g,'');
    s = s.replace(/return/g,'return ');
    // Take out variables
    var m = s.split(';')
    var v = '';
    for(var i=0; i<m.length; i++) {
      var tmp = m[i].split('=');
      v += 'var ' + tmp[0] + '=' + Math.Eval(tmp[1]) + ';';
    }
    // Try to create function
    try {
      var f = new Function('t', v + 'return {x:x,y:y};');
    }
    catch(err) {
      throw new Error('JSL.Plot: Failed to create function: ' + err.message);
    }
    return f;
  };

JSL.Plot.showHelp =
  function() {
    if (JSL.Plot.coord) {
      if (JSL.Plot.coord.zoomBox) {
        document.body.removeChild(JSL.Plot.coord.zoomBox);
        JSL.Plot.coord.zoomBox = null;
      }
      document.body.removeChild(JSL.Plot.coord);
      JSL.Plot.coord = null;
    }
    JSL.Plot.info.innerHTML = '<h2>Usage</h2><ul>' +
                          '<li>Enter a real valued function and click <strong>plot</strong> to create graph. Input is case-sensitive.<br />' +
                          'Ex. 2*sin(4*x)^(x+4)</li>' +
                          '<li>Separate statements with semicolon to use <strong>variables</strong><br />' +
                          'Ex. a = 4; a*sin(a*x)</li>' +
                          '<li>When using <strong>parameter</strong> equations enter expression for both x and y<br />' +
                          'Ex. y=sin(t); x=cos(t)</li>' +
                          '<li><strong>Interval</strong> may be expressions but must evaluate to real values.</li>' +
                          '<li>Switch between normal/parameter mode and control plot in the <strong>Options</strong> menu</li>' +
                          '<li>Hold and drag to <strong>zoom</strong> plot (currently not available in parameter mode). Move zoom to adjust area and double click to apply zoom.</li>' +
                          '<li>Click <strong>Create URL</strong> to save the current plot as an URL you can call from your own site.</li>' +
                          '<li>Recognised operators: ^, *, /, +, -<br />' +
                          'Recognised functions: abs, acos, asin, atan, atan2, cos, log, sin, tan, sqrt<br />' +
                          'Recognised constants: pi, e</li>' +
                          '<li>Available <strong>shortcuts</strong> are<br />Enter: Plot<br />Ctrl + Alt + o: Display options<br />Ctrl + Alt + c: Create URL<br />Ctrl + Alt + h: Display help</li>' +
                          '<li>Click <strong>Help</strong> to display this message again</li>' +
                          '<li>Please report errors at <a href="#" onclick="window.open(\'http://www.jslab.dk/contact.php\',\'\',\'\');">www.jslab.dk/contact.php</a></li>' +
                          '<li>Current version 1.0.0 beta. Tested in IE7, Firefox 3.0.3, Opera 9.51 and Safari 3.1.2 on Windows XP.</li></ul>';
  };

JSL.Plot.plotToUrl =
  function() {
    if (!JSL.Plot.eq.value)
      return;
    var eq = JSL.Plot.eq.value.replace(/\s+/g,'')
    eq = eq.replace(/=/g,'_EQ_');
    var inv = JSL.Plot.interval.value.replace(/\s+/g,'')
    inv = inv.replace(/=/g,'_EQ_');
    var q = 'eq=' + eq + '&' + 'interval=' + inv
    for(var p in JSL.Plot.Opt)
      q += '&' + p + '=' + JSL.Plot.Opt[p];
    q = '?' + encodeURIComponent(q);
    q = location.href.match(/[^\?]+/) + q;
    JSL.Plot.info.innerHTML = 'Direct URL for this plot:<br /><br /><input type="text" value="' + q + '" style="width: 98%;" />';
  };

/***************************************************
*
*  JSLab Plot Initiate program
*  
****************************************************/

JSL.Plot.main = 
  function(e) {
    /*** Create toolbar ***/
    JSL.Plot.toolbar = JSL.Toolbar('http://www.jslab.dk/tools.plot.php','JSLab Plot Tool');
    // Need to define the options bar here as we need a ref. in the toolbar
    JSL.Plot.options = JSL.Toolbar.Sidebar('Options', 200, 390);
    // Equation input
    JSL.Plot.eq = JSL.Toolbar.Input(600, 'left');
    var label = JSL.Toolbar.Label('&fnof;(x)', JSL.Plot.eq);
    JSL.Plot.toolbar.appendChild(label);
    JSL.Plot.toolbar.appendChild(JSL.Plot.eq);
    // Interval input
    JSL.Plot.interval = JSL.Toolbar.Input(40, 'right', '0,1');
    var label = JSL.Toolbar.Label('x in', JSL.Plot.interval);
    JSL.Plot.toolbar.appendChild(label);
    JSL.Plot.toolbar.appendChild(JSL.Plot.interval);
    JSL.Plot.toolbar.appendChild(JSL.Toolbar.VerticalSpace());
    JSL.Plot.toolbar.appendChild(JSL.Toolbar.HorisontalSpace());
    // Plot button
    var plot = JSL.Toolbar.Button('Plot', JSL.Plot.create);
    JSL.Plot.toolbar.addShortcut(plot, 'Enter', JSL.Plot.create, 13, false, false, false);
    JSL.Plot.toolbar.appendChild(plot);
    // Options button
    var options = JSL.Toolbar.Button('Options', function(){JSL.Plot.getOptions(); JSL.Plot.options.open();});
    JSL.Plot.toolbar.addShortcut(options, 'Ctrl + Alt + o', function(){JSL.Plot.getOptions(); JSL.Plot.options.open();} , 79, true, true, false);
    JSL.Plot.toolbar.appendChild(options);
    // Create URL button
    var url = JSL.Toolbar.Button('Create URL', JSL.Plot.plotToUrl);
    JSL.Plot.toolbar.addShortcut(url, 'Ctrl + Alt + c', JSL.Plot.plotToUrl , 67, true, true, false);
    JSL.Plot.toolbar.appendChild(url);
    // Help button
    //var help = JSL.Toolbar.Button('Help', function(){window.open('http://www.jslab.dk/tools.plot.php','','')});
    //JSL.Plot.toolbar.addShortcut(help, 'Ctrl + Alt + h', function(){window.open('http://www.jslab.dk/tools.plot.php','','')}, 72, true, true, false);
    var help = JSL.Toolbar.Button('Help', JSL.Plot.showHelp);
    JSL.Plot.toolbar.addShortcut(help, 'Ctrl + Alt + h', JSL.Plot.showHelp, 72, true, true, false);
    JSL.Plot.toolbar.appendChild(help);
    // Add toolbar to document
    document.body.appendChild(JSL.Plot.toolbar);
   
    /*** Create options sidebar ***/
    // If IE or Opera 1px, else 4px
    var radioStyle = document.createEventObject || window.opera ? 'style="margin: 1px 1px;"' : 'style="margin: 4px 4px;"'
    // Axis type options
    var axis = JSL.Toolbar.Fieldset('Axis Type');
    // Setting axis radio otions via innerHTML to avoid
    // buggy IE behavior
    axis.innerHTML += '<input type="radio" name="axis" id="axisFitUniform" checked="checked" ' + radioStyle + ' /> <label for="axisFitUniform">Uniform fit</label><br />' +
                      '<input type="radio" name="axis" id="axisFit" ' + radioStyle + ' /> <label for="axisFit">Non-uniform fit</label><br />' +
                      '<input type="radio" name="axis" id="axisCenter" ' + radioStyle + ' /> <label for="axisCenter">Center origo</label>';
    JSL.Plot.options.content.appendChild(axis);
    
    // Axis dimension options
    var axisDim = JSL.Toolbar.Fieldset('Axis Dimension');
    // Add grid
    axisDim.grid = JSL.Toolbar.Grid('60-l-m|40-l-m','60-l-m|40-l-m','60-l-m|40-l-m');
    axisDim.appendChild(axisDim.grid);
    // Axis length
    JSL.Plot.axisLength = JSL.Toolbar.Input(40, 'right');
    JSL.Plot.axisLength.onchange =
      function() {
        if (!/^\d+$/.test(this.value) || this.value * 1 < 100) {
          this.value = JSL.Plot.Opt.axisLength;
          alert('Axis length should be an integer greater than 99');
        }
      };
    var label = JSL.Toolbar.Label('Axis length (px)', JSL.Plot.axisLength);
    axisDim.grid.addToCell(0,0,label);
    axisDim.grid.addToCell(0,1,JSL.Plot.axisLength);
    // Number of ticks
    JSL.Plot.axisTicks = JSL.Toolbar.Input(40, 'right');
    JSL.Plot.axisTicks.onchange =
      function() {
        if (!/^\d+$/.test(this.value) || this.value * 1 > JSL.Plot.axisLength.value * 1 / 4) {
          this.value = JSL.Plot.Opt.axisTicks;
          alert('Number of ticks should be an integer no larger than 1/4 of axis length');
        }
      };
    var label = JSL.Toolbar.Label('Number of ticks', JSL.Plot.axisTicks);
    axisDim.grid.addToCell(1,0,label);
    axisDim.grid.addToCell(1,1,JSL.Plot.axisTicks);
    // Tick label freq.
    JSL.Plot.axisTickFreq = JSL.Toolbar.Input(40, 'right');
    JSL.Plot.axisTickFreq.onchange =
      function() {
        if (!/^\d+$/.test(this.value) || this.value * 1 > JSL.Plot.axisTicks.value * 1 / 4) {
          this.value = JSL.Plot.Opt.axisTickFreq;
          alert('Tick label frequency should be an integer no larger than 1/4 of number of ticks');
        }
      };
    var label = JSL.Toolbar.Label('Tick label frequency', JSL.Plot.axisTickFreq);
    axisDim.grid.addToCell(2,0,label);
    axisDim.grid.addToCell(2,1,JSL.Plot.axisTickFreq);
    JSL.Plot.options.content.appendChild(axisDim);
    
    // Graph options
    var graph = JSL.Toolbar.Fieldset('Graph');
    // Add grid
    graph.grid = JSL.Toolbar.Grid('60-l-m|40-l-m','60-l-m|40-l-m');
    graph.appendChild(graph.grid);
    // Graph resolution
    JSL.Plot.graphRes = JSL.Toolbar.Input(40, 'right');
    // Warn if setting resolution very high
    JSL.Plot.graphRes.onchange =
      function() {
        if (!/^\d+$/.test(this.value) || this.value * 1 < 100) {
          this.value = JSL.Plot.Opt.res;
          alert('Number of points should be an integer greater than 99.')
        }
        if (this.value * 1 > 1500)
          alert('Setting a very large number of points may vause your browser to crash.\n\nValues below 1500 should be safe.');
      };
    var label = JSL.Toolbar.Label('Number of points', JSL.Plot.graphRes);
    graph.grid.addToCell(0,0,label);
    graph.grid.addToCell(0,1,JSL.Plot.graphRes);
    // Graph color
    JSL.Plot.graphColor = JSL.Toolbar.Input(40, 'right');
    JSL.Plot.graphColor.onchange =
      function() {
        if (!/^#([\da-f]{3}|[\da-f]{6})$/.test(this.value)) {
          this.value = JSL.Plot.Opt.color;
          alert('Color should be a valid hex color. Either #xxx or #xxxxxx.');
        }
      };
    var label = JSL.Toolbar.Label('Color', JSL.Plot.graphColor);
    graph.grid.addToCell(1,0,label);
    graph.grid.addToCell(1,1,JSL.Plot.graphColor);
    JSL.Plot.options.content.appendChild(graph);
    
    // Function options
    var func = JSL.Toolbar.Fieldset('Function');
    func.innerHTML += '<input type="radio" name="function" id="functionNormal" checked="checked" ' + radioStyle + '" /> <label for="functionNormal">Normal equation y = &fnof;(x)</label><br />' +
                      '<input type="radio" name="function" id="functionParameter" ' + radioStyle + ' /> <label for="functionParameter">Parameter equation (x,y) = &fnof;(t)</label>';
    JSL.Plot.options.content.appendChild(func);
    
    // Ok, cancel, default buttons
    var hr = JSL.Toolbar.HorisontalSpace();
    hr.style.marginBottom = '4px';
    JSL.Plot.options.content.appendChild(hr);
    var ok = JSL.Toolbar.Button('Ok', function(){JSL.Plot.options.close(); JSL.Plot.setOptions();});
    JSL.Plot.options.content.appendChild(ok);
    var cancel = JSL.Toolbar.Button('Cancel', function(){JSL.Plot.options.close();});
    JSL.Plot.options.content.appendChild(cancel);
    var defaults = JSL.Toolbar.Button('Load defaults', function(){JSL.Plot.getOptions(true);});
    JSL.Plot.options.content.appendChild(defaults);
    
    // Add sidebar to document
    document.body.appendChild(JSL.Plot.options);
    
    // Info box
    JSL.Plot.info = document.createElement('div');
    JSL.Plot.info.style.padding = '4px';
    JSL.Plot.info.style.margin = '4px';
    JSL.Plot.info.style.border = '1px solid #000';
    JSL.Plot.info.style.background = '#f6fafd';
                              
    document.body.appendChild(JSL.Plot.info);
    // Start with help visible
    JSL.Plot.showHelp();
        
    // Start with fous in equation input
    JSL.Plot.eq.focus();
    
    // Check for query string for auto plot
    if (location.search) {
      JSL.Plot.Opt = {};
      for(var p in JSL.Plot.OptDefault)
        JSL.Plot.Opt[p] = JSL.Plot.OptDefault[p];
      var params = (decodeURIComponent(location.search.substring(1,location.search.length))).split('&');
      for(var i=0; i<params.length; i++) {
        var p = params[i].split('=');
        if (p[0] == 'eq' || p[0] == 'interval')
          JSL.Plot[p[0]].value = p[1].replace(/_EQ_/g,'=');
        else
          JSL.Plot.Opt[p[0]] = p[1]
      }
      // Do this to covert numeric values to numbers
      // and set all function values correctly
      JSL.Plot.getOptions();
      JSL.Plot.setOptions();
      JSL.Plot.create();
    }
  };

// Start on load
window.onload = JSL.Plot.main;