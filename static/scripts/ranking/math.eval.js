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
*  JSLab Math.Eval - Function evauluater
*  
****************************************************/

// Evaluate a matlab math exression
Math.Eval =
  function(eq) {
    // Replace -- with + to avoid decrement error
    eq = eq.replace(/--/g,'+');
    // Evaluate numeric expressions in parenthesis
    eq = eq.replace(/\([\*\+\-\/\.\d]+\)/g,function($0){return eval($0);});
    // Strip parenthesis around plain numbers
    eq = eq.replace(/\((-?\d+)\)/g,'$1');
    // Check operator mismatch
    var m = eq.match(/([\*\+\/\^])(\1)/);
    if (m)
      throw new Error('Math.Eval: Duplicate operator in equation: ' + m[1]);
    // Check for starting or ending operator
    var m = eq.match(/([\*\+\/\^])(\1)/);
    if (m)
      throw new Error('Math.Eval: Duplicate operator: ' + m[1]);
    // Check parenthesis match
    var l = eq.length;
    var p = 0;
    for(var i=0; i<l; i++) {
      var c = eq.charAt(i);
      // Check for new group
      if (c == '(')
        p++;
      else if (c == ')')
        p--;
      // If power of
      else if (c == '^') {
        // Next group
        var b = eq.charAt(i + 1) == '(' ? Math.Eval.nextGroup(eq,i+1) : eq.substring(i+1,eq.length).match(/(-?[^\+\-\*\/\^]+)/)[1];
        b = b.replace(/(^[^\(]+)\)$/,'$1');
        // Prev group
        var a = eq.charAt(i - 1) == ')' ? Math.Eval.prevGroup(eq,i-1) : eq.substring(0,i).match(/([^\+\-\*\/\^\(]+$)/)[1];
        //a = a.replace(/^\(([^\)]+)$/,'$1');
        // Replace with Math.pow
        eq = eq.substring(0, i - a.length) + 'Math.pow(' + a + ',' + b + ')' + eq.substring(i + b.length + 1);
        // Recalculate length
        l = eq.length;
        // Recalibrate i
        i = i - a.length + 7;
      }
      if (p < 0)
        throw new Error('Math.Eval: Unmatched parenthesis at position ' + i);
    }
    if (p)
      throw new Error('Math.Eval: Unmatched parenthesis');
    // Strip unessesary parenthesis
    while(/^\(\(.*?\)\)/.test(eq))
      eq = eq.substring(1,eq.length - 1);
    eq = Math.Eval.replace(eq);
    return eq;
  };

// Replace math functions and constants
Math.Eval.replace =
  function(s) {
    // Replace functions
    s = s.replace(/(abs|acos|asin|atan2?|cos|log|sin|tan|sqrt)/g,'Math.$1');
    // Replace constants
    s = s.replace(/\b(e|pi)\b/ig,function($0,$1){return 'Math.' + $1.toUpperCase()});
    return s;
  };

// Get next expression group
Math.Eval.nextGroup =
  function(eq,i) {
    var p = 0;
    var s = '';
    for(var j=i; j<eq.length; j++) {
      var c = eq.charAt(j);
      if (c == '(')
        p++;
      else if (c == ')')
        p--;
      s += c;
      if (!p)
        break;
    }
    return s;
  };

// Get previous expression group
Math.Eval.prevGroup =
  function(eq,i) {
    var p = 0;
    var s = '';
    for(var j=i; j>-1; j--) {
      var c = eq.charAt(j);
      if (c == ')')
        p++;
      else if (c == '(')
        p--;
      s = c + s;
      if (!p)
        break;
    }
    j--;
    // Find prev. operator
    while(j > -1 && !/[\+\-\*\/\^\(]/.test(eq[j])) {
      s = eq.charAt(j) + s;
      j--;
    }
    return s;
  };
