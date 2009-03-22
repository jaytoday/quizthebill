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
*  Math.Coord - Plotting graphs
*  
****************************************************/

// Utility functions
Number.max =
  function() {
    var a = arguments;
    var l = a.length;
    var max = Number.NEGATIVE_INFINITY;
    for(var i=0; i<l; i++) {
      if (a[i] > max)
        max = a[i];
    }
    return max;
  };

Number.min =
  function() {
    var a = arguments;
    var l = a.length;
    var min = Number.POSITIVE_INFINITY;
    for(var i=0; i<l; i++) {
      if (a[i] < min)
        min = a[i];
    }
    return min;
  };

// Create a coordinate system
// px: x-position of coord.
// py: y-position of coord.
// l: length of axis
// tn: Number of ticks for axis
// tf: tick label frequency
Math.Coord =
  function(px,py,l,tn,tf) {
    // Container
    var coord = document.createElement('div');
    // Length of axis
    coord.axisLength = l;
    // Coord. absolute position relative to top/left corner
    coord.px = px;
    coord.py = py;
    // Number of ticks for each axis
    coord.tickNum = tn;
    // Tick label frequency
    coord.tickFreq = tf;
    // Position coord.
    coord.style.position = 'absolute';
    coord.style.left = px + 'px';
    coord.style.top = py + 'px';
    coord.style.width = l + 'px';
    coord.style.height = l + 'px';
    // We need a background for mousemove to fire - MS get yourself together...
    coord.style.background = '#fff';
    // Disable text selection
    coord.style.MozUserSelect = 'none';
    //coord.style.border = '1px solid #f00';
    // Create drawing canvas
    coord.canvas = document.createElement('div');
    coord.canvas.style.position = 'absolute';
    coord.canvas.style.left = 0;
    coord.canvas.style.top = 0;
    // All events happens on canvas so add zIndex
    coord.canvas.style.zIndex = 10;
    // Append canvas to coord
    coord.appendChild(coord.canvas)
    // Setup methods
    coord.clear = Math.Coord.clear;
    coord.plot = Math.Coord.plot;
    coord.plotParam = Math.Coord.plotParam;
    coord.c2p = Math.Coord.c2p;
    coord.p2c = Math.Coord.p2c;
    coord.drawFitUniformAxis = Math.Coord.drawFitUniformAxis;
    coord.drawFitAxis = Math.Coord.drawFitAxis;
    coord.drawCenterAxis = Math.Coord.drawCenterAxis;
    coord.drawX = Math.Coord.drawX;
    coord.drawY = Math.Coord.drawY;
    coord.drawPoints = Math.Coord.drawPoints;
    coord.drawLines = Math.Coord.drawLines;
    coord.createZoom = Math.Coord.createZoom
    return coord;
  };

// Convert from coord to point
Math.Coord.c2p =
  function(c) {
    var p = {};
    p.x = (c.x - this.origo.x) * (this.xb - this.xa) / (this.axisLength * this.scaleX);
    p.y = -1 * (c.y - this.origo.y) * (this.yb - this.ya) / (this.axisLength * this.scaleY);
    return p;
  };

// Convert from point to coord
Math.Coord.p2c =
  function(p) {
    var c = {};
    c.x = p.x * this.scaleX * this.axisLength / (this.xb - this.xa) + this.origo.x;
    c.y = -1 * p.y * this.scaleY * this.axisLength / (this.yb - this.ya) + this.origo.y;
    return c;
  };

Math.Coord.clear =
  function() {
    //this.removeChild(this.canvas);
    this.removeChild(this.xAxis);
    this.removeChild(this.yAxis);
  };

// Plot a graph f for x in [xa,xb]
// f: function to plot
// xa: min of x
// xb: max of x
// pNum: number of points
// plot: how to draw plot
Math.Coord.plot =
  function(f,xa,xb,pNum,plot,color) {
    // Function which we are plotting
    this.f = f;
    // Min. value of interval of x
    this.xa = xa;
    // Max. value of interval of x
    this.xb = xb;
    // Min. value of interval of y
    this.ya = Number.POSITIVE_INFINITY;
    // Max. value of interval of y
    this.yb = Number.NEGATIVE_INFINITY;
    // Number of points when drawing line
    this.pNum = pNum;
    // Plot type
    this.plotType = plot;
    // Color
    this.color = color;
    // Point values for graph
    this.points = [];
    // Calculate y values
    // Step size for x interval
    var step = (this.xa - this.xb) / this.pNum;
    var j = 0;
    for(var i=0; i<=this.pNum; i++) {
      // Create x point in interval [xa,xb]
      var x = this.xa + (this.xb - this.xa) * (i / this.pNum);
      // Get y value of f(x)
      var y = f(x);
      // If function is not defined for x ignore point
      if (isNaN(y))
        continue;
      // Else save point
      this.points[j] = {x:x, y:y};
      // Update min, max of y interval
      if (y < this.ya)
        this.ya = y;
      if (y > this.yb)
        this.yb = y;
      j++;
    }
    // Find origo. We can't use coord<->point conversion before axis
    // have been drawn so we are basing calculations on percentages
    this.origo = {};
    // Find origo.x from position of 0 in interval x
    this.origo.x = this.axisLength * (0 - this.xa) / (this.xb - this.xa);
    // Find origo.y from position of 0 in interval y
    this.origo.y = this.axisLength - this.axisLength * (0 - this.ya) / (this.yb - this.ya);
    // Draw axis
    switch(this.plotType) {
      case 'axisFit':
        this.drawFitAxis();
        break;
      case 'axisFitUniform':
        this.drawFitUniformAxis();
        break;
      case 'axisCenter':
        this.drawCenterAxis();
        break;
      default:
        this.drawFitUniformAxis();
        break;
    }
    // Plot points
    this.drawPoints(this.color);
    // Set lines
    this.drawLines();
    // Setup event handlers
    this.onmousemove = Math.Coord.moveLines;
    this.onmousedown = Math.Coord.startListenZoom;
  };

