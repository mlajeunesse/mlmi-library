import '../../select/v1/select'
import '../../floating-label/v1/floating-label'
import DatePickerFactory from 'jquery-datepicker'
import DatePickerFactoryFR from 'jquery-datepicker/i18n/jquery.ui.datepicker-fr'

$.fn.RepeaterFieldset = function(obj, repeater) {
  let self = this
  if (self.data('fieldset')) {
    return self.data('fieldset')
  }
  self.fields = {}
  self.el = {
    inputs: self.find(':input'),
  }
  self.removeButton = repeater.el.remove_btn.clone()

  self.get_field_values = function() {
    let values = {}
    for (var fieldName in self.fields) {
      let field = self.fields[fieldName]
      if (Array.isArray(field)) {
        let values = []
        field.forEach(function(element) {
          if (element.attr('type') == 'checkbox' && element.closest('.field').hasClass('field--type-true_false')) {
            values = element.prop('checked') ? element.val() : 0
          } else if (element.attr('type') == 'radio' && element.prop('checked')) {
            values = element.val()
          } else if (element.attr('type') == 'checkbox' && element.prop('checked')) {
            values.push(element.val())
          }
        })
        values[fieldName] = values
      } else if (field.attr('type') == 'file') {
        let fileInfo = field.get(0).files[0]
        if (fileInfo == undefined) {
          fileInfo = ''
        }
        values[fieldName] =  fileInfo
      } else if (field.attr('type') == 'number') {
        let numericValue = parseInt(field.val(), 10)
        values[fieldName] = isNaN(numericValue) ? '' : numericValue
      } else {
        values[fieldName] = field.val()
      }
    }
    return values
  }

  return function() {
    self.el.inputs.each(function() {
      if ($(this).attr('type') == 'radio' || $(this).attr('type') == 'checkbox') {
        if (self.fields[$(this).attr('name')] == undefined) {
          self.fields[$(this).attr('name')] = []
        }
        self.fields[$(this).attr('name')].push($(this))
      } else if ($(this).attr('name')) {
        self.fields[$(this).attr('name')] = $(this)
      }
    })
    if (obj != undefined) {
      if (obj.options.floating_labels === true) {
        self.find('.field').each(function() {
          $(this).FloatingLabel()
        })
      } else if (obj.options.floating_labels) {
        self.find(obj.options.floating_labels).each(function() {
          $(this).FloatingLabel()
        })
      }
      if (obj.options.select_element) {
        self.find('.field select').each(function() {
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
        self.find('.field--type-date_picker input').each(function() {
          $(this).datepicker(obj.options.date_picker)
          if (obj.options.locale == 'fr') {
            DatePickerFactoryFR($)
            $.datepicker.regional['fr']
          }
        })
      }
    }
    self.removeButton.on('click', function() {
      self.fadeOut(250, function() {
        self.remove()
      })
    })
    self.append(self.removeButton.show())
    self.data('fieldset', self)
    return self
  }()
}

$.fn.RepeaterField = function(obj) {
  let self = this
  self.name = self.attr('data-repeater-name')
  self.el = {
    template: self.find('.repeater-container__fieldset').detach(),
    fields: $('<div>').addClass('repeater-container__fields'),
    add_btn: self.find('.repeater-container__add-btn'),
    remove_btn: self.find('.repeater-container__remove-btn'),
  }

  self.add = function() {
    let fieldset = self.el.template.clone().RepeaterFieldset(obj, self)
    fieldset.css('display', 'flex').hide()
    self.el.fields.append(fieldset.fadeIn(250))
  }

  self.get_repeater_value = function() {
    let repeater_values = []
    self.find('.repeater-container__fieldset').each(function() {
      let fieldset = $(this).data('fieldset')
      repeater_values.push(fieldset.get_field_values())
    })
    return repeater_values
  }

  return function() {
    self.prepend(self.el.fields)
    self.el.template.hide()
    self.el.add_btn.on('click', self.add)
    self.add()
    return self
  }()
}
