/*
 * Throttle function borrowed from:
 * Underscore.js 1.5.2
 * http://underscorejs.org
 * (c) 2009-2013 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 * Underscore may be freely distributed under the MIT license.
 */

function throttle(func, wait) {
  var context, args, result;
  var timeout = null;
  var previous = 0;
  var later = function() {
    previous = new Date;
    timeout = null;
    result = func.apply(context, args);
  };
  return function() {
    var now = new Date;
    if (!previous) previous = now;
    var remaining = wait - (now - previous);
    context = this;
    args = arguments;
    if (remaining <= 0) {
      clearTimeout(timeout);
      timeout = null;
      previous = now;
      result = func.apply(context, args);
    } else if (!timeout) {
      timeout = setTimeout(later, remaining);
    }
    return result;
  };
}


$(window).load(function() {
  var $window = $(window),
  docHeight = $(document).height(),
    winHeight = window.innerHeight ? window.innerHeight : $window.height(),
    scrollDistance = $window.scrollTop() + winHeight,
    cache = [];

    var q = docHeight / 4;

    $('.q').css({ height: q })
    $('#q1').css({ top: 0 });
    $('#q2').css({ top: q + 'px' });
    $('#q3').css({ top: q * 2 + 'px' });
    $('#q4').css({ bottom: 0 });

    //$('.q').css({ display: 'block'});

    function calculateMarks(docHeight) {
      return {
        '25%' : parseInt(docHeight * 0.25, 10),
        '50%' : parseInt(docHeight * 0.50, 10),
        '75%' : parseInt(docHeight * 0.75, 10),
        // 1px cushion to trigger 100% event in iOS
        '100%': docHeight - 5
      };
    }

    function checkMarks(marks, scrollDistance) {

      $.each(marks, function(key, val) {
        if ( $.inArray(key, cache) === -1 && scrollDistance >= val ) {

          setTimeout(function() {
            $('.q[data-scroll="' + key + '"] span').addClass('on');
            $('.q[data-scroll="' + key + '"] i').css({left: document.documentElement.clientWidth + 'px'});

            cache.push(key);
          }, 250);

        }
      });
    }


$window.on('scroll.scrollDepth', throttle(function() {

  var $window = $(window),
  docHeight = $(document).height(),
    winHeight = window.innerHeight ? window.innerHeight : $window.height(),
    scrollDistance = $window.scrollTop() + winHeight;

  // Recalculate percentage marks
  var marks = calculateMarks(docHeight);

  // If all marks already hit, unbind scroll event
  if (cache.length >= 4) {
    $window.off('scroll.scrollDepth');
    return;
  }

  checkMarks(marks, scrollDistance);

  }, 500));

});