Math.Coord.plotParam =
  function(f,ta,tb,pNum,plot,color) {
    // Function which we are plotting
    this.f = f;
    // Min. value of t
    this.ta = ta;
    // Max. value of t
    this.tb = tb;
    // Min. value of interval of x
    this.xa = Number.POSITIVE_INFINITY;
    // Max. value of interval of x
    this.xb = Number.NEGATIVE_INFINITY;
    // Min. value of interval of y
    this.ya = Number.POSITIVE_INFINITY;
    // Max. value of interval of y
    this.yb = Number.NEGATIVE_INFINITY;
    // Number of points when drawing line
    this.pNum = pNum;
    // Plot type
    this.plotType = plot;
    // Color
    this.color = color;
    // Point values for graph
    this.points = [];
    // Calculate y values
    // Step size for x interval
    var step = (this.ta - this.tb) / this.pNum;
    var j = 0;
    for(var i=0; i<=this.pNum; i++) {
      // Create x point in interval [xa,xb]
      var t = this.ta + (this.tb - this.ta) * (i / this.pNum);
      // Get p point of f(t)
      var p = f(t);
      // If function is not defined for t ignore point
      if (isNaN(p.x) || isNaN(p.y))
        continue;
      // Else save point
      this.points[j] = p;
      // Update min, max of x interval
      if (p.x < this.xa)
        this.xa = p.x;
      if (p.x > this.xb)
        this.xb = p.x;
      // Update min, max of y interval
      if (p.y < this.ya)
        this.ya = p.y;
      if (p.y > this.yb)
        this.yb = p.y;
      j++;
    }
    // Find origo. We can't use coord<->point conversion before axis
    // have been drawn so we are basing calculations on percentages
    this.origo = {};
    // Find origo.x from position of 0 in interval x
    this.origo.x = this.axisLength * (0 - this.xa) / (this.xb - this.xa);
    // Find origo.y from position of 0 in interval y
    this.origo.y = this.axisLength - this.axisLength * (0 - this.ya) / (this.yb - this.ya);
    // Draw axis
    switch(this.plotType) {
      case 'axisFit':
        this.drawFitAxis();
        break;
      case 'axisFitUniform':
        this.drawFitUniformAxis();
        break;
      case 'axisCenter':
        this.drawCenterAxis();
        break;
      default:
        this.drawFitUniformAxis();
        break;
    }
    // Plot points
    this.drawPoints(this.color);
    // Set lines
    //this.drawLines();
    // Setup event handlers
    //this.onmousemove = Math.Coord.moveLines;
    this.onmousedown = Math.Coord.startListenZoom;
  };

// Fit uniform axis to dataset
Math.Coord.drawFitUniformAxis =
  function() {
    // If a interval is largest then fit y to x    
    if ((this.xb - this.xa) >= (this.yb - this.ya)) {
      // Find interval for y based on x and scale to x
      this.scaleY = (this.yb - this.ya) / (this.xb - this.xa);
      // Length to add to top and bottom of y-axis
      var tmp = (this.yb - this.ya) * (1 - this.scaleY) / (2 * this.scaleY);
      var ya = this.ya - tmp
      var yb = this.yb + tmp;
      // Recalibrate origo based on new scale
      this.origo.y = this.axisLength - this.axisLength * (0 - ya) / (yb - ya);
      this.drawY(ya, yb);
      this.drawX(this.xa, this.xb);
      this.scaleX = 1;
    }
    // else y interval is largest and we must scale x to fit y
    else {
      // Find interval for x based on y and scale to y
      this.scaleX = (this.xb - this.xa) / (this.yb - this.ya);
      // Length to add to left and right of x-axis
      var tmp = (this.xb - this.xa) * (1 - this.scaleX) / (2 * this.scaleX);
      var xa = this.xa - tmp
      var xb = this.xb + tmp;
      // Recalibrate origo based on new scale
      this.origo.x = this.axisLength * (0 - xa) / (xb - xa);
      this.drawX(xa, xb);
      this.drawY(this.ya, this.yb);
      this.scaleY = 1;
    }
  };

