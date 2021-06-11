$.fn.RepeaterField = function(obj) {
  let self = this
  self.el = {
    template: self.find('.repeater-container__fieldset').detach(),
    fields: $('<div>').addClass('repeater-container__fields'),
    add_btn: self.find('.repeater-container__add-btn'),
  }

  self.add = function() {
    let fieldset = self.el.template.clone().css('display', 'flex')

    /* Initialize component fields from form options */
    if (obj != undefined) {
      if (obj.options.floating_labels === true) {
        fieldset.find('.field').each(function() {
          $(this).FloatingLabel()
        })
      } else if (obj.options.floating_labels) {
        fieldset.find(obj.options.floating_labels).each(function() {
          $(this).FloatingLabel()
        })
      }
      if (obj.options.select_element) {
        fieldset.find('.field select').each(function() {
          $(this).Select()
        })
      }
      if (obj.options.date_picker) {
        obj.options.date_picker = $.extend({
          dateFormat: "yy-mm-dd",
          nextText: '▶',
          prevText: '◀',
        }, obj.options.date_picker)
        DatePickerFactory($)
        fieldset.find('.field--type-date_picker input').each(function() {
          $(this).datepicker(obj.options.date_picker)
          if (obj.options.locale == 'fr') {
            DatePickerFactoryFR($)
            $.datepicker.regional['fr']
          }
        })
      }
    }

    self.el.fields.append(fieldset)
  }

  return function() {
    self.prepend(self.el.fields)
    self.el.template.hide()
    self.el.add_btn.on('click', self.add)
    self.add()
    return self
  }()
}
