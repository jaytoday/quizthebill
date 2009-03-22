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
*  JSLab Toolbar
*  
****************************************************/

// Namespace
if (!window.JSL)
  JSL = {};

/***************************************************
*
*  Toolbar container
*  
****************************************************/

// fieldset is container for toolbar
JSL.Toolbar =
  function(url, title) {
    var fieldset = document.createElement('fieldset')
    // Styles
    fieldset.style.padding = '2px';
    fieldset.style.background = '#d4d0c8';
    fieldset.style.borderBottom = '1px solid #404040';
    fieldset.style.verticalAlign = 'middle';
    fieldset.style.minWidth = '900px';
    fieldset.style.lineHeight = '16px';
    // Properties
    fieldset.shortcuts = [];
    // Methods
    fieldset.addButton = JSL.Toolbar.addButton;
    fieldset.addShortcut = JSL.Toolbar.addShortcut;
    // Event handler for keyboard shortcuts
    fieldset.onkeyup = JSL.Toolbar.onkeyup;
    // Add logo to toolbar
    var logo = JSL.Toolbar.Logo(url);
    fieldset.appendChild(logo);
    // Add title
    fieldset.appendChild(document.createTextNode(title));
    // Add vertical spacer
    fieldset.appendChild(JSL.Toolbar.VerticalSpace());
    return fieldset;
  };

// Event handler for shortcuts
JSL.Toolbar.onkeyup =
  function(e) {
    // If IE
    if (!e) {
      e = event;
      e.target = e.srcElement;
    }
    // If pressing enter while a button have focus then
    // ignore input
    if (e.keyCode == 13 && e.target.nodeName.toLowerCase() == 'input' && e.target.type.toLowerCase() == 'button')
      return;
    var a = this.shortcuts;
    var l = a.length;
    for(var i=0; i<l; i++) {
      if (a[i].key == e.keyCode && a[i].ctrl == e.ctrlKey  && a[i].alt == e.altKey  && a[i].shift == e.shiftKey) {
        a[i].f();
        break;
      }
    }
  };

// Add a new shortcut to an element
JSL.Toolbar.addShortcut =
  function(elm, txt, f, key, ctrl, alt, shift) {
    elm.title = txt;
    var o =
      {
        elm:elm,
        f:f,
        key:key,
        ctrl:ctrl,
        alt:alt,
        shift:shift
      };
    this.shortcuts.push(o);
  };

// Counter for creating auto id's 
JSL.Toolbar.autoId = 0;

/***************************************************
*
*  Toolbar Logo
*  
****************************************************/

JSL.Toolbar.Logo =
  function(url) {
    // Default url
    if (!url)
      url = 'http://www.jslab.dk';
    var img = document.createElement('img');
    img.src = '../gfx/logo.jpg';
    // Properties
    img.title = img.alt = 'Created by Tavs Dokkedahl @ www.jslab.dk. Click for more info.';
    // Styles
    img.style.borderTop = '1px solid #fff';
    img.style.borderRight = '1px solid #404040';
    img.style.borderBottom = '1px solid #404040';
    img.style.borderLeft = '1px solid #fff';
    img.style.cursor = 'pointer';
    img.style.marginRight = '4px';
    // Event handlers
    img.onclick =
      function(e) {
        window.open(url,'','');
      };
    return img;
  };

/***************************************************
*
*  Toolbar Label
*  
****************************************************/

JSL.Toolbar.Label =
  function(caption, elm) {
    var label = document.createElement('label');
    // Styles
    label.style.margin = '0 2px';
    label.innerHTML = caption;
    // Add relation to element if elm is provided
    if (elm) {
      elm.id = elm.id ? elm.id : 'autoId' + JSL.Toolbar.autoId++;
      label.htmlFor = elm.id;
    }
    return label;
  };

/***************************************************
*
*  Toolbar Text Input
*  
****************************************************/

JSL.Toolbar.Input =
  function(width, align, value) {
    var input = document.createElement('input');
    // Properties
    input.type = 'text';
    input.value = value || '';
    // Styles
    input.style.width = width + 'px';
    input.style.textAlign = align;
    input.style.margin = '0 2px';
    return input;
  };

/***************************************************
*
*  Toolbar Button
*  
****************************************************/

