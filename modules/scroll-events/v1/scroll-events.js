/*
* Scroll events manager
*/
$.fn.ScrollEvents = function() {
  let self = this
  self.callbacks = []
  self.requested = false

  self.add = function(callback) {
    self.addCallback(callback)
  }

  self.addCallback = function(callback) {
    if (callback != undefined) {
      self.callbacks.push(callback)
    }
  }

  self.removeCallback = function(callback) {
    if (callback != undefined) {
      let index = self.callbacks.length
      for (let i = index - 1; i >= 0; i--) {
        if (self.callbacks[i] == callback) {
          self.callbacks.splice(i, 1)
        }
      }
    }
  }

  self.scrolled = function() {
    if (self.requested) {
      return
    }
    self.requested = true
    requestAnimationFrame(function() {
      self.callbacks.forEach(function(callback) {
        callback(self.scrollTop())
      })
      self.requested = false
    })
  }

  self.kill = function() {
    self.off('scroll load orientationchange resize', self.scrolled)
  }

  return function() {
    self.on('scroll load orientationchange resize', self.scrolled)
    return self
  }()
}
