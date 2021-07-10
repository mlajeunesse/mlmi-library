import '../../select/v1/select'
import '../../floating-label/v1/floating-label'
import DatePickerFactory from 'jquery-datepicker'
import DatePickerFactoryFR from 'jquery-datepicker/i18n/jquery.ui.datepicker-fr'

$.fn.Form = function(obj) {
  let self = this
  if (self.data('form')) {
    return self
  }
  self.action = self.find('input[name="action"]').val()
  self.fields = {}
  self.repeaters = {}
  self.el = {
    inputs: self.find(':input:not(.repeater-container :input)'),
    fields: self.find('.field:not(.repeater-container .field)'),
    submit: self.find('[type="submit"]'),
  }

  self.get_form_data = function() {
    let data = new FormData()
    for (let fieldName in self.fields) {
      let formValue = self.get_form_value(fieldName)
      if (Array.isArray(formValue)) {
        let strippedName = fieldName.replace('[]', '')
        formValue.forEach(function(singleValue) {
          data.append(strippedName + '[]', singleValue)
        })
      } else {
        data.append(fieldName, formValue)
      }
    }
    for (let fieldName in self.repeaters) {
      let repeaterField = self.repeaters[fieldName]
      data.append(fieldName, JSON.stringify(repeaterField.get_repeater_value()))
    }
    return data
  }

  self.get_form_value = function(fieldName) {
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
      return values
    } else if (field.attr('type') == 'file') {
      let fileInfo = field.get(0).files[0]
      if (fileInfo == undefined) {
        fileInfo = ''
      }
      return fileInfo
    } else if (field.attr('type') == 'number') {
      let numericValue = parseInt(field.val(), 10)
      return isNaN(numericValue) ? '' : numericValue
    }
    return field.val()
  }

  self.handle_submit = function(e) {
    e.preventDefault()
    self.el.fields.addClass('field--disabled')
    self.el.submit.prop('disabled', true)
    self.el.inputs.prop('disabled', true)
    if (obj.options.blocked_class) {
      self.addClass(obj.options.blocked_class)
    }
    self.addClass('--submitting')
    $('.field--invalid').removeClass('field--invalid')
    $('.field-error, .form-error').slideUp(180, function() {
      $(this).remove()
    })
    $.ajax({
      url: obj.options.ajax_url,
      type: 'POST',
      enctype: self.attr('enctype') ? self.attr('enctype') : 'text/plain',
      data: self.get_form_data(),
      processData: false,
      contentType: false,
      cache: false,
      success: self.handle_response,
    })
    if (obj.options.onSubmit != undefined) {
      obj.options.onSubmit()
    }
  }

  self.handle_response = function(response) {
    self.removeClass('--submitting')
    if (response.success) {
      self.handle_success(response)
    } else {
      self.handle_error(response)
    }
  }

  self.handle_success = function(response) {
    if (obj.options.ajax_redirect && response.redirect) {
      location.href = response.redirect
    } else if (obj.options.onSuccess != undefined) {
      obj.options.onSuccess(response)
    }
  }

  self.handle_error = function(response) {
    self.enable_fields()
    if (response.error != undefined) {
      self.prepend($(response.error))
    }
    for (let fieldName in response.errors) {
      let input = self.fields[fieldName],
      field = $(input).parents('.field').addClass('field--invalid')
      if (field.length) {
        field.after($(response.errors[fieldName]))
      } else {
        self.find('.field-container--' + fieldName).append($(response.errors[fieldName]))
      }
    }
    if (obj.options.auto_scroll) {
      let windowTarget = $('.form-error, .field--invalid').offset().top - obj.options.auto_scroll_offset
      if ($(window).scrollTop() > windowTarget) {
        $('html, body').animate({
          scrollTop: windowTarget + 'px',
        }, 450)
      }
    }
    if ('grecaptcha' in window) {
      grecaptcha.reset()
      $('input[name="recaptcha"]').val('')
    }
    if (obj.options.onError != undefined) {
      obj.options.onError(response)
    }
  }

  self.enable_fields = function() {
    self.el.fields.removeClass('field--disabled')
    self.el.inputs.prop('disabled', false)
    self.el.submit.prop('disabled', false)
    if (obj.options.blocked_class) {
      self.removeClass(obj.options.blocked_class)
    }
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
    /* Called first to detach template */
    if (obj.options.repeater_field) {
      self.find('.repeater-container').each(function() {
        let repeater = $(this).RepeaterField(obj)
        self.repeaters[repeater.name] = repeater
      })
    }
    if (obj.options.use_ajax) {
      self.on('submit', self.handle_submit)
    }
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
    self.data('form', self)
    return self
  }()
}

export default function (selector, options) {
  let obj = this
  obj.form = undefined

  /*
  * Default options
  */
  if (selector == undefined) {
    selector = 'form'
  }
  if (options == undefined) {
    options = {}
  }
  obj.options = $.extend({
    locale: 'fr',
    use_ajax: true,
    ajax_url: '/wp/wp-admin/admin-ajax.php',
    ajax_redirect: true,
    fields_selector: ':input',
    auto_scroll: true,
    auto_scroll_offset: 30,
    blocked_class: false,
    floating_labels: false,
    select_element: true,
    repeater_field: false,
    date_picker: false,
    onSubmit: undefined,
    onSuccess: undefined,
    onError: undefined,
  }, options)

  /*
  * Initializer
  */
  $(selector).each(function() {
    obj.form = $(this).Form(obj)
  })

  obj.getForm = function() {
    return obj.form
  }

  return obj
}