// input of type button
JSL.Toolbar.Button =
  function(caption, f, icon) {
    var input = document.createElement('input');
    // Properties
    input.type = 'button';
    input.value = caption;
    // Styles
    input.style.border = '1px solid #d4d0c8';
    input.style.background = '#d4d0c8';
    input.style.margin = '-2px 2px -1px 2px';
    // If icon is provided insert as background image
    if (icon) {
      //input.style.background = 'url("' + PATH + icon + '") 2px center no-repeat';
      input.style.padding = '2px 2px 3px 24px';
      // If IE
      if (document.createEventObject)
        input.style.padding = '2px 2px 3px 20px';
    }
    else
      input.style.padding = '2px 2px 3px 2px';
    // Event handlers
    if (f)
      input.onclick = f;
    input.onmouseover = JSL.Toolbar.Button.onmouseover;
    input.onmouseout = JSL.Toolbar.Button.onmouseout;
    input.onmousedown = JSL.Toolbar.Button.onmousedown;
    input.onmouseup = JSL.Toolbar.Button.onmouseup;
    input.onfocus = JSL.Toolbar.Button.onmouseover;
    input.onblur = JSL.Toolbar.Button.onmouseout;
    return input;
  };

JSL.Toolbar.Button.onmouseover =
  function(e) {
    this.style.borderTop = this.style.borderLeft = '1px solid #fff';
    this.style.borderBottom = this.style.borderRight = '1px solid #404040';
  };

JSL.Toolbar.Button.onmouseout =
  function(e) {
    this.style.border = '1px solid #d4d0c8';
  };

JSL.Toolbar.Button.onmousedown =
  function(e) {
    this.style.borderTop = this.style.borderLeft = '1px solid #404040';
    this.style.borderBottom = this.style.borderRight = '1px solid #fff';
  };

JSL.Toolbar.Button.onmouseup =
  function(e) {
    this.style.border = '1px solid #d4d0c8';
  };

/***************************************************
*
*  Toolbar Horisontal Spacer
*  
****************************************************/

// Horisontal spacer
JSL.Toolbar.HorisontalSpace =
  function() {
    var div = document.createElement('div');
    // Styles
    div.style.borderTop = '1px solid #404040';
    div.style.borderBottom = '1px solid #fff';
    div.style.margin = '2px -2px';
    div.style.clear = 'both';
    return div;
  };

/***************************************************
*
*  Toolbar Vertical Spacer
*  
****************************************************/

// Vertical spacer. Fits line height of 16 px and 11 px font size
JSL.Toolbar.VerticalSpace =
  function() {
    var div = document.createElement('div');
    // Styles
    div.style.borderLeft = '1px solid #404040';
    div.style.borderRight = '1px solid #fff';
    // If IE
    if (document.createEventObject) {
      div.style.display = 'inline';
      div.style.zoom = 1;
      div.style.height = '25px';
      div.style.margin = '-7px 4px 0 4px';
      div.style.position = 'relative';
      div.style.top = '5px';
    }
    else {
      div.style.display = 'inline-block';
      div.style.height = '23px';
      div.style.margin = '-3px 4px -8px 4px';
    }
    return div;
  };

/***************************************************
*
*  Toolbar Sidebar
*  
****************************************************/

JSL.Toolbar.Sidebar =
  function(caption, width, height) {
    // Outer frame
    var oFrame = document.createElement('div');
    // Styles
    oFrame.style.zIndex = 100;
    oFrame.style.border = '1px solid #f00';
    oFrame.style.width = width + 'px';
    oFrame.style.height = height + 'px';
    oFrame.style.position = 'absolute';
    oFrame.style.borderTop = '1px solid #d4d0c8';
    oFrame.style.borderLeft = '1px solid #d4d0c8';
    oFrame.style.borderBottom = '1px solid #404040';
    oFrame.style.borderRight = '1px solid #404040';
    oFrame.style.right = '1px';
    oFrame.style.display = 'none';
    // Only IE needs the top margin
    oFrame.style.marginTop = '1px';
    // inner frame
    var iFrame = document.createElement('div');
    iFrame.style.width = width - 10 + 'px';
    iFrame.style.height = height - 10 + 'px';
    iFrame.style.position = 'absolute';
    iFrame.style.borderTop = '1px solid #fff';
    iFrame.style.borderLeft = '1px solid #fff';
    iFrame.style.borderBottom = '1px solid #808080';
    iFrame.style.borderRight = '1px solid #808080';
    iFrame.style.background = '#d4d0c8';
    iFrame.style.padding = '4px';
    // Caption
    iFrame.appendChild(document.createTextNode(caption));
    // Close button
    var close = JSL.Toolbar.Button('x', function(){oFrame.close();});
    close.style.margin = 0;
    close.style.marginLeft = '4px';
    close.style.padding = '2px';
    close.style.paddingTop = 0;
    iFrame.appendChild(close);
    // HR
    var hr = JSL.Toolbar.HorisontalSpace();
    hr.style.margin = '4px 0';
    iFrame.appendChild(hr);
    // Add form to iFrame for easy reset
    var form = document.createElement('form');
    iFrame.appendChild(form);
    oFrame.appendChild(iFrame);
    // Create reference to inner frame
    // so its possible to add content
    oFrame.content = form;
    // Methods
    oFrame.open = JSL.Toolbar.Sidebar.open;
    oFrame.close = JSL.Toolbar.Sidebar.close;
    
    return oFrame;
  };

