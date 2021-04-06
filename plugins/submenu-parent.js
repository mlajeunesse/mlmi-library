import Mobile from '../modules/mobile/v1/mobile'

$.fn.SubMenuParent = function(options) {
  let self = this
  self.mouseHasEntered = false
  self.preventClick = false
  self.mobile = new Mobile()
  self.options = $.extend(true, {
    mobile: true,
    desktop: true,
  }, options)

  self.mouse_entered = function() {
    if (!self.mouseHasEntered) {
      self.mouseHasEntered = true
    }
  }

  self.mouse_left = function() {
    self.mouseHasEntered = false
  }

  self.touch_start = function() {
    let preventNextClick = !self.mouseHasEntered
    if ((!self.options.mobile && self.mobile.isMobile) || (!self.options.desktop && !self.mobile.isMobile)) {
      preventNextClick = false
    }
    self.preventClick = preventNextClick
  }

  self.clicked = function(e) {
    if (self.preventClick) {
      e.preventDefault()
      self.preventClick = false
    }
  }

  return function() {
    self.on('touchstart', self.touch_start)
    self.on('mouseenter', self.mouse_entered)
    self.on('mouseleave', self.mouse_left)
    self.on('click', self.clicked)
    return self
  }()
}