// Fit non-uniform axis to dataset
Math.Coord.drawFitAxis =
  function() {
    // Draw x-axis
    this.drawX(this.xa, this.xb);
    // Draw y-axis
    this.drawY(this.ya, this.yb);
    // No scaling for fit plot
    this.scaleX = 1;
    this.scaleY = 1;
  };

// Always center origo
Math.Coord.drawCenterAxis =
  function() {
    // Get longest distance from origo
    var d = Number.max(Math.abs(this.xa), Math.abs(this.xb), Math.abs(this.ya), Math.abs(this.yb));
    // Scale both x and y
    this.scaleX = (this.xb - this.xa) / (2 * d);
    this.scaleY = (this.yb - this.ya) / (2 * d);
    // Scale axis length for auto plot
    var tmp = this.axisLength / 2
    // Origo is centered for auto plot
    this.origo = {x:tmp, y:tmp};
    // Draw x-axis
    this.drawX(-d, d);
    // Draw y-axis
    this.drawY(-d, d);
  };

// Draw x-axis
// d is distance from origo relative to coord -
// that is end displayed end value
Math.Coord.drawX =
  function(xa, xb) {
    // x-axis is positioned relative to coord. container
    this.xAxis = document.createElement('div');
    this.xAxis.style.position = 'absolute';
    this.xAxis.style.borderBottom = '1px solid #000';
    // Height is always 2
    this.xAxis.style.height = '2px';
    // Width is determined by function drawing plot
    this.xAxis.style.width = this.axisLength + 1 + 'px';
    // Offset position
    this.xAxis.style.left = '0px';
    // If origo-y is with plot container
    if (0 <= this.origo.y && this.origo.y <= this.axisLength)
      this.xAxis.style.top = this.origo.y - 2 + 'px';
    // if origo.y is less than 0 place x.axis at top
    else if (this.origo.y < 0)
      this.xAxis.style.top = '-2px';
    // else place at bottom
    else
      this.xAxis.style.top = this.axisLength - 2 + 'px';
    this.appendChild(this.xAxis);
    // Distance between ticks
    var td = this.axisLength / this.tickNum;
    // Create label for tick every tm tick
    var tm = Math.floor(this.tickNum / this.tickFreq);
    // Draw ticks for x-axis in interval [xa, xb]
    for(var i=0; i<=this.tickNum; i++) {
      // x-tick
      var xtick = document.createElement('div');
      xtick.style.height = '5px';
      xtick.style.cssFloat = 'left';
      xtick.style.styleFloat = 'left';
      xtick.style.width = '1px';
      //xtick.style.background = 'url(../gfx/x_tick.gif) repeat-y';
      xtick.style.background = '#000';
      xtick.style.marginRight = td - 1 + 'px';
      this.xAxis.appendChild(xtick);
      // If label on tick
      if (i % tm == 0) {
        var txt = (i / this.tickNum) * (xb - xa) + xa;
        // Never plot 0,0
        if (txt == 0)
          continue;
        // x-tick label position
        xtick.style.position = 'relative';
        // Slightly bigger tick
        xtick.style.height = '9px';
        xtick.style.top = '-2px';
        // x-tick text node contianer
        var con = document.createElement('div');
        con.appendChild(document.createTextNode(txt.toFixed(2)));
        con.style.position = 'relative';
        con.style.whiteSpace = 'noWrap';
        if (txt < 0)
          con.style.left = '-12px';
        else
          con.style.left = '-7px';
        con.style.top = '9px';
        xtick.appendChild(con);
      }
    }
    // Reset margin for last tick to avoid jumping lines
    xtick.style.marginRight = 0;
  };

// Draw y-axis
Math.Coord.drawY =
  function(ya, yb) {
    // x-axis is positioned relative to coord. container
    this.yAxis = document.createElement('div');
    this.yAxis.style.position = 'absolute';
    this.yAxis.style.borderLeft = '1px solid #000';
    // Width is always 2
    this.yAxis.style.width = '2px';
    // Height is determined by function drawing plot
    this.yAxis.style.height = this.axisLength + 'px';
    // Offset position
      this.yAxis.style.top = '0px';
    // If origo.x is within plot container
    if (0 <= this.origo.x && this.origo.x <= this.axisLength)
      this.yAxis.style.left = this.origo.x + 'px';
    // if origo.x is less than 0 place y-axis at left
    else if (this.origo.x < 0)
      this.yAxis.style.left = '0px';
    // else place at right
    else
      this.yAxis.style.left = this.axisLength + 'px';
    this.appendChild(this.yAxis);
    // Distance between ticks
    var td = this.axisLength / this.tickNum;
    // Create label for tick every tm tick
    var tm = Math.floor(this.tickNum / this.tickFreq);
    // Draw ticks for x-axis in interval [xa, xb]
    for(var i=0; i<=this.tickNum; i++) {
      // y-tick
      var ytick = document.createElement('div');
      //ytick.style.background = 'url(../gfx/y_tick.gif) repeat-x';
      ytick.style.position = 'relative';
      ytick.style.left = '-3px';
      ytick.style.background = '#000';
      ytick.style.width = '5px';
      ytick.style.height = '1px';
      ytick.style.marginBottom = td - 1 + 'px';
      this.yAxis.appendChild(ytick);
      if (i % tm == 0) {
        var txt = ((i / this.tickNum) * (ya - yb) + yb).toFixed(2);
        // Never plot 0,0
        if (txt == 0)
          continue;
        // y-tick label position
        ytick.style.width = '9px';
        ytick.style.left = '-5px';
        // y-tick text node contianer
        var con = document.createElement('div');
        con.appendChild(document.createTextNode(txt));
        con.style.whiteSpace = 'noWrap';
        con.style.position = 'relative';
        con.style.left = '-26px';
        con.style.top = '-7px';
        ytick.appendChild(con);
      }
    }
  };

