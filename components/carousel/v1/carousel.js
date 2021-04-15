import Swiper, { Navigation, Pagination, Scrollbar, Mousewheel } from 'swiper'
import Mobile from '../../../modules/mobile/v1/mobile'

Swiper.use([Navigation, Pagination, Scrollbar, Mousewheel])

export default function Carousel(element, swiper_options, options) {
  let self = $(element)
  self.data('carousel', self)
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
    self.addClass('swiper-container')
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
    self.removeClass('swiper-container')
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
    self.wrapper.css('height', '')
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
    self.wrapper.css('height', '')
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
    if (self.slides.length > 1) {
      self.mobile.addCallbacks(self.toggle_mobile, self.toggle_desktop)
    }
  }

  return self
}

function getCarouselGutterWidth(carousel) {
  let gutterSizer = $('<div>').addClass('carousel-gutter-sizer').appendTo(carousel),
  gutterSize = gutterSizer.outerWidth(false)
  gutterSizer.remove()
  return gutterSize
}

export function Carousel_CoreInit() {
  $('.carousel').each(function() {
    let self = $(this)
    let coreOptions = self.data('carousel'),
    heightOptions = self.data('height'),
    swiperOptions = {
      direction: 'horizontal',
      loop: $.inArray('loop', coreOptions) !== -1 ? true : false,
      simulateTouch: $.inArray('simulate_touch', coreOptions) !== -1 ? true : false,
      spaceBetween: getCarouselGutterWidth(self),
      mousewheel: $.inArray('mousewheel', coreOptions) !== -1 ? {releaseOnEdges: true} : false,
      slideToClickedSlide: $.inArray('slideToClickedSlide', coreOptions) !== -1 ? true : false,
      updateOnWindowResize: $.inArray('updateOnWindowResize', coreOptions) !== -1 ? true : false,
      breakpoints: {
        0: {
          slidesPerView: 1,
        },
        768: {
          slidesPerView: self.data('columns'),
        }
      }
    }
    if ($.inArray('use_bullets', coreOptions) !== -1) {
      swiperOptions.pagination = {
        el: self.find('.carousel__toolbar .swiper-pagination').get(0),
        type: 'bullets',
        clickable: true,
      }
    }
    if ($.inArray('use_arrows', coreOptions) !== -1) {
      swiperOptions.navigation = {
        prevEl: self.find('.carousel__toolbar .swiper-button-prev').get(0),
        nextEl: self.find('.carousel__toolbar .swiper-button-next').get(0),
      }
    }
    if ($.inArray('use_scrollbar', coreOptions) !== -1) {
      swiperOptions.loop = false
      swiperOptions.scrollbar = {
        el: self.find('.carousel__toolbar .swiper-scrollbar').get(0),
        draggable: true,
      }
    }
    if (heightOptions == 'auto-height') {
      swiperOptions.autoHeight = true
    } else if (heightOptions == 'auto-height-sm') {
      swiperOptions.breakpoints[0].autoHeight = true
      swiperOptions.breakpoints[768].autoHeight = false
    } else if (heightOptions == 'auto-height-md') {
      swiperOptions.breakpoints[0].autoHeight = false
      swiperOptions.breakpoints[768].autoHeight = true
    }
    let carouselOptions = {
      mobile: self.data('carousel-sm') ? true : false,
      desktop: self.data('carousel-md') ? true : false,
      wrapperClass: 'carousel__wrapper',
      slideClass: 'carousel__slide',
    }
    let carousel = new Carousel(self.get(0), swiperOptions, carouselOptions)
    carousel.init()
  })
}
