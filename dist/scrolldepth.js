(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.scrolldepth = factory());
}(this, (function () { 'use strict';

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArrayLimit(arr, i) {
    if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }

  /*!
  * @preserve
  * scrolldepth.js | 2.0.0-beta.1
  * Copyright (c) 2020 Rob Flaherty (@robflaherty)
  * Licensed under the MIT and GPL licenses.
  */
  // Default settings
  var defaults = {
    sendEvent: sendEvent,
    category: 'Scroll Depth',
    milestones: undefined,
    pixelDepth: true
  };
  var settings;

  function debounce(func, wait, immediate) {
    var timeout;
    return function () {
      var context = this,
          args = arguments;

      var later = function later() {
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

  function sendEvent(data) {
    var _data = _slicedToArray(data, 4),
        category = _data[0],
        action = _data[1],
        label = _data[2],
        delta = _data[3];

    console.log(category, action, label, delta);

    if (settings.mode === 'gtag' && typeof gtag === 'function') {
      gtag('event', action, {
        'event_category': category,
        'event_label': label,
        'value': delta,
        'non_interaction': true
      });
      return;
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
      return;
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
      return;
    }
  }

  function init(options) {
    settings = Object.assign(defaults, options);
    var pageHeight = document.documentElement.scrollHeight;
    var windowHeight = window.innerHeight;
    var offset = settings.milestones.hasOwnProperty('offset') ? settings.milestones.offset : 0;
    var selectors = settings.milestones.hasOwnProperty('selectors') ? settings.milestones.selectors : ['.scroll-milestone'];
    var pageId = new Date().getTime() + '.' + Math.floor(10000 + Math.random() * 90000) + '.' + pageHeight + '.' + windowHeight;
    var lastReportedDepth = 0;
    var milestoneList = [];
    var passedMilestones = [];
    var lastReportedMilestone = 0;
    var zeroSent = false;

    if (settings.milestones) {
      selectors.forEach(function (selector) {
        var milestones = document.querySelectorAll(selector);
        milestones.forEach(function (elem) {
          var distanceFromTop = elem.getBoundingClientRect().top + window.pageYOffset;
          milestoneList.push(distanceFromTop);
        });
      });
    }
    /*
     * Record max depth on scroll
     */


    window.addEventListener('scroll', debounce(function (e) {
      var depth = window.pageYOffset + windowHeight;
      console.log(depth);

      if (milestoneList.length == 0) {
        return;
      }

      milestoneList.forEach(function (point) {
        if (depth > point + offset) {
          passedMilestones.push(point);
          milestoneList = milestoneList.filter(function (item) {
            return item !== point;
          });
        }
      });
    }, 500), false);
    /*
     * Send report when tab is no longer active
     */

    document.addEventListener('visibilitychange', function (e) {
      if (document.visibilityState == 'hidden') {
        var depth = window.pageYOffset + windowHeight;
        var delta = depth - lastReportedDepth; // Buffer to avoid sending event for insignificant scrolls

        if (depth > lastReportedDepth + 50) {
          lastReportedDepth = depth;

          if (settings.pixelDepth) {
            settings.sendEvent([settings.category, 'Pixel Depth', pageId, delta]);
          }

          if (settings.milestones) {
            var milestonesToReport = passedMilestones.length - lastReportedMilestone;

            if (milestonesToReport) {
              settings.sendEvent([settings.category, 'Milestones', pageId, milestonesToReport]);
              lastReportedMilestone += milestonesToReport;
            }

            if (lastReportedMilestone == 0 && !zeroSent) {
              settings.sendEvent([settings.category, 'Milestones', pageId, 0]);
              zeroSent = true;
            }
          }
        }
      }
    }, false);
  }

  var scrolldepth = {
    init: init
  };

  return scrolldepth;

})));
