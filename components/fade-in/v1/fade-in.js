import Mobile from '../../../modules/mobile/v1/mobile'
import '../../../scroll-events/v1/scroll-events'

/*
*	Fade in elements
*/
$.fn.FadeIn = function() {
  var self = this
  self.scrollChecker = $(window).ScrollEvents()
  self.mobileChecker = new Mobile()
  self.delay = self.mobileChecker.isMobile ? 0 : parseFloat(self.data("delay"))
  self.type = undefined
  self.revealed = false

  self.getType = function() {
    let type = 'fade-in'
    if (self.hasClass('slide-in')) {
      type = 'slide-in'
    }
    return type
  }

  self.inView = function() {
    let windowHeight = Math.max($(window).height(), window.innerHeight)
    return $(window).scrollTop() + windowHeight > self.offset().top
  }

  self.scrolled = function() {
    if (!self.revealed && self.inView()) {
      self.revealed = true
      setTimeout(function(){
        self.addClass(self.type + "--visible")
      }, self.delay * 1000)
    }
  }

  return function() {
    if (isNaN(self.delay)){
      self.delay = 0
    }
    self.type = self.getType()
    if (self.type == 'fade-in' && !self.inView()) {
      self.removeClass('fade-in').addClass('slide-in')
      self.type = 'slide-in'
      let childIndex = 0
    }
    setTimeout(function() {
      self.addClass(self.type + "--active")
      self.scrollChecker.add(self.scrolled)
      self.scrolled()
    }, 250)
    return self
  }()
}
