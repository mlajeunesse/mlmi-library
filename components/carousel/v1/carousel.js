import Swiper, { Navigation, Pagination } from 'swiper'
import Mobile from '../../mobile/v1/mobile'

Swiper.use([Navigation, Pagination])

export default function(element, swiper_options, options) {
  let self = $(element)
  self.mobile = new Mobile()
  self.swiper = undefined
  self.options = $.extend(true, {
    mobile: true,
    desktop: true,
    groupItems: {
      slidesPerGroup: {
        mobile: false,
        desktop: false,
      },
      wrapperClass: 'slides-group',
    },
    forceRebuild: false,
    onBeforeInit: undefined,
    onInit: undefined,
    onKill: undefined,
    wrapperClass: 'swiper-wrapper',
    slideClass: 'swiper-slide',
  }, options)
  self.wrapper = self.find('.' + self.options.wrapperClass)
  self.slides = self.find('.' + self.options.slideClass)

  swiper_options = $.extend({
    threshold: 15,
    resistanceRatio: 0.25,
  }, swiper_options)

  self.initialize = function() {
    if (self.options.onBeforeInit != undefined) {
      self.options.onBeforeInit(self)
    }
    self.wrapper.addClass('swiper-wrapper')
    self.slides.addClass('swiper-slide')
    if (self.options.groupItems && self.getSlidesPerGroup()) {
      while (self.find('.' + self.options.wrapperClass + ' > .' + self.options.slideClass).length > 0) {
        self.find('.' + self.options.wrapperClass + ' > .' + self.options.slideClass + ':lt(' + self.getSlidesPerGroup() + ')').removeClass('swiper-slide').wrapAll($('<div class="' + self.options.groupItems.wrapperClass + '">'))
      }
      $('.' + self.options.groupItems.wrapperClass).addClass('swiper-slide')
    }
    self.swiper = new Swiper(element, swiper_options)
    if (self.options.onInit != undefined) {
      self.options.onInit(self)
    }
  }

  self.maybe_initialize = function() {
    if (self.swiper == undefined && ((self.options.desktop && !self.mobile.isMobile) || (self.options.mobile && self.mobile.isMobile))) {
      self.initialize()
    }
  }

  self.kill = function() {
    if (self.wrapper.length) {
      self.wrapper.removeClass('swiper-wrapper')
    }
    if (self.slides.length) {
      self.slides.removeClass('swiper-slide swiper-slide-duplicate-prev swiper-slide-duplicate-next swiper-slide-duplicate-active')
    }
    if (self.swiper != undefined) {
      self.swiper.destroy()
      self.swiper = undefined
    }
    if (self.options.groupItems) {
      if (self.find('.' + self.options.groupItems.wrapperClass).length) {
        self.slides.unwrap('.' + self.options.groupItems.wrapperClass)
      }
    }
    if (self.options.onKill != undefined) {
      self.options.onKill(self)
    }
  }

  self.toggle_mobile = function() {
    if (self.swiper != undefined && self.options.forceRebuild) {
      self.kill()
    }
    if (self.swiper == undefined && self.options.mobile) {
      self.initialize()
    } else if (!self.options.mobile) {
      self.kill()
    }
  }

  self.toggle_desktop = function() {
    if (self.swiper != undefined && self.options.forceRebuild) {
      self.kill()
    }
    if (self.swiper == undefined && self.options.desktop) {
      self.initialize()
    } else if (!self.options.desktop) {
      self.kill()
    }
  }

  self.getSlidesPerGroup = function() {
    if (self.options.groupItems && self.options.groupItems.slidesPerGroup) {
      if (typeof self.options.groupItems.slidesPerGroup === 'number') {
        return self.options.groupItems.slidesPerGroup
      } else if (self.mobile.isMobile) {
        return self.options.groupItems.slidesPerGroup.mobile ? self.options.groupItems.slidesPerGroup.mobile : false
      } else {
        return self.options.groupItems.slidesPerGroup.desktop ? self.options.groupItems.slidesPerGroup.desktop : false
      }
    }
    return false
  }

  self.init = function() {
    self.mobile.addCallbacks(self.toggle_mobile, self.toggle_desktop)
  }
  return self
}
