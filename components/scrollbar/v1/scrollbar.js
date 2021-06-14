import Mobile from '../../../modules/mobile/v1/mobile'
import '../../../modules/scroll-events/v1/scroll-events'
import '../../../plugins/bem'
import 'jquery-ui/ui/widgets/draggable'
import 'jquery-ui-touch-punch'

/*
* DOM Scrollbar
*/
export default function (selector, options)
{
  let obj = this
  obj.selector = selector
  obj.scrollers = []
  obj.mobileChecker = new Mobile()

  /*
  * Options
  */
  obj.options = $.extend({
    direction: 'vertical',
    desktop: true,
    mobile: true,
  }, options)

	/*
	*	Get browser scrollbar size utility
	*/
	obj.getBrowserScrollbarSize = function() {
		let css = {
			height:		'200px',
			width:		'200px',
			margin:		'0',
			padding:	'0',
  		border:		'none',
		},
		inner = $('<div>').css($.extend({}, css)),
		outer = $('<div>').css($.extend({
      position:	'absolute',
			left:		'-1000px',
			top:		'-1000px',
			overflow:	'scroll',
		}, css)).append(inner).appendTo('body').scrollLeft(1000).scrollTop(1000),
		scrollSize = {
			height:		(outer.offset().top - inner.offset().top) || 0,
			width:		(outer.offset().left - inner.offset().left) || 0
		}
		outer.remove()
		return scrollSize
	}

	/*
	*	Scrollbar jQuery plugin
	*/
	$.fn.MLMI_Scrollbar = function(_scroller, _options) {
		let _bar = this
		_bar.options = _options
		_bar.scroller = _scroller
		_bar.el = {
			thumb: undefined
		}
		_bar.status = {
			dragging: false
		}
		_bar.active_timeout = undefined

		_bar.dragging = function() {
      if (_bar.options.direction == 'vertical') {
				let targetPercentage = parseFloat(_bar.el.thumb.css('top')) / _bar.getScrollableSize()
				if (targetPercentage < 0) targetPercentage = 0
				if (targetPercentage > 1) targetPercentage = 1
				_bar.scroller.setScrollPercentage(targetPercentage)
			} else if (_bar.options.direction == 'horizontal') {
				let targetPercentage = parseFloat(_bar.el.thumb.css('left')) / _bar.getScrollableSize()
				if (targetPercentage < 0) targetPercentage = 0
				if (targetPercentage > 1) targetPercentage = 1
				_bar.scroller.setScrollPercentage(targetPercentage)
			}
		}

		_bar.start = function() {
			_bar.status.dragging = true
			_bar.addModifier('active').addModifier('dragging')
		}

		_bar.stop = function() {
			_bar.status.dragging = false
			_bar.removeModifier('active').removeModifier('dragging')
		}

		_bar.getScrollableSize = function() {
      let scrollableSize = 0
      if (_bar.options.direction == 'vertical') {
        scrollableSize = _bar.height() - _bar.el.thumb.height()
      } else if (_bar.options.direction == 'horizontal') {
        scrollableSize = _bar.width() - _bar.el.thumb.width()
      }
			return scrollableSize
		}

		_bar.setScrollPercentage = function(_percentage) {
      if (_bar.options.direction == 'vertical') {
        _bar.el.thumb.css({
  				top: Math.ceil(_percentage * _bar.getScrollableSize())
  			})
      } else if (_bar.options.direction == 'horizontal') {
        _bar.el.thumb.css({
  				left: Math.ceil(_percentage * _bar.getScrollableSize())
  			})
      }

			// active scrollbar
			if (_bar.active_timeout != undefined) {
				clearTimeout(_bar.active_timeout)
			}
			_bar.addModifier('active')
			_bar.active_timeout = setTimeout(function() {
				_bar.removeModifier('active')
			}, 500)
		}

		_bar.setVisiblePercentage = function(_percentage) {
      if (_bar.options.direction == 'vertical') {
        _bar.el.thumb.css({
  				height: (_percentage * 100) + '%'
  			})
      } else if (_bar.options.direction == 'horizontal') {
        _bar.el.thumb.css({
  				width: (_percentage * 100) + '%'
  			})
      }
		}

    _bar.kill = function() {
      _bar.remove()
    }

		return function() {
			// default options
			if (_bar.options == undefined) _bar.options = {}
			if (!_bar.options.hasOwnProperty('direction')) _bar.options.direction = 'vertical'
			if (!_bar.options.hasOwnProperty('size')) _bar.options.size = 'auto'

			// create elements
			_bar.el.thumb = _bar.addElement('thumb')
			_bar.append(_bar.el.thumb)
			_bar.scroller.append(_bar)
			$(_bar.el.thumb).draggable({
				axis: _bar.options.direction == 'horizontal' ? 'x' : 'y',
				containment: _bar,
				start: _bar.start,
				drag: _bar.dragging,
				stop: _bar.stop
			})

			// scrollbar object
			return _bar
		}()
	}

	/*
	*	Scroller jQuery plugin
	*/
	$.fn.MLMI_Scroller = function(options) {
		let self = this
		self.options = options
    self.scrollEvents = undefined

		self.el = {
			scroller: undefined,
			scrollbar: undefined
		}

		self.prop = {
			paddingTop: 0,
			paddingRight: 0,
			paddingBottom: 0,
			paddingLeft: 0,
			scrollbarWidth: obj.getBrowserScrollbarSize().width,
		}

		self.status = {
			isScrollable: false,
			timeout_resize: undefined
		}

		self.sizes = function() {
			// reset forced padding 0
			self.removeClass('scroller__container')

			// get initial properties
			self.prop.paddingTop = parseFloat(self.css('paddingTop'))
			self.prop.paddingRight = parseFloat(self.css('paddingRight'))
			self.prop.paddingBottom = parseFloat(self.css('paddingBottom'))
			self.prop.paddingLeft = parseFloat(self.css('paddingLeft'))

			// create scroller
      let scrollerStyles = {
				paddingTop: self.prop.paddingTop,
        paddingRight: self.prop.paddingRight,
        paddingBottom: self.prop.paddingBottom,
				paddingLeft: self.prop.paddingLeft,
			}
      if (self.options.direction == 'vertical') {
        scrollerStyles.width = 'calc(100% + ' + self.options.spacing + 'px)'
        scrollerStyles.paddingRight = self.prop.paddingRight + self.options.spacing - self.prop.scrollbarWidth
      } else if (self.options.direction == 'horizontal') {
        scrollerStyles.height = 'calc(100% + ' + self.options.spacing + 'px)'
        scrollerStyles.paddingBottom = self.prop.paddingBottom + self.options.spacing - self.prop.scrollbarWidth
      }
			self.el.scroller.css(scrollerStyles)

			// add container forced padding to 0
			self.addClass('scroller__container')

			// check if scrollbar is needed
			if (self.el.scrollbar != undefined) {
        if (self.options.direction == 'vertical' && Math.ceil(self.el.scroller.get(0).scrollHeight) > Math.ceil(self.el.scroller.outerHeight(false))) {
					self.status.isScrollable = true
					self.addClass('is-scrollable')
					self.el.scrollbar.show()
					self.el.scrollbar.setVisiblePercentage(self.el.scroller.outerHeight(false) / self.el.scroller.get(0).scrollHeight)
					self.trigger('scrollable', ['on'])
				} else if (self.options.direction == 'horizontal' && Math.ceil(self.el.scroller.get(0).scrollWidth) > Math.ceil(self.el.scroller.outerWidth(false))) {
					self.status.isScrollable = true
					self.addClass('is-scrollable')
					self.el.scrollbar.show()
					self.el.scrollbar.setVisiblePercentage(self.el.scroller.outerWidth(false) / self.el.scroller.get(0).scrollWidth)
					self.trigger('scrollable', ['on'])
				} else {
					self.status.isScrollable = false
					self.removeClass('is-scrollable')
					self.el.scrollbar.hide()
					self.trigger('scrollable', ['off'])
				}
			}
		}

		self.addScrollbar = function(options) {
			self.el.scrollbar = self.el.scroller.addElement('scrollbar').MLMI_Scrollbar(self, options)
      self.scrollEvents = self.el.scroller.ScrollEvents()
      self.scrollEvents.add(self.scrolled)
			self.sizes()
			self.scrolled()
			return self
		}

		self.setScrollPercentage = function(_scroll_percentage) {
      if (self.options.direction == 'vertical') {
        self.el.scroller.scrollTop((self.el.scroller.get(0).scrollHeight - self.el.scroller.outerHeight(false)) * _scroll_percentage)
      } else if (self.options.direction == 'horizontal') {
        self.el.scroller.scrollLeft((self.el.scroller.get(0).scrollWidth - self.el.scroller.outerWidth(false)) * _scroll_percentage)
      }
		}

		self.scrolled = function(top) {
			if (!self.el.scrollbar.status.dragging) {
        let targetPercentage
        if (self.options.direction == 'vertical') {
          targetPercentage = self.el.scroller.scrollTop() / (self.el.scroller.get(0).scrollHeight - self.el.scroller.outerHeight(false))
        } else if (self.options.direction == 'horizontal') {
          targetPercentage = self.el.scroller.scrollLeft() / (self.el.scroller.get(0).scrollWidth - self.el.scroller.outerWidth(false))
        }
				if (targetPercentage < 0) targetPercentage = 0
				if (targetPercentage > 1) targetPercentage = 1
        if (top != undefined) {
  				self.el.scrollbar.setScrollPercentage(targetPercentage)
        }
			}
		}

		self.isScrollable = function() {
			return self.status.isScrollable
		}

    self.resizeTimeout = function() {
      clearTimeout(self.status.timeout_resize)
      self.status.timeout_resize = setTimeout(function() {
        if (self.el.scroller != undefined) {
          self.sizes()
        }
      }, self.options.resize_delay)
    }

    self.kill = function() {
      self.el.scrollbar.kill()
      self.el.scrollbar = undefined
			$(window).off('load resize orientationchange', self.resizeTimeout)
			self.removeClass('scroller__container is-scrollable')
      self.prepend(self.el.scroller.contents())
      self.el.scroller.remove()
      self.el.scroller = undefined
    }

		return function() {
			// default options
			if (self.options == undefined) self.options = {}
			if (!self.options.hasOwnProperty('spacing')) self.options.spacing = 60
			if (!self.options.hasOwnProperty('resize_delay')) self.options.resize_delay = 60

			// create scroller html structure
			self.el.scroller = $('<div></div>').BlockElement('scroller')
      self.el.scroller.addModifier(self.options.direction)
			self.sizes()
			self.el.scroller.append(self.contents())
			self.append(self.el.scroller)

			// resize element
			$(window).on('load resize orientationchange', self.resizeTimeout)

			// scroller object
			return self
		}()
	}

  /* Update scrollbars */
  obj.update = function() {
    obj.scrollers.forEach(function(scroller) {
      scroller.sizes()
    })
  }

  /* Kill scrollbars */
  obj.kill = function(kill_mobile) {
    if (kill_mobile == undefined) {
      kill_mobile = false
    }
    obj.scrollers.forEach(function(scroller) {
      scroller.kill()
    })
    obj.scrollers = []
    if (kill_mobile) {
      obj.mobileChecker.kill()
    }
  }

	/* Initialize */
  obj.init = function() {
    obj.mobileChecker.addCallbacks(function() {
      if (obj.options.mobile) {
        $(selector).each(function() {
          let scroller = $(this).MLMI_Scroller(obj.options).addScrollbar(obj.options)
      		obj.scrollers.push(scroller)
      	})
      } else {
        obj.kill()
      }
    }, function() {
      if (obj.options.desktop) {
        $(selector).each(function() {
          let scroller = $(this).MLMI_Scroller(obj.options).addScrollbar(obj.options)
      		obj.scrollers.push(scroller)
      	})
      } else {
        obj.kill()
      }
    })
  }

  if ($(selector).length) {
    obj.init()
  }
  return obj
}
