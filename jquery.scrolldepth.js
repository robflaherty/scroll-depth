/*
 * jquery.scrolldepth.js
 * Copyright (c) 2012 Rob Flaherty (@robflaherty)
 * Licensed under the MIT and GPL licenses.
 */
;(function ( $, window, document, undefined ) {
  
  "use strict";

  var defaults = {
    elements: [],
    minHeight: 0,
    offset: 0,
    percentage: true
  },

  $window = $(window),
  cache = [];

  function sendEvent(action, label) {
    _gaq.push(['_trackEvent', 'Scroll Depth', action, label]);
  }

  function calculateMarks(docHeight) {
    return {
      '25%' : parseInt(docHeight * 0.25, 10),          
      '50%' : parseInt(docHeight * 0.50, 10),          
      '75%' : parseInt(docHeight * 0.75, 10),
      '100%': docHeight
    };
  }

  function checkMarks(marks, scrollDistance) {
    // Check each active mark
    $.each(marks, function(key, val) {
      if ( $.inArray(key, cache) === -1 && scrollDistance >= val ) {
        sendEvent('Percentage', key);
        cache.push(key);
      }
    });
  }

  function checkElements(elements, scrollDistance) {
    $.each(elements, function(index, elem) {
      if ( $.inArray(elem, cache) === -1) {
        var position = $(elem).offset().top;
        
        if (scrollDistance >= position) {
          sendEvent('Elements', elem);
          cache.push(elem);
        }
      }
    });
  }

  $.scrollDepth = function(options) {
    
    options = $.extend({}, defaults, options);

    if ( $(document).height() < options.minHeight ) {
      return;
    }

    // Establish baseline (0% scroll)
    sendEvent('Percentage', 'Baseline');

    $window.on('scroll.scrollDepth', function() {
      var docHeight = $(document).height(),
        winHeight = $window.height(),
        scrollDistance = $window.scrollTop() + winHeight,
        offset = parseInt(winHeight * (options.offset / 100), 10),
        marks = calculateMarks(docHeight);

      // If all marks already hit, unbind scroll event
      if (cache.length >= marks.length + options.elements.length) {
        $window.off('scroll.scrollDepth');
        return;
      }

      // Check specified DOM elements
      if (options.elements) {
        checkElements(options.elements, scrollDistance);
      }

      // Check standard marks
      if (options.percentage) {        
        checkMarks(marks, scrollDistance);        
      }
    });

  };

})( jQuery, window, document );