import { TRANSITION_END } from '../../../utils/animation'
import '../../../plugins/bem'

/*
* Navigation
*/
export default function (options) {

  /*
  *	Properties
  */
  let obj = this
  this.currentURL = undefined
  this.isLoading = false
  this.isPopping = false
  this.request = undefined

  if (options == undefined) {
    options = {}
  }

  /*
  * Options
  */
  this.options = $.extend(true, {
    init: true,
    useTransition: true,
    minTransitionTime: 0,
    useEvents: true,
    selectors: {
      pageTransition: '.page-transition',
      pageContent: '.app',
      pageTarget: '.app',
    },
    on: {
      beforeRegisterLinks: undefined,
      linkClicked: undefined,
      popState: undefined,
    },
    filter: {
      popState: undefined,
    }
  }, options)

  /*
  * Elements
  */
  this.el = {
    pageTransition: (this.options.useTransition) ? $(this.options.selectors.pageTransition).BlockElement() : undefined,
    pageTarget: $(this.options.selectors.pageTarget),
  }

  /*
  *	Page display
  */
  this.pageDisplay = function(targetURL, loadedContent) {
    // Display loaded page
    let response = $('<html>').html(loadedContent)
    obj.el.pageTarget.replaceWith($(obj.options.selectors.pageContent, response))
    obj.el.pageTarget = $(obj.options.selectors.pageTarget)
    requestAnimationFrame(function() {
      if (targetURL == obj.currentURL) {
        obj.isLoading = false
        obj.registerLinks()
        if (obj.options.useEvents) {
          $(window).trigger('page_load', [loadedContent])
        }
      }

      // Remove transition
      if (obj.options.useTransition) {
        obj.el.pageTransition.off(TRANSITION_END)
        requestAnimationFrame(function() {
          obj.el.pageTransition.addModifier('hidden').on(TRANSITION_END, function() {
            obj.el.pageTransition.off(TRANSITION_END).removeModifier('visible').removeModifier('hidden')
          })
        })
      }
    })

    // Push state
    if (!obj.isPopping) {
      document.title = $('title', response).text()
      let popState = {
        isPageTransition: true,
        previousPageURL: window.location.href,
      }
      if (obj.options.filter.popState != undefined) {
        popState = obj.options.filter.popState(popState)
      }
      window.history.pushState(popState, $('title', response).text(), obj.currentURL)
    }

    // Analytics called if available
    if ('gtag' in window) {
      if ('gtagid' in window) {
        gtag('config', window.gtagid, {
          'page_location': obj.currentURL,
        })
      } else {
        console.log('Erreur: définir le ID gtag pour mlmi-elements')
      }
    }
    obj.isPopping = false
  }

  /*
  *	Page transition
  */
  this.getPage = function(href, callback) {
    // Keep current URL
    obj.currentURL = href

    // Default callback
    if (callback == undefined) {
      callback = obj.pageDisplay
      obj.isUsingCustomCallback = true
    } else {
      obj.isUsingCustomCallback = false
    }

    // Setting variables
    let targetURL = href,
    loadedContent = undefined,
    pageHasDisappeared = false,
    contentHasLoaded = false

    // Cancel request
    if (obj.request != undefined) {
      obj.request.abort()
      obj.request = undefined
    }

    // Show page transition
    obj.isLoading = true
    if (obj.options.useTransition) {
      if (obj.el.pageTransition.hasModifier('visible') && !obj.el.pageTransition.hasModifier('hidden')) {
        pageHasDisappeared = true
      } else {
        obj.el.pageTransition.off(TRANSITION_END)
        requestAnimationFrame(function() {
          obj.el.pageTransition.removeModifier('hidden')
          requestAnimationFrame(function() {
            obj.el.pageTransition.addModifier('visible').on(TRANSITION_END, function(e) {
              if (obj.options.minTransitionTime && e.originalEvent.elapsedTime < obj.options.minTransitionTime) {
                return
              }
              $(this).off(TRANSITION_END)
              if (obj.options.useEvents) {
                $(window).trigger('page_exit')
              }
              pageHasDisappeared = true
              if (contentHasLoaded) {
                callback(targetURL, loadedContent)
              }
            })
          })
        })
      }
      obj.request = $.get(targetURL, {}, function(x) {
        loadedContent = x
        contentHasLoaded = true
        if (pageHasDisappeared) {
          callback(targetURL, loadedContent)
        }
        obj.request = undefined
      }, 'html').fail(function(x) {
        if (x.status == 404) {
          loadedContent = x.responseText
          contentHasLoaded = true
          if (pageHasDisappeared) {
            callback(targetURL, loadedContent)
          }
        }
      })
    } else {
      if (obj.options.useEvents) {
        $(window).trigger('page_exit')
      }
      obj.request = $.get(targetURL, {}, function(x) {
        loadedContent = x
        callback(targetURL, loadedContent)
        obj.request = undefined
      }, 'html').fail(function(x) {
        if (x.status == 404) {
          loadedContent = x.responseText
          callback(targetURL, loadedContent)
        }
      })
    }
  }

  /*
  * Register links
  */
  this.registerLinks = function() {
    if (obj.options.on.beforeRegisterLinks != undefined) {
      obj.options.on.beforeRegisterLinks()
    }
    $('a[target!="_blank"]').each(function() {
      if (!$(this).data('registeredTransitionLink')) {
        $(this).data('registeredTransitionLink', 1)
        if ($(this).attr('href') && $(this).attr('href').substr(0, 4) == 'http' && $(this).attr('href').indexOf(window.location.hostname) === -1) {
          $(this).attr('target', '_blank')
        }
        $(this).on('click', function(e) {
          if ($(this).attr('target') === '_blank') {
            return true
          }
          if ($(this).data('preventTransition') === 1) {
            return true
          }
          if (e.originalEvent != undefined && (e.originalEvent.cmdKey || e.originalEvent.metaKey)) { return true }
          let link = $(this).attr('href')
          if (link) {
            if (link.substr(0,7) === 'mailto:') { return true }
            if (link.substr(0,4) === 'tel:') { return true }
            if (link === '#') { return false }
            let ext = link.substr(link.lastIndexOf('.') + 1)
            if (ext) {
              if (['pdf', 'jpg', 'gif', 'png', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'txt', 'xml'].indexOf(ext) !== -1) { return true }
            }
            if (obj.options.on.linkClicked != undefined) {
              obj.options.on.linkClicked($(this))
            }
            obj.getPage(link)
            return false
          }
        })
      }
    })
  }

  /*
  * Initializer
  */
  this.init = function() {
    /* Pop state (back) */
    $(window).on('popstate', function(e) {
      let popState = e.originalEvent.state
      if (popState != null) {
        if (obj.options.on.popState != undefined) {
          obj.options.on.popState(e.target.location.href, popState)
        }
        if (popState.isPageTransition != null && popState.isPageTransition == true) {
          obj.isPopping = true
          obj.getPage(e.target.location.href)
        } else {
          location.href = e.target.location.href
          return true
        }
      }
    })

    /* Replace initial state (load) */
    if (!obj.el.pageTarget.data('no-transition')) {
      let popState = {
        isPageTransition: true,
        previousPageURL: window.location.href,
      }
      if (obj.options.filter.popState != undefined) {
        popState = obj.options.filter.popState(popState)
      }
      window.history.replaceState(popState, document.title, window.location.href)
    }

    /* First page load */
    if (obj.options.useEvents) {
      $(window).trigger('page_load')
    }

    /* Register links */
    obj.registerLinks()
  }

  /* Initialize and/or return */
  if (obj.options.init === true) {
    obj.init()
  }
  return obj
}