JSL.Toolbar.Sidebar.open =
  function() {
    this.style.display = 'block';
  };

JSL.Toolbar.Sidebar.close =
  function() {
    this.style.display = 'none';
  };

/***************************************************
*
*  Toolbar Fieldset
*  
****************************************************/

JSL.Toolbar.Fieldset =
  function(caption) {
    // Caption for fieldset
    var legend = document.createElement('legend');
    // If IE
    if (document.createEventObject)
      legend.style.marginLeft = '-6px';
    else
      legend.style.marginLeft = '-4px';
    legend.style.padding = '0 4px';
    legend.style.backgroundColor = '#d4d0c8';
    legend.appendChild(document.createTextNode(caption));
    // Create fieldset
    var fieldset = document.createElement('fieldset');
    fieldset.style.margin = '4px 0';
    fieldset.style.width = '100%';
    // Opera needs minWidt
    fieldset.style.minWidth = '100%';
    // Set padding to 0 for correct 100% width in FF, SF
    fieldset.style.padding = '4px 0';
    fieldset.style.borderTopColor = '#fff';
    fieldset.style.borderLeft = 0;
    fieldset.style.borderBottom = 0;
    fieldset.style.borderRight = 0;
    fieldset.appendChild(legend);
    return fieldset;
  };

/***************************************************
*
*  Toolbar Generic Grid
*  
****************************************************/

JSL.Toolbar.Grid =
  function() {
    var table = document.createElement('table');
    var tbody = document.createElement('tbody');
    var a = arguments;
    var l = a.length;
    var tr, td;
    for(var i=0; i<l; i++) {
      tr = document.createElement('tr');
      // Split on |
      var cols = a[i].split('|');
      for(var j=0; j<cols.length; j++) {
        td = JSL.Toolbar.Grid.Cell(cols[j].split('-'));
        //td.appendChild(document.createTextNode(i + ',' + j + ' '));
        tr.appendChild(td);
      }
      tbody.appendChild(tr);
    }
    table.appendChild(tbody);
    table.style.width = '100%';
    // If IE
    if (document.createEventObject) {
      table.style.marginLeft = '4px';
      table.style.marginRight = '-4px';
    }
    table.style.padding = 0;
    table.style.border = 0;
    table.addToCell = JSL.Toolbar.Grid.addToCell;
    return table;
  };

JSL.Toolbar.Grid.getCell =
  function(i,j) {
    return this.rows[i].cells[j];
  };

JSL.Toolbar.Grid.addToCell =
  function(i,j,elm) {
    try {
      this.rows[i].cells[j].appendChild(elm);
    }
    catch(e) {
      throw new Error('WDG: Grid index is out of bounds');
    }
  };

/***************************************************
*
*  Toolbar Generic Grid Cell
*  
****************************************************/

// w, ha, va, rs, cs
JSL.Toolbar.Grid.Cell =
  function(a) {
    var td = document.createElement('td');
    td.style.width = a[0] + '%';
    td.style.textAlign = JSL.Toolbar.Grid.Cell.align[a[1]];
    td.style.verticalAlign = JSL.Toolbar.Grid.Cell.align[a[2]];
    td.style.border = 0;
    //td.style.border = '1px solid #000';
    if (a[3] != undefined && a[3] != 0)
      td.rowSpan = a[3] + '';
    if (a[4] != undefined && a[4] != 0)
      td.colSpan = a[4] + '';
    return td;
  };

// Translation table
JSL.Toolbar.Grid.Cell.align =
  {
    l:'left',
    c:'center',
    r:'right',
    t:'top',
    m:'middle',
    b:'bottom'
  };
