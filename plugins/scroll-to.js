/*
* Animated scroll to
*/
$.fn.scrollTo = function(target, baseDuration, distanceQuotient, easing) {
  /* Default values */
  if (typeof baseDuration == 'undefined') {
    baseDuration = 500
  }
  if (typeof distanceQuotient == 'undefined') {
    distanceQuotient = 4
  }
  if (typeof easing == 'undefined') {
    easing = 'swing'
  }

  /* Scroll animated */
  let distance = Math.abs(target - $(this).scrollTop())
  $(this).animate({'scrollTop' : target}, baseDuration + distance / distanceQuotient, easing)

  /* Allow breaking of scroll on mousewheel */
  $(this).one('mousewheel', function() {
    $(this).stop()
  })
}
