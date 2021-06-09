/*
*	BlockElement
*/
$.fn.BlockElement = function(mainClass) {
	let self = this
  if (self.data('BlockElement')) {
    return self.data('BlockElement')
  }
	self.mainClass = mainClass

	/* Add child element */
	self.addElement = function(elementClass, element) {
		if (element == undefined) {
      element = 'div'
    }
		var newBlockElement = $('<' + element + '>').BlockElement(self.mainClass + '__' + elementClass)
		return newBlockElement
	}

	/* Add a modifier */
	self.addModifier = function(modifiers) {
    modifiers.split(' ').forEach(function(modifier) {
      self.addClass(self.mainClass + '--' + modifier)
    })
		return self
	}

	/* Remove a modifier */
	self.removeModifier = function(modifiers) {
    modifiers.split(' ').forEach(function(modifier) {
      self.removeClass(self.mainClass + '--' + modifier)
    })
		return self
	}

  /* Has a modifier */
  self.hasModifier = function(modifier) {
		return self.hasClass(self.mainClass + '--' + modifier)
	}

	return function() {
		if (self.mainClass == undefined){
			self.mainClass = self.attr('class').split(' ')[0]
		}
		self.addClass(self.mainClass)
    self.data('BlockElement', self)
		return self
	}()
}
