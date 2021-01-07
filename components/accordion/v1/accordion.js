import 'jquery-accessible-accordion-aria'

const INITIAL_MAX_HEIGHT = 100

export default {
  init() {
    $('.js-accordion').each(function() {
      let accordion = $(this)
      accordion.accordion({
        buttonsGeneratedContent: 'html',
        multiselectable: $(this).data('multiselectable') ? true : false,
      })
      accordion.find('.accordion__header').on('click', function() {
        accordion.find('.accordion__panel').each(function() {
          let accordionPanel = $(this)

          accordionPanel.sizer = function() {
            let textContent = accordionPanel.find('.accordion__panel-content')
            let outerHeight = textContent.outerHeight(false)
            accordionPanel.css('max-height', outerHeight > INITIAL_MAX_HEIGHT ? outerHeight + 'px' : '')
          }

          $(window).on('resize load orientationchange', accordionPanel.sizer)
          accordionPanel.sizer()
        })
      })
    })
  },
}