Math.Coord.drawPoints =
  function(color){
    // Clear canvas
    this.canvas.innerHTML = '';
    // For each point
    var l = this.points.length;
    //l = 1;
    for(var i=0; i<l; i++) {
      //alert(this.points[i].x + ',' + this.points[i].y);
      var c = this.p2c(this.points[i]);
      //alert(c.x + ',' + c.y);
      // Points are positioned realtive to coord
      var pDiv = document.createElement('div');
      pDiv.style.position = 'absolute';
      pDiv.style.width = '1px';
      pDiv.style.height = '1px';
      pDiv.style.background = color;
      pDiv.style.left = c.x + 'px';
      pDiv.style.top = c.y + 'px';
      this.canvas.appendChild(pDiv);
    }
  };

Math.Coord.drawLines =
  function() {
    /*
    // Debug box
    this.box = document.createElement('div');
    this.box.style.position = 'absolute';
    this.box.style.left = 0;
    this.box.style.top = '200px';
    this.box.style.padding = '4px';
    this.box.style.border = '1px solid #000';
    this.box.appendChild(document.createTextNode('x,y'));
    this.appendChild(this.box);
    */
    // x-line
    this.xLine = document.createElement('div');
    this.xLine.style.width = '1px';
    this.xLine.style.background = '#ddd';
    this.xLine.style.position = 'absolute';
    this.appendChild(this.xLine);
    // y-line
    this.yLine = document.createElement('div');
    this.yLine.style.height = '1px';
    this.yLine.style.background = '#ddd';
    this.yLine.style.position = 'absolute';
    this.appendChild(this.yLine);
    // f-line
    this.fLine = document.createElement('div');
    this.fLine.style.height = '1px';
    this.fLine.style.background = '#0af';
    this.fLine.style.position = 'absolute';
    this.appendChild(this.fLine);
    // f-box
    this.fBox = document.createElement('div');
    this.fBox.style.position = 'absolute';
    this.fBox.style.background = '#fff';
    this.fBox.style.padding = '4px';
    this.fBox.style.zIndex = 20;
    this.fBox.style.border = '1px solid #000';
    // Place f-box at (this.xa,f(this.xa))
    var p = {x:this.xa,y:this.f(this.xa)};
    var c = this.p2c(p);
    this.fBox.style.left = c.x + 'px';
    this.fBox.style.top = c.y + 'px';
    this.appendChild(this.fBox);
    // Point box
    this.pBox = document.createElement('div');
    this.pBox.style.position = 'absolute';
    this.pBox.style.background = '#fff';
    this.pBox.style.padding = '4px';
    this.pBox.style.zIndex = 19;
    this.pBox.style.border = '1px solid #000';
    this.appendChild(this.pBox);
  };

