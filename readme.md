# Scroll Depth
Scroll Depth is a Google Analytics plugin that tracks how far users are scrolling. It monitors the 25%, 50%, 75%, and 100% scroll marks, sending a Google Analytics Event at each one.

In addition to the percentage scroll marks, you can record when specific elements on the page are scrolled into view. For example, on a blog, you could send a Scroll Depth event whenever the user reaches the end of a post.

Timing data for each scroll event is reported to Google Analytics via the [User Timing API](https://developers.google.com/analytics/devguides/collection/gajs/gaTrackingTiming). You can find this data in Google Analytics at Content > Site Speed > User Timings. This will give you data about how many seconds it takes users to reach each scroll point. (Note: Averages can be misleading. Make sure to dig through the GA UI to dig up more meaningful data. You may also want to [increase the sample rate](https://developers.google.com/analytics/devguides/collection/gajs/methods/gaJSApiBasicConfiguration#_gat.GA_Tracker_._setSiteSpeedSampleRate) from the default 5% to 100%.)

The plugin supports Universal Analytics, Classic Google Analytics, and Google Tag Manager.

[View the Project Page](http://parsnip.io/scroll-depth/)

[View the Blog Post](http://www.ravelrumba.com/blog/tracking-scroll-depth-jquery-google-analytics/)

## Usage
```javascript
// Basic
$.scrollDepth();

// With some options
$.scrollDepth({
  minHeight: 2000, // Only track for documents taller than 2000px | Default: 0
  elements: ['#comments', 'footer'] // Track DOM elements | Default: []
  percentage: false, // Don't track depth percentage | Default: true
});
```

## Google Tag Manager
If you want to integrate with GTM, here are the dataLayer variable names:

* Scroll Distance Event Name = ScrollDistance
* Scroll Timing Event Name = ScrollTiming
* Event Category = {{eventCategory}}
* Event Action = {{eventAction}}
* Event Label = {{eventLabel}}
* Event Value = {{eventValue}}
* Event Non-Interaction = {{eventNonInteraction}}

## Requirements
* Google Analytics
* jQuery 1.7+

## Browser Support
Tested in Chrome (18), Firefox (8), Safari (5), Opera (10), IE (7-10). Also tested on iOS, Opera Mobile, and a few Android emulators.

## Contact
If you have any questions please leave a comment on the [associated blog post](http://www.ravelrumba.com/blog/tracking-scroll-depth-jquery-google-analytics/) or find me on Twitter at [@robflaherty](https://twitter.com/robflaherty).

## Changelog

0.4 (12/23/13): Added support for Google Tag Manager

0.3 (11/21/13): Added throttling of scroll event callback for better performance.

0.2 (11/19/13): Added support for Universal Analytics.

0.1.2 (5/29/12): Added GA User Timing events to allow time tracking for scroll points.

0.1.1 (4/12/12): Added `opt_noninteraction` option to GA event to avoid impacting bounce rate.

0.1 (4/7/12): Initial release.

## License
Licensed under the MIT and GPL licenses.