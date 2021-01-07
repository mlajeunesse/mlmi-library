/*
* Floating label
*/
$.fn.FloatingLabel = function() {
  let self = this
  if (self.data('floatingLabel')) {
    return self.data('floatingLabel')
  }
  self.label = self.find('.field__label')
  self.field = self.find('.field__input')
  self.is_empty = self.field.val() == ''

  self.check = function() {
    if (self.field.val()) {
      self.removeClass('field--empty').addClass('field--populated')
      self.is_empty = false
    } else {
      self.removeClass('field--populated').addClass('field--empty')
      self.is_empty = true
    }
  }

  self.focused = function() {
    self.addClass('field--focused')
  }

  self.blurred = function() {
    self.removeClass('field--focused')
  }

  return function() {
    self.field.on('change keypress keydown keyup', self.check)
    self.field.on('focus', self.focused)
    self.field.on('blur', self.blurred)
    $(window).on('load', self.check)
    self.check()
    self.data('floatingLabel', self)
    return self
  }()
}
