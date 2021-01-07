/*
*	BlockElement
*/
$.fn.BlockElement = function(_block_class)
{
	var _el = this;
	_el.block_class = undefined;

	/* Get original block class */
	_el.getBlockClass = function()
	{
		return _el.block_class;
	};

	/* Add an element */
	_el.addElement = function(_element_class, _element)
	{
		if (_element == undefined) _element = "div";
		var newBlockElement = $('<' + _element + '>').BlockElement(_el.getBlockClass() + "__" + _element_class);
		return newBlockElement;
	};

	/* Add a modifier */
	_el.addModifier = function(_modifier_class)
	{
		_el.addClass(_el.block_class + "--" + _modifier_class);
		return _el;
	};

  /* Has a modifier */
  _el.hasModifier = function(_modifier_class)
	{
		return _el.hasClass(_el.block_class + "--" + _modifier_class);
	};

	/* Remove a modifier */
	_el.removeModifier = function(_modifier_class)
	{
		_el.removeClass(_el.block_class + "--" + _modifier_class);
		return _el;
	};

	/* Initializer */
	return function()
	{
		if (_block_class == undefined){
			_block_class = _el.attr("class").split(" ")[0];
		}
		_el.block_class = _block_class;
		_el.addClass(_el.block_class)
		return _el;
	}();
}