// Mousemove on coord.
Math.Coord.moveLines =
  function(e) {
    // If IE
    if (!e)
      e = event;
    // Screen coords. adjusted for position of coord. system and scroll
    var c = {x:e.clientX - this.px + document.documentElement.scrollLeft, y:e.clientY - this.py + document.documentElement.scrollTop};
    // Point coords. relative to origo of coord system
    var p = this.c2p(c);
    // Keep x within bounds
    /*
    if (p.x < this.xa)
      p.x = this.xa;
    else if (p.x > this.xb)
      p.x = this.xb;
    */
    // If origo is not in graph we need to adjust lines
    var ox, oy;
    if (this.origo.x < 0)
      ox = 0;
    else if (this.origo.x > this.axisLength)
      ox = this.axisLength;
    else
      ox = this.origo.x;
    if (this.origo.y < 0)
      oy = 0;
    else if (this.origo.y > this.axisLength)
      oy = this.axisLength;
    else
      oy = this.origo.y;
    /** Update f box and line **/
    /*
    if (this.xa <= p.x && p.x <= this.xb) {
      // Get f(x)
      var y = this.f(p.x);
      // We need these coords. to place fBox correctly
      var fx = this.p2c({x:p.x,y:y});
      this.fLine.style.top = fx.y + 'px';
      this.fBox.style.top = fx.y - 10 + 'px';
      // If right of y-axis
      if (p.x >= 0) {
        this.fLine.style.left = this.origo.x + 'px';
        this.fLine.style.width = fx.x - this.origo.x + 'px';
        // Update f box
        this.fBox.style.left = this.origo.x - 112 + 'px';
      }
      // else left of y-axis
      else {
        this.fLine.style.left = fx.x + 'px';
        this.fLine.style.width = this.origo.x - fx.x + 'px';
        this.fBox.style.left = this.origo.x + 10 + 'px';
      }
      // Update content of f-box
      this.fBox.innerHTML = '&fnof;(' + (p.x.toFixed(4)) + ') = ' + (y.toFixed(4));
    }
    */
    /** x and y lines **/
    /*
    // We need a little offset from cursor to register mousedown correctly
    // otherwise mousedown occurs on lines not coord. system
    var cursorOffset = 5;
    this.xLine.style.left = c.x + 'px';
    this.yLine.style.top = c.y + 'px';
    if (p.y >= 0) {
      this.xLine.style.top = c.y + cursorOffset + 'px';
      this.xLine.style.height = this.origo.y - c.y - cursorOffset + 'px';
      this.pBox.style.top = c.y + 10 + 'px';
    }
    else {
      this.xLine.style.top = this.origo.y + 'px';
      this.xLine.style.height = c.y - cursorOffset - this.origo.y + 'px';
      this.pBox.style.top = c.y - 30 + 'px';
    }
    if (p.x >= 0) {
      this.yLine.style.left = this.origo.x + 'px';
      this.yLine.style.width = c.x - cursorOffset - this.origo.x + 'px';
      this.pBox.style.left = c.x - 140 + 'px';
    }
    else {
      this.yLine.style.left = c.x + cursorOffset + 'px';
      this.yLine.style.width = this.origo.x - c.x - cursorOffset + 'px';
      this.pBox.style.left = c.x + 10 + 'px';
    }
    */
    /** Update f box and line **/
    if (this.xa <= p.x && p.x <= this.xb) {
      // Get f(x)
      var y = this.f(p.x);
      // We need these coords. to place fBox correctly
      var fx = this.p2c({x:p.x,y:y});
      this.fLine.style.top = fx.y + 'px';
      this.fBox.style.top = fx.y - 10 + 'px';
      // If right of y-axis
      if (p.x >= 0) {
        this.fLine.style.left = ox + 'px';
        this.fLine.style.width = fx.x - ox + 'px';
        // Update f box
        this.fBox.style.left = ox - 112 + 'px';
      }
      // else left of y-axis
      else {
        this.fLine.style.left = fx.x + 'px';
        this.fLine.style.width = ox - fx.x + 'px';
        this.fBox.style.left = ox + 10 + 'px';
      }
      // Update content of f-box
      this.fBox.innerHTML = '&fnof;(' + (p.x.toFixed(4)) + ') = ' + (y.toFixed(4));
    }
    /** x and y lines **/
    // We need a little offset from cursor to register mousedown correctly
    // otherwise mousedown occurs on lines not coord. system
    var cursorOffset = 5;
    this.xLine.style.left = c.x + 'px';
    this.yLine.style.top = c.y + 'px';
    if (p.y >= 0) {
      this.xLine.style.top = c.y + cursorOffset + 'px';
      this.xLine.style.height = (oy - c.y - cursorOffset) < 0 ? 0 : oy - c.y - cursorOffset + 'px';
      this.pBox.style.top = c.y + 10 + 'px';
    }
    else {
      this.xLine.style.top = oy + 'px';
      this.xLine.style.height = (c.y - cursorOffset - oy) < 0 ? 0 : c.y - cursorOffset - oy + 'px';
      this.pBox.style.top = c.y - 30 + 'px';
    }
    if (p.x >= 0) {
      this.yLine.style.left = ox + 'px';
      this.yLine.style.width = (c.x - cursorOffset - ox) < 0 ? 0 : c.x - cursorOffset - ox + 'px';
      this.pBox.style.left = c.x - 140 + 'px';
    }
    else {
      this.yLine.style.left = c.x + cursorOffset + 'px';
      this.yLine.style.width = (ox - c.x - cursorOffset) < 0 ? 0 : ox - c.x - cursorOffset + 'px';
      this.pBox.style.left = c.x + 10 + 'px';
    }
    // Update point box
    this.pBox.innerHTML = '(x,y) = (' + (p.x.toFixed(4)) + ',' + (p.y.toFixed(4)) + ')';
    // If we are listening for starting zoom
    if (this.listenZoomC) {
      // If moving more than this.listenZoomT px away from point at mousedown
      if (c.x + this.listenZoomT < this.listenZoomC.x || this.listenZoomC.x < c.x - this.listenZoomT || c.y + this.listenZoomT < this.listenZoomC.y || this.listenZoomC.y < c.y - this.listenZoomT) {
        // Initialize zzom box
        Math.Coord.startZoom.call(this, e);
        // Resize zoom box on mousemove
        this.onmousemove = Math.Coord.doZoom;
        // Stop zoom on next mouseup
        this.onmouseup = Math.Coord.stopZoom;
      }
    }
  };

// Listen for mouse movement within 5 px threshold
Math.Coord.startListenZoom =
  function(e) {
    if (!e)
      e = event;
    this.listenZoomC = {x:e.clientX - this.px + document.documentElement.scrollLeft, y:e.clientY - this.py + document.documentElement.scrollTop};
    // Threshold
    this.listenZoomT = 5;
    this.onmousedown = null;
    this.onmouseup = Math.Coord.stopListenZoom;
  };

