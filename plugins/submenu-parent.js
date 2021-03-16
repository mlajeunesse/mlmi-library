$.fn.SubMenuParent = function() {
  let self = this
  self.mouseHasEntered = false
  self.preventClick = false

  self.mouse_entered = function() {
    if (!self.mouseHasEntered) {
      self.mouseHasEntered = true
    }
  }

  self.mouse_left = function() {
    self.mouseHasEntered = false
  }

  self.touch_start = function() {
    self.preventClick = !self.mouseHasEntered
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
