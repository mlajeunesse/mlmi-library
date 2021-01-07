import { TRANSITION_END } from '../utils'
import '../plugins/scroll-to'

$.fn.Tab = function(tabset) {
  let tab = this
  tab.name = tab.attr('id').replace('tab-', '')
  tab.panel = tabset.find('.tabs__panel#panel-' + tab.name)

  tab.clicked = function() {
    tabset.select(tab)
  }

  return function() {
    tab.on('click', tab.clicked)
    tab.panel.on('focus', tab.clicked)
    return tab
  }()
}

$.fn.TabSet = function() {
  let tabset = this
  tabset.tabs = []
  tabset.current = undefined
  tabset.wrapper = tabset.find('.tabs__panels-list')
  tabset.timeout = undefined

  tabset.select = function(_tab) {
    if (_tab != tabset.current) {
      /* Prepare animation */
      tabset.wrapper.css('height', tabset.wrapper.outerHeight(false) + 'px')
      _tab.panel.prop('hidden', false)
      let targetHeight = _tab.panel.outerHeight()
      _tab.panel.prop('hidden', true)
      clearTimeout(tabset.timeout)

      /* Fade out former tab */
      let formerTab = tabset.current
      formerTab.attr('aria-selected', 'false')
      formerTab.panel.css({
        position: 'absolute',
        top: '0px',
        width: tabset.current.panel.outerWidth(),
      }).stop(true).fadeOut(250, function() {
        formerTab.panel.prop('hidden', true).attr('style', '')
      })

      /* Animate wrapper height */
      if (tabset.wrapper.outerHeight(false) != targetHeight) {
        tabset.wrapper.one(TRANSITION_END, function() {
          tabset.wrapper.off(TRANSITION_END).removeClass('transition').css('height', '')
        }).addClass('transition').css('height', targetHeight + 'px')
      }

      /* Add hash */
      window.location.hash = _tab.name

      /* Display new current tab */
      _tab.attr('aria-selected', 'true')
      tabset.current = _tab
      tabset.timeout = setTimeout(function() {
        tabset.current.panel.hide().prop('hidden', false).stop(true).fadeIn(450, 'swing', function() {
          tabset.current.panel.attr('style', '')
        })
      }, 150)
    }
  }

  tabset.stopAnimations = function() {
    clearTimeout(tabset.timeout)
    tabset.wrapper.stop(true).attr('style', '').removeClass('transition')
    tabset.tabs.forEach(function(tab) {
      tab.panel.stop(true).attr('style', '')
    })
  }

  return function() {
    /* Initialize tabs */
    tabset.find('.tabs__item').each(function() {
      let tab = $(this).Tab(tabset)
      tabset.tabs.push(tab)
      if (!tab.panel.prop('hidden')) {
        tabset.current = tab
      }
    })

    /* Hash navigation system */
    if (window.location.hash) {
      let target = tabset.find('#tab-' + window.location.hash.replace('#', ''))
      if (target.length) {
        target.click()
        $('body, html').scrollTo(target.offset().top, 0, 0)
      }
    }
    if ('history' in window) {
      $(window).on('popstate', function() {
        if (window.location.hash) {
          tabset.find('#tab-' + window.location.hash.replace('#', '')).click()
        } else {
          tabset.find('.tabs__item:first').click()
        }
      })
    }

    /* Stop animations on resize */
    $(window).on('resize orientationchange', tabset.stopAnimations)
    return tabset
  }()
}

export default {
  tabsets: [],

  init() {
    const self = this
    $('.tabs').each(function() {
      const tabset = $(this).TabSet()
      self.tabsets.push(tabset)
    })
  },
}