// When mouseup without moving mouse out of threshold
Math.Coord.stopListenZoom =
  function(e) {
    if (!e)
      e = event;
    this.listenZoomC = null;
    this.onmouseup = null;
    this.onmousedown = Math.Coord.startListenZoom;
  };

// Start and do the zoom
Math.Coord.startZoom =
  function(e) {
    if (!e)
      e = event;
    // Create zoombox
    this.zoom = document.createElement('div');
    // Sucky IE way of opacity
    if (document.createEventObject)
      this.zoom.style.filter = 'progid:DXImageTransform.Microsoft.Alpha(opacity=20)';
    else
      this.zoom.style.opacity = 0.20;
    // Style for zoom box
    this.zoom.style.border = '1px solid #000';
    this.zoom.style.background = '#0af';
    this.zoom.style.position = 'absolute';
    this.zoom.style.zIndex = 30;
    // Initial coords for mousedown when zooming started
    this.appendChild(this.zoom);
    // Remove lines when zooming
    this.removeChild(this.xLine);
    this.removeChild(this.yLine);
    this.removeChild(this.fLine);
    // Use fbox for zoom box
    this.fBox.style.left = this.listenZoomC.x - 140 + 'px';
    this.fBox.style.top = parseFloat(this.pBox.style.top) - 44 + 'px';
    var p = this.c2p(this.listenZoomC);
    this.fBox.innerHTML = '(x,y) = (' + p.x.toFixed(4) + ', ' + p.y.toFixed(4) + ')';
  };

// Resize zoom box
Math.Coord.doZoom =
  function(e) {
    if (!e)
      e = event;
    // Screen coords. adjusted for position of coord. system and scroll
    var c = {x:e.clientX - this.px + document.documentElement.scrollLeft, y:e.clientY - this.py + document.documentElement.scrollTop};
    // If moving out of canvas just return
    if (c.x <= 0 || this.axisLength <= c.x || c.y <= 0 || this.axisLength <= c.y)
      return;
    var p = this.c2p(c);
    // Points for insertion in text boxes
    var fPoint = {};
    var pPoint = {};
    // If x is moving left
    if (c.x < this.listenZoomC.x) {
      this.zoom.style.left = c.x + 'px';
      this.zoom.style.width = this.listenZoomC.x - c.x + 'px';
      // Keep f-box in coord. canvas
      /*
      if (c.x - 140 <= 0)
        this.fBox.style.left = '0px';
      else
        this.fBox.style.left = c.x - 140 + 'px';
      */
      this.fBox.style.left = c.x - 140 + 'px';
      fPoint.x = c.x;
      pPoint.x = this.listenZoomC.x;
    }
    // x is moving right
    else {
      this.zoom.style.left = this.listenZoomC.x + 'px';
      this.zoom.style.width = c.x - this.listenZoomC.x + 'px';
      this.pBox.style.left = c.x + 10 + 'px';
      fPoint.x = this.listenZoomC.x;
      pPoint.x = c.x;
    }
    // If y is moving up
    if (c.y < this.listenZoomC.y) {
      this.zoom.style.top = c.y + 'px';
      this.zoom.style.height = this.listenZoomC.y - c.y + 'px';
      this.fBox.style.top = c.y - 30 + 'px';
      fPoint.y = c.y;
      pPoint.y = this.listenZoomC.y;
    }
    // y is moving down
    else {
      this.zoom.style.top = this.listenZoomC.y + 'px';
      this.zoom.style.height = c.y - this.listenZoomC.y + 'px';
      this.pBox.style.top = c.y + 10 + 'px';
      fPoint.y = this.listenZoomC.y;
      pPoint.y = c.y;
    }
    fPoint = this.c2p(fPoint);
    pPoint = this.c2p(pPoint);
    this.fBox.innerHTML = '(x,y) = (' + fPoint.x.toFixed(4) + ', ' + fPoint.y.toFixed(4) + ')';
    this.pBox.innerHTML = '(x,y) = (' + pPoint.x.toFixed(4) + ', ' + pPoint.y.toFixed(4) + ')';
  };

Math.Coord.stopZoom =
  function(e) {
    if (!e)
      e = event;
    this.onmouseup = null;
    this.onmousemove = null;
    this.zoom.style.cursor = 'pointer';
    // Initiate drag on mousedown
    this.zoom.onmousedown =
      function(e) {
        if (!e)
          e = event;
        this.moveZoom = {x:e.clientX - this.parentNode.px + document.documentElement.scrollLeft, y:e.clientY - this.parentNode.py + document.documentElement.scrollTop};
        this.onmousemove = Math.Coord.moveZoom;
      };
    // Stop drag on mouseup
    this.zoom.onmouseup =
      function(e) {
        if (!e)
          e = event;
        this.moveZoom = null;
        this.onmousemove = null;
      };
    // Do zoom on double click
    // We don't need to reset anything as the current plot is destroyed
    this.zoom.ondblclick =
      function(e) {
        if (!e)
          e = event;
        this.parentNode.createZoom(e);
      };
  };

