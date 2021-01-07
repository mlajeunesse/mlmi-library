/*
*	Burger
*/

export default function (selector, options) {
  let obj = this
  this.burger = undefined
  this.isExpanded = false

  /*
  * Options
  */
  this.options = $.extend({
    navigation: '#navigation',
    onToggle: undefined,
  }, options)

  $.fn.Burger = function() {
    let self = this
    self.navigation = $(obj.options.navigation)

    self.clicked = function() {
      if (self.attr('aria-expanded') == 'false') {
        self.attr('aria-expanded', 'true')
      } else {
        self.attr('aria-expanded', 'false')
      }
      obj.isExpanded = (self.attr('aria-expanded') == 'true')
      self.trigger('burger_clicked')
    }

    self.maybe_close = function() {
      if (self.attr('aria-expanded') == 'true') {
        self.attr('aria-expanded', 'false')
      }
    }

    return function() {
      self.on('click', self.clicked)
      obj.isExpanded = (self.attr('aria-expanded') == 'true')
      return self
    }()
  }

  /* Initializer */
	$(selector).each(function() {
    obj.burger = $(this).Burger()
    obj.burger.on('burger_clicked', function() {
      if (obj.options.onToggle != undefined) {
        obj.options.onToggle()
      }
    })
	})

  obj.click = function() {
    $(selector).click()
  }

  obj.maybe_close = function() {
    if (obj.burger != undefined) {
      obj.burger.maybe_close()
    }
  }

  return obj
}
