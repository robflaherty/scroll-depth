/*!
* @preserve
* scrolldepth.js | 2.0.0-beta.1
* Copyright (c) 2020 Rob Flaherty (@robflaherty)
* Licensed under the MIT and GPL licenses.
*/

// Default settings
var defaults = {
  sendReport: sendReport,
  category: 'Scroll Depth',
  milestones: undefined,
  pixelDepth: true,
  ignore: undefined,
  container: undefined
};

var settings;

function debounce(func, wait, immediate) {
  var timeout;

  return function() {
    var context = this, args = arguments;

    var later = function() {
      timeout = null;
      if (!immediate) {
        func.apply(context, args);
      }
    };
    var callNow = immediate && !timeout;

    clearTimeout(timeout);

    timeout = setTimeout(later, wait);
    if (callNow) {
      func.apply(context, args);
    }
  };
}

function sendReport(data) {
  var [category, action, label, delta] = data

  console.log(category, action, label, delta)

  if (settings.mode === 'gtag' && typeof gtag === 'function') {
    gtag('event', action, {
      'event_category': category,
      'event_label': label,
      'value': delta,
      'non_interaction': true
    });

    return
  }

  if (settings.mode === 'gtm' && typeof dataLayer !== 'undefined') {
    dataLayer.push({
      'event': 'GAEvent',
      'event_category': category,
      'event_action': action,
      'event_label': label,
      'event_value': delta,
      'non_interaction': true
    });

    return
  }

  if (settings.mode === 'universal' && typeof ga === 'function') {
    ga('send', {
      'hitType': 'event',
      'eventCategory': category,
      'eventAction': action,
      'eventLabel': label,
      'eventValue': delta,
      'nonInteraction': true
    });

    return
  }

}

function setContainer() {
  var height;
  var ignoreHeight = 0

  if (settings.container) {
    var el = document.querySelector(settings.container);
    height= el.getBoundingClientRect().height
  } else {
    height = document.documentElement.scrollHeight
  }

  if (settings.ignore) {
    var els = document.querySelectorAll(settings.ignore);
    els.forEach((elem) => {
      ignoreHeight += elem.getBoundingClientRect().height
    });

  }

  return height - ignoreHeight
}

function init(options) {
  settings = Object.assign(defaults, options)

  var pageHeight = setContainer()
  var windowHeight = window.innerHeight

  var offset = settings.milestones.hasOwnProperty('offset') ? settings.milestones.offset : 0;
  var selectors = settings.milestones.hasOwnProperty('selectors') ? settings.milestones.selectors : ['.scroll-milestone'];

  var pageId = new Date().getTime() + '.' + Math.floor(10000 + Math.random() * 90000) + '.' + pageHeight + '.' + windowHeight

  console.log(pageHeight)

  var lastDepth = 0
  var lastReportedDepth = 0

  var milestoneList = []
  var passedMilestones = []

  var lastReportedMilestone = 0

  var zeroSent = false;

  if (settings.milestones) {
    var milestones = document.querySelectorAll(selectors);
    milestones.forEach((elem) => {
      var distanceFromTop= elem.getBoundingClientRect().top + window.pageYOffset
      milestoneList.push(distanceFromTop)
    });

  }

  /*
   * Record max depth on scroll
   */

  window.addEventListener('scroll', debounce(function(e) {

    var depth = window.pageYOffset + windowHeight

    console.log(depth)

    if (depth > lastDepth) {
      lastDepth = depth
    }

    if (milestoneList.length == 0) {
      return
    }

    milestoneList.forEach((point) => {
      if (depth > point + offset) {
        passedMilestones.push(point)
        milestoneList = milestoneList.filter(item => item !== point)
      }
    })

  }, 500), false);

  /*
   * Send report when tab is no longer active
   */

  document.addEventListener('visibilitychange', function (e) {

    if (document.visibilityState == 'hidden') {

      var depth = window.pageYOffset + windowHeight
      var delta = depth - lastReportedDepth

      // Buffer to avoid sending event for insignificant scrolls
      if (depth > lastReportedDepth + 50) {

        lastReportedDepth = depth;

        if (settings.pixelDepth) {
          settings.sendReport([settings.category, 'Pixel Depth', pageId, delta])
        }

        if (settings.milestones) {
          var milestonesToReport = passedMilestones.length - lastReportedMilestone

          if (milestonesToReport) {
            settings.sendReport([settings.category, 'Milestones', pageId, milestonesToReport])
            lastReportedMilestone += milestonesToReport
          }

          if (lastReportedMilestone == 0 && !zeroSent) {
            settings.sendReport([settings.category, 'Milestones', pageId, 0])
            zeroSent = true;
          }

        }

      }

    }

  }, false);

}

export default {
   init: init
};