// 'this' is coord.zoom
Math.Coord.moveZoom =
  function(e) {
    if (!e)
      e = event;
    var coord = this.parentNode;
    var c = {x:e.clientX - coord.px + document.documentElement.scrollLeft, y:e.clientY - coord.py + document.documentElement.scrollTop};
    coord.listenZoomC.x += c.x - this.moveZoom.x;
    coord.listenZoomC.y += c.y - this.moveZoom.y;
    this.moveZoom.x = c.x;
    this.moveZoom.y = c.y;
    // Keep within canvas
    if (coord.listenZoomC.x < 0)
      coord.listenZoomC.x = 0;
    else if (coord.listenZoomC.x + this.offsetWidth > coord.axisLength)
      coord.listenZoomC.x = coord.axisLength - this.offsetWidth;
    if (coord.listenZoomC.y < 0)
      coord.listenZoomC.y = 0;
    else if (coord.listenZoomC.y + this.offsetHeight > coord.axisLength)
      coord.listenZoomC.y = coord.axisLength - this.offsetHeight;
    this.style.left = coord.listenZoomC.x + 'px';
    this.style.top = coord.listenZoomC.y + 'px';
  };

Math.Coord.zoomout =
  function(e) {
    
  };

// Stepwise zoom
Math.Coord.createZoom =
  function(e) {
    if (this.zoomBox)
      this.parentNode.removeChild(this.zoomBox);
    // Create minature of current plot
    var axisLength = 200;
    this.zoomBox = Math.Coord(this.px + this.axisLength + 50, this.py, axisLength, 4, 2);
    this.zoomBox.plot(this.f, this.xa, this.xb, 100, this.plotType);
    this.zoomBox.removeChild(this.zoomBox.fBox);
    this.zoomBox.removeChild(this.zoomBox.pBox);
    this.zoomBox.removeChild(this.zoomBox.xLine);
    this.zoomBox.removeChild(this.zoomBox.yLine);
    this.zoomBox.removeChild(this.zoomBox.fLine);
    this.zoomBox.onmousemove = null;
    this.zoomBox.onmousedown = null;
    this.zoomBox.zoom = document.createElement('div');
    if (document.createEventObject)
      this.zoomBox.zoom.style.filter = 'progid:DXImageTransform.Microsoft.Alpha(opacity=20)';
    else
      this.zoomBox.zoom.style.opacity = 0.20;
    this.zoomBox.zoom.style.border = '1px solid #000';
    this.zoomBox.zoom.style.background = '#0af';
    this.zoomBox.zoom.style.position = 'absolute';
    this.zoomBox.zoom.style.cursor = 'pointer';
    this.zoomBox.zoom.style.zIndex = 30;
    this.zoomBox.zoom.style.left = parseFloat(this.zoom.style.left) * axisLength / this.axisLength + 'px';
    this.zoomBox.zoom.style.top = parseFloat(this.zoom.style.top) * axisLength / this.axisLength + 'px';
    this.zoomBox.zoom.style.width = this.zoom.offsetWidth * axisLength / this.axisLength + 'px';
    this.zoomBox.zoom.style.height = this.zoom.offsetHeight * axisLength / this.axisLength + 'px';
    this.zoomBox.appendChild(this.zoomBox.zoom);
    this.parentNode.appendChild(this.zoomBox);
    var p1 = this.c2p(this.listenZoomC);
    var c2 = {x:this.listenZoomC.x + this.zoom.offsetWidth, y:this.listenZoomC.y + this.zoom.offsetHeight};
    var p2 = this.c2p(c2);
    // Reset
    this.removeChild(this.xAxis);
    this.removeChild(this.yAxis);
    this.removeChild(this.fBox);
    this.removeChild(this.pBox);
    this.removeChild(this.zoom);
    this.zoom = null;
    this.listenZoomC = null;
    this.onmousemove = null;
    this.onmousedown = null;
    this.onmouseup = null;
    this.plot(this.f, p1.x, p2.x, this.pNum, this.plotType);
  };

