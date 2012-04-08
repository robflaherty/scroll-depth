# jQuery Scroll Depth
This is a jQuery plugin that keeps and eye on how far down the page a user has scrolled and then reports data back to Google Analytics using the GA Events API. The default behavior reports on the 25%, 50%, 75%, and 100% scroll marks. It also sends an initial "Baseline" event to use as a benchmark.

In addition to the percentage scroll marks you can trigger events based on specific DOM elements. For example you can tell the plugin to report whenever the article comments div is scrolled into view, or whenever the footer is reached.

Data is sent to Google Analytics so it's required that you have Google Analytics tracking implemented on your site.

[View the Project Page](http://robflaherty.github.com/jquery-scrolldepth/)

## Usage
```javascript
// Basic
$.scrollDepth();

// With some options
$.scrollDepth({
  minHeight: 2000px, // Only track for documents taller than 2000px | Default: 0
  elements: ['#comments', 'footer'] // Track DOM elements | Default: []
  percentage: false, // Don't track depth percentage | Default: true
});
```
## GA Events Caveat
GA Events data messes with your bounce rate. If you're using Events tracking for anything you'll have to disregard the reported bounce rate and instead just look at the percentage of single-page visits (which is your true bounce rate).

## Browser Support
Tested in Chrome (18), Firefox (8), Safari (5), Opera (10), IE (7-10). Also tested on iOS, Opera Mobile, and a few Android emulators.

## Contact
[@robflaherty](https://twitter.com/#!/robflaherty)

## License
Licensed under the MIT and GPL licenses.