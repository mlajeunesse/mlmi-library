import '../../../modules/scroll-events/v1/scroll-events'

$.fn.FixedContent = function(options) {
  let self = this
  self.scrollEvents = $(window).ScrollEvents();

  if (self.data('fixedContent')) {
    return self.data('fixedContent')
  }
  self.options = $.fn.extend({
    topBlocker: $('.header'),
    bottomBlocker: $('.footer'),
    container: self.parent(),
    limitFromTop: 0,
    mobile: false,
  }, options)

  self.calculatePosition = function() {
    if (self.options.container.offset()) {
      /* Calculate positions */
      let containerPaddingX = parseFloat(self.options.container.css('padding-left')),
      containerPaddingY = parseFloat(self.options.container.css('padding-top')),
      targetLeft = self.options.container.offset().left + containerPaddingX,
      targetWidth = self.options.container.outerWidth(false) - (containerPaddingX * 2),
      targetTop = self.options.container.offset().top + containerPaddingY

      /* Offset for top element */
      let topOffset = $(window).scrollTop()
      if (topOffset < 0) {
        topOffset = 0
      }
      targetTop -= topOffset

      if(self.options.topBlocker != null){
        var topBlockerHeight = self.options.topBlocker.outerHeight(false);
      }else{
        var topBlockerHeight = 0;
      }

      /* Limit top */
      if (targetTop < self.options.limitFromTop + topBlockerHeight) {
        targetTop = self.options.limitFromTop + topBlockerHeight;
      }

      /* Offset for bottom element */
      let currentBottomContent = targetTop + self.outerHeight(false),
      currentTopFooter = self.options.bottomBlocker.offset().top - $(window).scrollTop()
      if (currentTopFooter - currentBottomContent < containerPaddingY) {
        targetTop -= (containerPaddingY - (currentTopFooter - currentBottomContent))
      }

      /* Position content */
      self.css({
        top: targetTop + 'px',
        left: targetLeft + 'px',
        width: targetWidth + 'px',
        height: 'auto',
        position: 'fixed',
      })
    }
  }

  self.destroy = function() {
    self.css({
      top: '',
      left: '',
      width: '',
      height: '',
      position: '',
    })
    self.scrollEvents.removeCallback(self.calculatePosition)
  }

  return function() {
    $.mlmi.mobile.addCallbacks(function() {
      self.scrollEvents.add(self.calculatePosition)
      self.calculatePosition()
    }, function() {
      if(self.options.mobile){
        self.scrollEvents.add(self.calculatePosition)
      }
      self.calculatePosition()
    })
    self.data('fixedContent', self)
    return self
  }()
}