// Unreal zoom
Math.Coord.createZoom =
  function(e) {
    var p1 = this.c2p(this.listenZoomC);
    var c2 = {x:this.listenZoomC.x + this.zoom.offsetWidth, y:this.listenZoomC.y + this.zoom.offsetHeight};
    var p2 = this.c2p(c2);
    if (!this.zoomBox) {
      // Create minature of current plot
      var axisLength = 200;
      this.zoomBox = Math.Coord(this.px + this.axisLength + 50, this.py, axisLength, 4, 2);
      this.zoomBox.plot(this.f, this.xa, this.xb, 100, this.plotType);
      this.zoomBox.removeChild(this.zoomBox.fBox);
      this.zoomBox.removeChild(this.zoomBox.pBox);
      this.zoomBox.removeChild(this.zoomBox.xLine);
      this.zoomBox.removeChild(this.zoomBox.yLine);
      this.zoomBox.removeChild(this.zoomBox.fLine);
      this.zoomBox.onmousemove = null;
      this.zoomBox.onmousedown = null;
      this.zoomBox.zoom = document.createElement('div');
      if (document.createEventObject)
        this.zoomBox.zoom.style.filter = 'progid:DXImageTransform.Microsoft.Alpha(opacity=20)';
      else
        this.zoomBox.zoom.style.opacity = 0.20;
      this.zoomBox.zoom.style.border = '1px solid #000';
      this.zoomBox.zoom.style.background = '#0af';
      this.zoomBox.zoom.style.position = 'absolute';
      this.zoomBox.zoom.style.cursor = 'pointer';
      this.zoomBox.zoom.style.zIndex = 30;
      this.zoomBox.scale = axisLength / this.axisLength;
      // Get coords. and dimensions of zoom area in zoombox
      var c1 = this.zoomBox.p2c(p1);
      var c2 = this.zoomBox.p2c(p2);
      var w = c2.x - c1.x;
      var h = c2.y - c1.y;
      this.zoomBox.zoom.style.left = c1.x + 'px';
      this.zoomBox.zoom.style.top = c1.y + 'px';
      this.zoomBox.zoom.style.width = w + 'px';
      this.zoomBox.zoom.style.height = h + 'px';
      this.zoomBox.appendChild(this.zoomBox.zoom);
      this.parentNode.appendChild(this.zoomBox);
    }
    else {
      // Resize and position zoombox again
      var c1 = this.zoomBox.p2c(p1);
      var c2 = this.zoomBox.p2c(p2);
      var w = c2.x - c1.x;
      var h = c2.y - c1.y;
      this.zoomBox.zoom.style.left = c1.x + 'px';
      this.zoomBox.zoom.style.top = c1.y + 'px';
      this.zoomBox.zoom.style.width = w + 'px';
      this.zoomBox.zoom.style.height = h + 'px';
    }
    // Reset
    this.removeChild(this.xAxis);
    this.removeChild(this.yAxis);
    this.removeChild(this.fBox);
    this.removeChild(this.pBox);
    this.removeChild(this.zoom);
    this.listenZoomC = null;
    this.onmousemove = null;
    this.onmousedown = null;
    this.onmouseup = null;
    this.plot(this.f, p1.x, p2.x, this.pNum, this.plotType);
    this.zoom = null;
  };

// Real zoom - best candidate for fitUniform plot
Math.Coord.createZoom =
  function(e) {
    var p1 = this.c2p(this.listenZoomC);
    var c2 = {x:this.listenZoomC.x + this.zoom.offsetWidth, y:this.listenZoomC.y + this.zoom.offsetHeight};
    var p2 = this.c2p(c2);
    var xa = this.xa;
    var xb = this.xb;
    // Reset
    this.removeChild(this.xAxis);
    this.removeChild(this.yAxis);
    this.removeChild(this.fBox);
    this.removeChild(this.pBox);
    this.removeChild(this.zoom);
    this.listenZoomC = null;
    this.onmousemove = null;
    this.onmousedown = null;
    this.onmouseup = null;
    this.plot(this.f, p1.x, p2.x, this.pNum, this.plotType, this.color);
    if (!this.zoomBox) {
      // Create minature of current plot
      var axisLength = 200;
      this.zoomBox = Math.Coord(this.px + this.axisLength + 50, this.py, axisLength, 4, 2);
      this.zoomBox.plot(this.f, xa, xb, 100, this.plotType, this.color);
      this.zoomBox.removeChild(this.zoomBox.fBox);
      this.zoomBox.removeChild(this.zoomBox.pBox);
      this.zoomBox.removeChild(this.zoomBox.xLine);
      this.zoomBox.removeChild(this.zoomBox.yLine);
      this.zoomBox.removeChild(this.zoomBox.fLine);
      this.zoomBox.onmousemove = null;
      this.zoomBox.onmousedown = null;
      this.zoomBox.zoom = document.createElement('div');
      if (document.createEventObject)
        this.zoomBox.zoom.style.filter = 'progid:DXImageTransform.Microsoft.Alpha(opacity=20)';
      else
        this.zoomBox.zoom.style.opacity = 0.20;
      this.zoomBox.zoom.style.border = '1px solid #000';
      this.zoomBox.zoom.style.background = '#0af';
      this.zoomBox.zoom.style.position = 'absolute';
      this.zoomBox.zoom.style.cursor = 'pointer';
      this.zoomBox.zoom.style.zIndex = 30;
      this.zoomBox.appendChild(this.zoomBox.zoom);
      this.parentNode.appendChild(this.zoomBox);
    }
    // Get coords. and dimensions of zoom area in zoombox
    var p1 = this.c2p({x:0,y:0});
    var p2 = this.c2p({x:this.axisLength,y:this.axisLength});
    var c1 = this.zoomBox.p2c(p1);
    var c2 = this.zoomBox.p2c(p2);
    this.zoomBox.zoom.style.left = c1.x + 'px';
    this.zoomBox.zoom.style.top = c1.y + 'px';
    this.zoomBox.zoom.style.width = c2.x - c1.x + 'px';
    this.zoomBox.zoom.style.height = c2.y - c1.y + 'px';
    // Reset zoom
    this.zoom = null;
  };