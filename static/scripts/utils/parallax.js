// jquery.jparallax.js
// 0.4
// Stephen Band
//
// Dependencies:
// jquery.js
// jquery.dimensions.js
//
// Project and Documentation:
// http://webdev.stephband.info/parallax.html


// CLOSURE

(function(jQuery) {

// PRIVATE VARIABLES

var frameDuration = 25;   // in milliseconds (20 => 50 frames/second)
var frameTimer = false;
var xmouse = 0;
var ymouse = 0;

// PRIVATE FUNCTIONS

function pxToInt(n) {
	return parseInt(n.replace('px', ''))
}

function stripFiletype(ref) {
  var x=ref.replace('.html', '');
  x=x.replace('#', '');
  return x; 
}

function initOrigin(l) {
	  // Change origin strings to numeric values
  	if 			(l.xorigin=='left')         																				{l.xorigin=0}
  	else if (l.xorigin=='middle' || l.xorigin=='centre' || l.xorigin=='center')	{l.xorigin=0.5}
  	else if (l.xorigin=='right')  	 																						{l.xorigin=1};
  	if 			(l.yorigin=='top')          																				{l.yorigin=0}
  	else if (l.yorigin=='middle' || l.yorigin=='centre' || l.yorigin=='center')	{l.yorigin=0.5}
  	else if (l.yorigin=='bottom')  																							{l.yorigin=1};
}

function centreLayers(layer, viewport) {
// A cheap hack!
	for (var i=0; i<layer.length; i++) {
  
		// Position layers based on mouse position
		if (layer[i].xparallax) layer[i].element.css("left", layer[i].xoffset - (0.5*viewport.width) * layer[i].xdynamic);
		if (layer[i].yparallax) layer[i].element.css("top", layer[i].yoffset - (0.5*viewport.height) * layer[i].ydynamic);

	}
}

function setFrameTimer(x, y, mouseport, layer) {
	frameTimer = setTimeout(function(){
		frameTimer=false;
  	// console.log(x+' '+xmouse+'\n'+
  	//						y+' '+ymouse+'  '+frameTimer);
  	if (xmouse!=x || ymouse!=y) {
  		positionLayers(mouseport, layer)
  	}
  	else if (!mouseport.inside) {
  		positionLayers(mouseport, layer);
  		setFrameTimer(xmouse, ymouse, mouseport, layer)
  	}
  }, frameDuration);
}

function mouseResponse(mouse, mouseport, layer) {

	if (mouse.pageX>=mouseport.left && mouse.pageX<=mouseport.width+mouseport.left && 
  		mouse.pageY>=mouseport.top && mouse.pageY<=mouseport.height+mouseport.top) {
  	
  	// Store mouse co-ordinates
  	// This causes problems when there are multiple jParallax on a page, because xmouse/ymouse is global.  Fix.
  	xmouse = mouse.pageX;
  	ymouse = mouse.pageY;
  	
  	// Start timer
  	if (!frameTimer) {
  		positionLayers(mouseport, layer);
			setFrameTimer(xmouse, ymouse, mouseport, layer);
  	}
	}
  else if (mouseport.inside) {
  	mouseport.inside=false;
  };
}


function positionLayers(mouseport, layer) {
  
  // console.log('Layers positioned.');	
	// Set where the layer SHOULD be and store in target
	for (var i=0; i<layer.length; i++) {
	  layer[i].xtarget = layer[i].xoffset - (xmouse-mouseport.left) * layer[i].xdynamic;
	  layer[i].ytarget = layer[i].yoffset - (ymouse-mouseport.top) * layer[i].ydynamic;
	}
	
	// Set where the layer is going to be
  if (!mouseport.inside) {
    for (var i=0; i<layer.length; i++) {
    	layer[i].x = layer[i].xtarget+(layer[i].x-layer[i].xtarget)*mouseport.softfactor;
    	layer[i].y = layer[i].ytarget+(layer[i].y-layer[i].ytarget)*mouseport.softfactor;		
    }
    
    var difference = Math.ceil(layer[layer.length-1].x-layer[layer.length-1].xtarget);
    
    // If the layer is inside the softlimit set inside to true
    if (difference < mouseport.softlimit && difference > mouseport.softlimit*-1) {
    	mouseport.inside=true;
    }
    else {
    	// console.log(difference+' '+mouseport.inside)
    };
  }
  
  // Set where the layer is if inside softlimit
  else {
    for (var i=0; i<layer.length; i++) {
    	layer[i].x = layer[i].xtarget;
    	layer[i].y = layer[i].ytarget;
    }
  }
  
	// Position layers
	for (var i=0; i<layer.length; i++) {	    
	  if (layer[i].xparallax) layer[i].element.css("left", layer[i].x);
	  if (layer[i].yparallax) layer[i].element.css("top", layer[i].y);
	}
	
	frameTimer = false;
}


function debugParallax() {
  var debugString =
    "Window\n  width: "+jQuery(window).width()+"\n  height: "+jQuery(window).height()+
    "\n\nDocument\n  width: "+jQuery(document).width()+"\n  height: "+jQuery(document).height()+
    "\n\nViewport\n  width: "+viewport.width()+"\n  height: "+viewport.height()+
    "\n\nMouseport\n  width: "+mouseport.width()+"\n  height: "+mouseport.height()+"\n  left: "+layer[0].mouseleft+"\n  top: "+layer[0].mousetop
  for (var i=0; i<jQuery('#parallax > *').length; i++) {
    debugString = debugString +
    "\n\nLayer "+(i+1)+
    "\n  width:    "+layer[i+1].width+"px"+
    "\n  height:   "+layer[i+1].height+"px"+
    "\n  xtravel:  "+layer[i+1].xtravel+"px, locked: "+layer[i+1].xlock+
    "\n  ytravel:  "+layer[i+1].ytravel+"px, locked: "+layer[i+1].ylock+
    "\n  xoffset:  "+layer[i+1].xoffset+"px"+
    "\n  yoffset:  "+layer[i+1].yoffset+"px"+
    "\n  xorigin:  "+layer[i+1].xorigin+
    "\n  yorigin:  "+layer[i+1].yorigin;
    
    for (var n=0; n<layer[i+1].canvas.children().length; n++) {
      debugString = debugString +
        "\nChild "+n+
        "\n  anchor:   "+layer[i+1].content[n].anchor+
        "\n  position: "+layer[i+1].content[n].left+"px, "+layer[i+1].content[n].top+"px";
    }
	}
	alert(debugString);
}


// PLUGIN DEFINITION ••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••

jQuery.fn.jparallax = function(options) {
	
	// Extend defaults with options.
	var settings = {
			viewport:			jQuery.extend({}, jQuery.fn.jparallax.settings.viewport, options.viewport),
			mouseport:		jQuery.extend({}, jQuery.fn.jparallax.settings.mouseport, options.mouseport),
			layer:				jQuery.extend({}, jQuery.fn.jparallax.settings.layer, options.layer),
			anim:					jQuery.extend({}, jQuery.fn.jparallax.settings.anim, options.anim)
	};
	
	// Populate layer array with settings
	var layersettings = [];
	
	for(var a=1; a<arguments.length; a++) {
  	layersettings.push(jQuery.extend({}, settings.layer, arguments[a]))
  }
	
	// Iterate matched elements
	return this.each(function() {
		
		// THE ACTION •••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••
		
		var element = jQuery(this);
		
		var viewport	=	jQuery.extend({}, {element: element}, settings.viewport);
		var mouseport = jQuery.extend({}, {element: viewport.element}, settings.mouseport);
		var layer			= [];
		
		// port dimensions
		jQuery.extend(viewport, {		
			width: 		viewport.element.width(),
			height: 	viewport.element.height()
		});
		jQuery.extend(mouseport, {
			width:		mouseport.element.width(),
			height:		mouseport.element.height(),
			top:			mouseport.element.offset().top,
			left:			mouseport.element.offset().left
		});
		
		// Create layers
		element.children().css('position', 'absolute');
		
		for (var i=0; i<element.children().length; i++) {

			// Create layer from settings if it doesn't exist
			layer[i]=jQuery.extend({}, settings.layer, layersettings[i], {element: element.children('*:eq('+i+')')});

			layer[i] = jQuery.extend({}, {
				width:		pxToInt(layer[i].element.css("width")),
				height:		pxToInt(layer[i].element.css("height")),
				xtravel:	pxToInt(layer[i].element.css("width")) - viewport.width,
				ytravel:	pxToInt(layer[i].element.css("height")) - viewport.height,
				xtarget:	0,
				ytarget:	0,
				x:				0,
				y:				0
			}, layer[i]);
			
			jQuery.extend(layer[i], {	
				xoffset: 	(viewport.width - layer[i].width + layer[i].xtravel) * layer[i].xorigin,
				yoffset:	(viewport.height - layer[i].height + layer[i].ytravel) * layer[i].yorigin,
				xdynamic:	layer[i].xtravel / viewport.width,
				ydynamic:	layer[i].ytravel / viewport.height
			});
			
	    // Layer content: get positions, dimensions and calculate element offsets for centering children of layers
	    for (var n=0; n<layer[i].element.children().length; n++) {

				jQuery.extend(layer[i], {content: [{element: layer[i].element.children().eq(n)}]});

				jQuery.extend(layer[i].content[n], {
					anchor:		layer[i].content[n].element.children('a').attr('name'),
					width: 		pxToInt(layer[i].content[n].element.css("width")),
					height:		pxToInt(layer[i].content[n].element.css("height")),
					left:			pxToInt(layer[i].content[n].element.css("left")),
					top:			pxToInt(layer[i].content[n].element.css("top"))
				});
				jQuery.extend(layer[i].content[n], {
					xoffset:	(viewport.width/2)-(layer[i].content[n].left+(layer[i].content[n].width/2)),
					yoffset:	(viewport.height/2)-(layer[i].content[n].top+(layer[i].content[n].height/2))
				});
				
				// Perhaps anchor should be done this way:
	      //if(!layer[i].content[n].anchor && layer[i].content[n].element.children('a').attr('name'))
	      //                                  layer[i].content[n]['anchor']         = layer[i].content[n].element.children('a').attr('name');

	    }
	  	  
		}

		centreLayers(layer, viewport);

		jQuery().mousemove(function(mouse) {

			mouseResponse(mouse, mouseport, layer);
		
		});
		
		
	});

};


// PLUGIN DEFAULTS ••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••••

jQuery.fn.jparallax.settings = {
	viewport:		{	},
	mouseport:	{	active:				true,
								inside:				false,
								softfactor:		0.75,
								softlimit:		6								},
	layer: 			{	xparallax: 		true,
								yparallax: 		true,
								xorigin:			'centre',
								yorigin:			'centre'    		},
	animation:	{	timerpause:		5000,
								duration:			600							},
	trigger:		false
};


// PUBLIC METHODS


jQuery.fn.jparallax.triggerResponse = function(ref) {
  var i=1;
  var n=0;
  // find content item with anchor ref - there's got to be a neater way of writing an if matrix...
  for (i=1; i<layer.length; i++) {
    var gotcha=false;
    for (n=0; n<layer[i].content.length; n++) {
      if (layer[i].content[n].anchor==ref) {
        gotcha=true;
        break;
      }
    }
    if (gotcha) break;
  }
  
  // alert('Layer '+i+', item '+n);
  
  for (l=1; l<layer.length; l++) {
    if (l!=i) layer[l].canvas.animate({left: layer[0].width}, animDuration );  //top: -1*layer[l].height  for upward motion.
  }
  
  layer[i].canvas.animate({top: layer[i].content[n].topOffset, left: layer[i].content[n].leftOffset}, animDuration );

}

jQuery.fn.jparallax.timerResponse = function(ref) {
  var wait;
  if (content[ref].pause) {wait=content[ref].pause} else {wait=pause};
  
  // Increment 'ref'
  //if ((ref+1)==(jQuery('canvas *').length)) {ref=0}
  //else {ref=ref+1};

  // Randomise 'ref'
  var refStore=ref;
  while (ref==refStore) {
    ref=Math.ceil(Math.random()*layer[1].content.length)-1;
  }

  triggerResponse(ref);  
  timer=setTimeout("timerResponse("+ref+")", wait)
}



// RUN

initOrigin(jQuery.fn.jparallax.settings.layer);

jQuery(function() {

//	set default easing
//	jQuery.easing.def = "easeOutQuart";		

//	jQuery(window).resize(function() { });
	
  

});

// END CLOSURE

})(jQuery);