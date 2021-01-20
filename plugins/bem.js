/*
*	BlockElement
*/
$.fn.BlockElement = function(_mainClass) {
	let self = this
	self.mainClass = _mainClass

	/* Add child element */
	self.addElement = function(elementClass, element) {
		if (element == undefined) {
      element = 'div'
    }
		var newBlockElement = $('<' + element + '>').BlockElement(self.mainClass + '__' + elementClass)
		return newBlockElement
	}

	/* Add a modifier */
	self.addModifier = function(modifier) {
		self.addClass(self.mainClass + '--' + modifier)
		return self
	}

  /* Has a modifier */
  self.hasModifier = function(modifier) {
		return self.hasClass(self.mainClass + '--' + modifier)
	}

	/* Remove a modifier */
	self.removeModifier = function(modifier) {
		self.removeClass(self.mainClass + '--' + modifier)
		return self
	}

	return function() {
		if (self.mainClass == undefined){
			self.mainClass = self.attr('class').split(' ')[0]
		}
		self.addClass(self.mainClass)
		return self
	}()
}
